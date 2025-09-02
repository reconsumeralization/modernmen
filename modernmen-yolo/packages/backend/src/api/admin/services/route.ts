// =============================================================================
// ADMIN SERVICES API - CRUD operations for service management
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers, supabase } from '@/lib/supabase/client';
import { authService } from '@/services/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const user = authService.getCurrentUser();
    if (!user || !authService.canAccessAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const filters: any = {};
    if (category) filters.category = category;
    if (isActive !== null) filters.isActive = isActive === 'true';
    if (featured !== null) filters.featured = featured === 'true';

    const { data: services, error } = await dbHelpers.getServices(filters);

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    // Filter by search term if provided
    let filteredServices = services || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    filteredServices.sort((a, b) => a.name.localeCompare(b.name));

    // Paginate results
    const total = filteredServices.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    return NextResponse.json({
      services: paginatedServices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const user = authService.getCurrentUser();
    if (!user || !authService.canAccessAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      category,
      price,
      duration,
      isActive = true,
      featured = false,
      images = [],
      benefits = [],
      preparationInstructions,
      aftercareInstructions,
      advanceBookingDays = 30,
      cancellationHours = 24,
      requiresDeposit = false,
      depositPercentage = 25,
      metaTitle,
      metaDescription,
      keywords,
    } = body;

    // Validate required fields
    if (!name || !category || !price || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, duration' },
        { status: 400 }
      );
    }

    // Create service
    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        description,
        short_description: shortDescription,
        category,
        price,
        duration,
        is_active: isActive,
        featured,
        images,
        benefits,
        preparation_instructions: preparationInstructions,
        aftercare_instructions: aftercareInstructions,
        advance_booking_days: advanceBookingDays,
        cancellation_hours: cancellationHours,
        requires_deposit: requiresDeposit,
        deposit_percentage: depositPercentage,
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      service: data,
      message: 'Service created successfully',
    });

  } catch (error) {
    console.error('Create service API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
