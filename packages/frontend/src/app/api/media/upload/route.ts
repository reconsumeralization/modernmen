import { NextRequest, NextResponse } from 'next/server'
import getPayloadClient from '@/payload'
import { logger } from '@/lib/logger'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

// Route segment config for file uploads
export const maxDuration = 30 // 30 seconds for file processing
export const dynamic = 'force-dynamic' // Ensure dynamic rendering for file uploads

export interface MediaUploadOptions {
  collection?: string
  folder?: string
  resize?: {
    width?: number
    height?: number
    quality?: number
  }
  generateThumbnails?: boolean
  allowedTypes?: string[]
  maxSize?: number
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const options: MediaUploadOptions = JSON.parse(formData.get('options') as string || '{}')

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    logger.info('📁 Processing file upload', { 
      filename: file.name, 
      size: file.size, 
      type: file.type 
    })

    // Validate file
    const validation = validateFile(file, options)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Process and save file
    const uploadResult = await processFileUpload(file, options)

    // Save to Payload CMS
    const payload = await getPayloadClient()
    const mediaRecord = await payload.create({
      collection: 'media',
      data: {
        filename: uploadResult.filename,
        alt: uploadResult.alt || file.name,
        mimeType: file.type,
        filesize: file.size,
        width: uploadResult.width,
        height: uploadResult.height,
        focalX: 50,
        focalY: 50,
        url: uploadResult.url,
        thumbnails: uploadResult.thumbnails || []
      }
    })

