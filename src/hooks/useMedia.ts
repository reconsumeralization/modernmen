'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Media {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadMediaData {
  file: File;
  alt?: string;
  caption?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
}

export function useMedia() {
  const queryClient = useQueryClient();

  // Get all media
  const {
    data: media = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch media');
      return response.json();
    }
  });

  // Upload media
  const uploadMediaMutation = useMutation({
    mutationFn: async (data: UploadMediaData) => {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.alt) formData.append('alt', data.alt);
      if (data.caption) formData.append('caption', data.caption);
      if (data.seoTitle) formData.append('seoTitle', data.seoTitle);
      if (data.seoDescription) formData.append('seoDescription', data.seoDescription);
      if (data.keywords) formData.append('keywords', data.keywords);

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload media');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });

  // Update media
  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Media> }) => {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update media');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });

  // Delete media
  const deleteMediaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete media');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });

  // Get media by ID
  const getMediaById = useCallback((id: string) => {
    return media.find((item: { id: string; }) => item.id === id);
  }, [media]);

  // Get media by type
  const getMediaByType = useCallback((type: 'image' | 'video' | 'audio' | 'document') => {
    const typeMap = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
      audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    return media.filter((item: { mimeType: string; }) => typeMap[type].includes(item.mimeType));
  }, [media]);

  // Search media
  const searchMedia = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return media.filter((item: { filename: string; alt: string; caption: string; keywords: string; }) =>
      item.filename.toLowerCase().includes(lowercaseQuery) ||
      item.alt?.toLowerCase().includes(lowercaseQuery) ||
      item.caption?.toLowerCase().includes(lowercaseQuery) ||
      item.keywords?.toLowerCase().includes(lowercaseQuery)
    );
  }, [media]);

  // Get recent media
  const getRecentMedia = useCallback((limit: number = 20) => {
    return [...media]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [media]);

  // Get media statistics
  const getMediaStats = useCallback(() => {
    const stats = {
      total: media.length,
      totalSize: media.reduce((sum: any, item: { filesize: any; }) => sum + item.filesize, 0),
      byType: {} as Record<string, number>,
      images: media.filter((item: { mimeType: string; }) => item.mimeType.startsWith('image/')).length,
      videos: media.filter((item: { mimeType: string; }) => item.mimeType.startsWith('video/')).length,
      documents: media.filter((item: { mimeType: string; }) => !item.mimeType.startsWith('image/') && !item.mimeType.startsWith('video/')).length
    };

    media.forEach((item: { mimeType: string; }) => {
      const type = item.mimeType.split('/')[0];
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }, [media]);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get image dimensions
  const getImageDimensions = useCallback((mediaItem: Media) => {
    if (!mediaItem.width || !mediaItem.height) return null;
    return {
      width: mediaItem.width,
      height: mediaItem.height,
      aspectRatio: mediaItem.width / mediaItem.height,
      orientation: mediaItem.width > mediaItem.height ? 'landscape' : mediaItem.width < mediaItem.height ? 'portrait' : 'square'
    };
  }, []);

  return {
    media,
    isLoading,
    error,
    refetch,
    uploadMedia: uploadMediaMutation.mutate,
    updateMedia: updateMediaMutation.mutate,
    deleteMedia: deleteMediaMutation.mutate,
    isUploading: uploadMediaMutation.isPending,
    isUpdating: updateMediaMutation.isPending,
    isDeleting: deleteMediaMutation.isPending,
    getMediaById,
    getMediaByType,
    searchMedia,
    getRecentMedia,
    getMediaStats,
    formatFileSize,
    getImageDimensions
  };
}