// =============================================================================
// ADMIN STAFF API - CRUD operations for staff management
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
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const filters: any = {};
    if (role) filters.role = role;
    if (isActive !== null) filters.isActive = isActive === 'true';

    const { data: staff, error } = await dbHelpers.getStaff(filters);

    if (error) {
      console.error('Error fetching staff:', error);
      return NextResponse.json(
        { error: 'Failed to fetch staff' },
        { status: 500 }
      );
    }

    // Filter by search term if provided
    let filteredStaff = staff || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStaff = filteredStaff.filter(member =>
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by name
    filteredStaff.sort((a, b) => a.name.localeCompare(b.name));

    // Paginate results
    const total = filteredStaff.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

    return NextResponse.json({
      staff: paginatedStaff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Staff API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions (admin only for creating staff)
    const user = authService.getCurrentUser();
    if (!user || !authService.hasRole('admin')) {
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
      role,
      specialties = [],
      bio,
      avatar,
      hireDate,
      hourlyRate,
      commissionRate,
      workingHours,
      emergencyContact,
      isActive = true,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !role || !hireDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, role, hireDate' },
        { status: 400 }
      );
    }

    // Create staff member
    const { data, error } = await supabase
      .from('staff')
      .insert({
        name,
        email,
        phone,
        role,
        specialties,
        bio,
        avatar,
        hire_date: hireDate,
        hourly_rate: hourlyRate,
        commission_rate: commissionRate,
        working_hours: workingHours || {
          monday: { start: '09:00', end: '17:00', isWorking: true },
          tuesday: { start: '09:00', end: '17:00', isWorking: true },
          wednesday: { start: '09:00', end: '17:00', isWorking: true },
          thursday: { start: '09:00', end: '17:00', isWorking: true },
          friday: { start: '09:00', end: '17:00', isWorking: true },
          saturday: { start: '09:00', end: '17:00', isWorking: true },
          sunday: { start: '09:00', end: '17:00', isWorking: false },
        },
        emergency_contact_name: emergencyContact?.name,
        emergency_contact_relationship: emergencyContact?.relationship,
        emergency_contact_phone: emergencyContact?.phone,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      return NextResponse.json(
        { error: 'Failed to create staff member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      staff: data,
      message: 'Staff member created successfully',
    });

  } catch (error) {
    console.error('Create staff API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
