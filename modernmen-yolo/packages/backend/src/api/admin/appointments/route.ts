import { smsService } from '@/services/smsService';
import { emailService } from '@/services/emailService';

// =============================================================================
// ADMIN APPOINTMENTS API - CRUD operations for appointment management
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
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const customerId = searchParams.get('customerId');
    const staffId = searchParams.get('staffId');
    const search = searchParams.get('search');

    // Build filters
    const filters: any = {};
    if (status) filters.status = status;
    if (date) filters.date = date;
    if (customerId) filters.customerId = customerId;
    if (staffId) filters.staffId = staffId;

    const { data: appointments, error } = await dbHelpers.getAppointments(filters);

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    // Filter by search term if provided
    let filteredAppointments = appointments || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.customer_name.toLowerCase().includes(searchLower) ||
        apt.customer_email.toLowerCase().includes(searchLower)
      );
    }

    // Paginate results
    const total = filteredAppointments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    return NextResponse.json({
      appointments: paginatedAppointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Appointments API error:', error);
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
      customerId,
      serviceId,
      staffId,
      appointmentDate,
      startTime,
      duration = 60,
      notes,
      customerNotes,
    } = body;

    // Validate required fields
    if (!customerId || !serviceId || !staffId || !appointmentDate || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get customer details
    const { data: customer, error: customerError } = await dbHelpers.getUserById(customerId);
    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get service details
    const { data: services, error: servicesError } = await dbHelpers.getServices({ isActive: true });
    const service = services?.find(s => s.id === serviceId);
    if (servicesError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get staff details
    const { data: staff, error: staffError } = await dbHelpers.getStaff({ isActive: true });
    const staffMember = staff?.find(s => s.id === staffId);
    if (staffError || !staffMember) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_id: customerId,
        service_id: serviceId,
        staff_id: staffId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        appointment_date: appointmentDate,
        start_time: startTime,
        duration,
        price: service.price,
        notes,
        customer_notes: customerNotes,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation notification
    await emailService.sendAppointmentConfirmation(data);

    if (smsService.isConfigured() && customer.phone) {
      await smsService.sendAppointmentConfirmation(customer.phone, data);
    }

    return NextResponse.json({
      appointment: data,
      message: 'Appointment created successfully',
    });

  } catch (error) {
    console.error('Create appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
