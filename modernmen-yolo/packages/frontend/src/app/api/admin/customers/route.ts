// =============================================================================
// ADMIN CUSTOMERS API - CRUD operations for customer management
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
    const loyaltyTier = searchParams.get('loyaltyTier');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    const filters: any = {};
    if (loyaltyTier) filters.loyaltyTier = loyaltyTier;
    if (search) filters.search = search;
    if (isActive !== null) filters.isActive = isActive === 'true';

    const { data: customers, error } = await dbHelpers.getCustomers(filters);

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      );
    }

    // Paginate results
    const total = customers?.length || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = customers?.slice(startIndex, endIndex) || [];

    return NextResponse.json({
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Customers API error:', error);
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
      email,
      phone,
      dateOfBirth,
      address,
      preferences,
      communication,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    // Create customer
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name,
        email,
        phone,
        date_of_birth: dateOfBirth,
        street_address: address?.street,
        city: address?.city,
        state_province: address?.state,
        postal_code: address?.zipCode,
        country: address?.country || 'USA',
        email_marketing: communication?.emailMarketing ?? true,
        sms_marketing: communication?.smsMarketing ?? true,
        appointment_reminders: communication?.appointmentReminders ?? true,
        birthday_messages: communication?.birthdayMessages ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customer: data,
      message: 'Customer created successfully',
    });

  } catch (error) {
    console.error('Create customer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
