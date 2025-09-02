import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active') !== 'false'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', active)
      .order('name', { ascending: true })
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: services, error } = await query

    if (error) throw error

    return NextResponse.json(services || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.category || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' },
        { status: 400 }
      )
    }

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        name: body.name,
        description: body.description || '',
        category: body.category,
        price: body.price,
        duration: body.duration || 30,
        is_active: body.active !== false,
        featured: body.featured || false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