    logger.info('✅ File upload completed successfully', { id: mediaRecord.id })

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      urls: {
        original: uploadResult.url,
        thumbnails: uploadResult.thumbnails
      }
    })

  } catch (error) {
    logger.error('❌ File upload failed:', { operation: 'media_upload' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'File upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  const mediaId = url.searchParams.get('id')

  if (action === 'info' && mediaId) {
    return await getMediaInfo(mediaId)
  }

  if (action === 'list') {
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const page = parseInt(url.searchParams.get('page') || '1')
    const type = url.searchParams.get('type')
    
    return await listMedia(limit, page, type)
  }

  return NextResponse.json({
    message: 'Media Upload API',
    description: 'Handle file uploads with image processing and thumbnail generation',
    endpoints: {
      'POST /': 'Upload a new file',
      'GET /?action=info&id=ID': 'Get media information',
      'GET /?action=list&limit=20&page=1&type=image': 'List media files'
    },
    supportedFormats: {
      images: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      documents: ['pdf', 'doc', 'docx'],
      video: ['mp4', 'mov', 'avi'],
      audio: ['mp3', 'wav', 'ogg']
    },
    maxFileSize: '10MB'
  })
}

export async function DELETE(request: NextRequest) {
  try {
    const { mediaId } = await request.json()
    
    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'Media ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()
    
    // Get media record to find file paths
    const media = await payload.findByID({
      collection: 'media',
      id: mediaId
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    // Delete physical files
    await deletePhysicalFiles(media)

    // Delete from database
    await payload.delete({
      collection: 'media',
      id: mediaId
    })

    logger.info('✅ Media deleted successfully', { id: mediaId })

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error) {
    logger.error('❌ Media deletion failed:', { operation: 'media_delete' }, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Media deletion failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Validate uploaded file
function validateFile(file: File, options: MediaUploadOptions): { valid: boolean; error?: string } {
  const {
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxSize = 10 * 1024 * 1024 // 10MB
  } = options

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Supported types: ${allowedTypes.join(', ')}`
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${formatBytes(file.size)} exceeds maximum allowed size of ${formatBytes(maxSize)}`
    }
  }

  return { valid: true }
}

// Process and save uploaded file
async function processFileUpload(file: File, options: MediaUploadOptions) {
  const {
    folder = 'uploads',
    resize,
    generateThumbnails = true
  } = options

  // Create unique filename
  const fileExtension = path.extname(file.name)
  const baseName = path.basename(file.name, fileExtension)
  const uniqueId = randomUUID()
  const filename = `${baseName}-${uniqueId}${fileExtension}`

  // Create upload directory
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, filename)
  const publicUrl = `/uploads/${folder}/${filename}`

  // Convert file to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  let processedBuffer = buffer
  let width: number | undefined
  let height: number | undefined
  let thumbnails: any[] = []

  // Process images with Sharp
  if (file.type.startsWith('image/')) {
    try {
      let sharpInstance = sharp(buffer)
      const metadata = await sharpInstance.metadata()
      
      width = metadata.width
      height = metadata.height

      // Resize if requested
      if (resize && (resize.width || resize.height)) {
        sharpInstance = sharpInstance.resize(resize.width, resize.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        
        const resizedMetadata = await sharpInstance.metadata()
        width = resizedMetadata.width
        height = resizedMetadata.height
      }

      // Optimize image
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        sharpInstance = sharpInstance.jpeg({ 
          quality: resize?.quality || 90,
          progressive: true
        })
      } else if (file.type === 'image/png') {
        sharpInstance = sharpInstance.png({ 
          compressionLevel: 9,
          progressive: true
        })
      } else if (file.type === 'image/webp') {
        sharpInstance = sharpInstance.webp({ 
          quality: resize?.quality || 90
        })
      }

      processedBuffer = await sharpInstance.toBuffer()

      // Generate thumbnails
      if (generateThumbnails) {
        thumbnails = await generateImageThumbnails(buffer, filename, uploadDir, folder)
      }

    } catch (error) {
      logger.warn('Image processing failed, using original:', error)
      processedBuffer = buffer
    }
  }

  // Save processed file
  await writeFile(filePath, processedBuffer)

  logger.info('✅ File saved successfully', { 
    path: publicUrl, 
    size: processedBuffer.length,
    thumbnails: thumbnails.length
  })

  return {
    filename,
    url: publicUrl,
    width,
    height,
    thumbnails,
    alt: `Uploaded ${file.name}`
  }
}

// Generate image thumbnails
async function generateImageThumbnails(
  originalBuffer: Buffer, 
  originalFilename: string, 
  uploadDir: string, 
  folder: string
): Promise<any[]> {
  const thumbnailSizes = [
    { name: 'small', width: 150, height: 150 },
    { name: 'medium', width: 300, height: 300 },
    { name: 'large', width: 600, height: 600 }
  ]

  const thumbnails = []
  const baseName = path.basename(originalFilename, path.extname(originalFilename))
  const extension = path.extname(originalFilename)

  for (const size of thumbnailSizes) {
    try {
      const thumbnailFilename = `${baseName}-${size.name}${extension}`
      const thumbnailPath = path.join(uploadDir, 'thumbnails', thumbnailFilename)
      const publicUrl = `/uploads/${folder}/thumbnails/${thumbnailFilename}`

      // Create thumbnails directory
      await mkdir(path.dirname(thumbnailPath), { recursive: true })

      // Generate thumbnail
      await sharp(originalBuffer)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath)

      thumbnails.push({
        name: size.name,
        url: publicUrl,
        width: size.width,
        height: size.height
      })

      logger.info(`✅ Generated ${size.name} thumbnail`, { url: publicUrl })

    } catch (error) {
      logger.warn(`Failed to generate ${size.name} thumbnail:`, error)
    }
  }

  return thumbnails
}

// Get media information
async function getMediaInfo(mediaId: string) {
  try {
    const payload = await getPayloadClient()
    
    const media = await payload.findByID({
      collection: 'media',
      id: mediaId
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      media
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media info' },
      { status: 500 }
    )
  }
}

// List media files
async function listMedia(limit: number, page: number, type?: string) {
  try {
    const payload = await getPayloadClient()
    
    const where: any = {}
    if (type) {
      where.mimeType = { like: type }
    }

    const media = await payload.find({
      collection: 'media',
      where,
      limit,
      page,
      sort: '-createdAt'
    })

    return NextResponse.json({
      success: true,
      media: media.docs,
      pagination: {
        page: media.page,
        pages: media.totalPages,
        total: media.totalDocs
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to list media' },
      { status: 500 }
    )
  }
}

// Delete physical files
async function deletePhysicalFiles(media: any) {
  try {
    // Delete main file
    if (media.url) {
      const mainFilePath = path.join(process.cwd(), 'public', media.url)
      await import('fs').then(fs => fs.promises.unlink(mainFilePath)).catch(() => {})
    }

    // Delete thumbnails
    if (media.thumbnails && Array.isArray(media.thumbnails)) {
      for (const thumbnail of media.thumbnails) {
        if (thumbnail.url) {
          const thumbPath = path.join(process.cwd(), 'public', thumbnail.url)
          await import('fs').then(fs => fs.promises.unlink(thumbPath)).catch(() => {})
        }
      }
    }

    logger.info('✅ Physical files deleted')

  } catch (error) {
    logger.warn('Some files could not be deleted:', error)
  }
}

// Utility function to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Media processing utilities
export const MediaUtils = {
  // Image optimization presets
  imagePresets: {
    profile: { width: 200, height: 200, quality: 90 },
    gallery: { width: 800, height: 600, quality: 85 },
    thumbnail: { width: 150, height: 150, quality: 80 },
    banner: { width: 1200, height: 400, quality: 85 }
  },

  // Supported file types
  supportedTypes: {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    videos: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  },

  // File size limits (in bytes)
  sizeLimits: {
    image: 10 * 1024 * 1024, // 10MB
    document: 20 * 1024 * 1024, // 20MB
    video: 100 * 1024 * 1024, // 100MB
    audio: 50 * 1024 * 1024 // 50MB
  }
}