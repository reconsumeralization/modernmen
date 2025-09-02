// =============================================================================
// ADMIN APPOINTMENT BY ID API - Individual appointment CRUD operations
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { authService } from '@/services/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication and permissions
    const user = authService.getCurrentUser();
    if (!user || !authService.canAccessAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customer:customers(*),
        service:services(*),
        staff:staff(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment: data });

  } catch (error) {
    console.error('Get appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication and permissions
    const user = authService.getCurrentUser();
    if (!user || !authService.canAccessAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const updates = await request.json();

    // Validate appointment exists
    const { data: existing, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update appointment
    const { data, error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_by: user.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to update appointment' },
        { status: 500 }
      );
    }

    // TODO: Send update notification if needed
    // if (updates.status && updates.status !== existing.status) {
    //   await sendAppointmentUpdateNotification(data);
    // }

    return NextResponse.json({
      appointment: data,
      message: 'Appointment updated successfully',
    });

  } catch (error) {
    console.error('Update appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication and permissions (admin only for deletion)
    const user = authService.getCurrentUser();
    if (!user || !authService.hasRole('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate appointment exists
    const { data: existing, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Delete appointment
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      return NextResponse.json(
        { error: 'Failed to delete appointment' },
        { status: 500 }
      );
    }

    // TODO: Send cancellation notification
    // await sendAppointmentCancellationNotification(existing);

    return NextResponse.json({
      message: 'Appointment deleted successfully',
    });

  } catch (error) {
    console.error('Delete appointment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
