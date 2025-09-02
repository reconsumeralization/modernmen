// =============================================================================
// ADMIN DASHBOARD API - Provides real-time dashboard data
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/supabase/client';
import { authService } from '@/services/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const user = authService.getCurrentUser();
    if (!user || !authService.canAccessAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get date range from query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Fetch dashboard data in parallel
    const [
      appointmentsResult,
      customersResult,
      servicesResult,
      staffResult,
      notificationsResult,
    ] = await Promise.allSettled([
      // Appointments data
      dbHelpers.getAppointments({
        status: 'confirmed',
      }),

      // Customer statistics
      dbHelpers.getCustomers(),

      // Services data
      dbHelpers.getServices({ isActive: true }),

      // Staff data
      dbHelpers.getStaff({ isActive: true }),

      // Recent notifications
      dbHelpers.getNotifications({
        status: 'sent',
      }),
    ]);

    // Extract successful results
    const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.data || [] : [];
    const customers = customersResult.status === 'fulfilled' ? customersResult.value.data || [] : [];
    const services = servicesResult.status === 'fulfilled' ? servicesResult.value.data || [] : [];
    const staff = staffResult.status === 'fulfilled' ? staffResult.value.data || [] : [];
    const notifications = notificationsResult.status === 'fulfilled' ? notificationsResult.value.data || [] : [];

    // Calculate key metrics
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekStart = thisWeek.toISOString().split('T')[0];

    // Today's appointments
    const todayAppointments = appointments.filter(apt =>
      apt.appointment_date === today && apt.status === 'confirmed'
    );

    // This week's appointments
    const weekAppointments = appointments.filter(apt =>
      apt.appointment_date >= weekStart && apt.status === 'confirmed'
    );

    // Revenue calculations
    const todayRevenue = todayAppointments.reduce((sum, apt) => sum + apt.price, 0);
    const weekRevenue = weekAppointments.reduce((sum, apt) => sum + apt.price, 0);

    // Customer metrics
    const totalCustomers = customers.length;
    const newCustomersThisWeek = customers.filter(cust =>
      cust.created_at >= thisWeek.toISOString()
    ).length;

    // Service utilization
    const serviceStats = services.map(service => {
      const serviceAppointments = appointments.filter(apt => apt.service_id === service.id);
      const revenue = serviceAppointments.reduce((sum, apt) => sum + apt.price, 0);

      return {
        name: service.name,
        count: serviceAppointments.length,
        revenue: revenue,
        percentage: appointments.length > 0 ? (serviceAppointments.length / appointments.length) * 100 : 0,
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    // Staff performance
    const staffStats = staff.map(member => {
      const staffAppointments = appointments.filter(apt => apt.staff_id === member.id);
      const revenue = staffAppointments.reduce((sum, apt) => sum + apt.price, 0);

      return {
        name: member.name,
        appointments: staffAppointments.length,
        revenue: revenue,
        rating: member.rating || 0,
      };
    });

    // Recent appointments (last 10)
    const recentAppointments = appointments
      .filter(apt => apt.status === 'confirmed')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(apt => ({
        id: apt.id,
        customerName: apt.customer_name,
        service: services.find(s => s.id === apt.service_id)?.name || 'Unknown Service',
        barber: staff.find(s => s.id === apt.staff_id)?.name || 'Unknown Staff',
        time: apt.start_time,
        date: apt.appointment_date,
        status: apt.status,
      }));

    // Recent notifications (last 5)
    const recentNotifications = notifications
      .slice(0, 5)
      .map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.created_at,
        read: false, // This would be tracked separately
      }));

    // Dashboard overview data
    const dashboardData = {
      // Key metrics
      metrics: {
        revenue: {
          today: todayRevenue,
          week: weekRevenue,
          month: weekRevenue * 4, // Approximate
        },
        appointments: {
          today: todayAppointments.length,
          week: weekAppointments.length,
          completed: appointments.filter(apt => apt.status === 'completed').length,
          pending: appointments.filter(apt => apt.status === 'confirmed').length,
          cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
        },
        customers: {
          total: totalCustomers,
          newThisWeek: newCustomersThisWeek,
          active: customers.filter(cust => cust.is_active).length,
        },
        staff: {
          total: staff.length,
          active: staff.filter(member => member.is_active).length,
        },
      },

      // Charts data
      charts: {
        revenueByDay: await getRevenueByDay(days),
        appointmentsByService: serviceStats,
        staffPerformance: staffStats,
        customerGrowth: await getCustomerGrowth(days),
      },

      // Recent activity
      recent: {
        appointments: recentAppointments,
        notifications: recentNotifications,
      },

      // System status
      system: {
        lastUpdated: new Date().toISOString(),
        dataFreshness: 'real-time',
        apiStatus: 'operational',
      },
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for chart data
async function getRevenueByDay(days: number) {
  try {
    const { appointments, error } = await dbHelpers.getAnalyticsData('day', days);

    if (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }

    // Group appointments by date and calculate daily revenue
    const revenueByDate: { [key: string]: number } = {};

    appointments.forEach((apt: any) => {
      const date = apt.appointment_date;
      revenueByDate[date] = (revenueByDate[date] || 0) + apt.price;
    });

    // Convert to array format for charts
    return Object.entries(revenueByDate)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

  } catch (error) {
    console.error('Error calculating revenue by day:', error);
    return [];
  }
}

async function getCustomerGrowth(days: number) {
  try {
    const { customers, error } = await dbHelpers.getAnalyticsData('day', days);

    if (error) {
      console.error('Error fetching customer growth data:', error);
      return [];
    }

    // Group customers by creation date
    const customersByDate: { [key: string]: number } = {};

    customers.forEach((cust: any) => {
      const date = cust.created_at.split('T')[0];
      customersByDate[date] = (customersByDate[date] || 0) + 1;
    });

    // Convert to array format for charts
    return Object.entries(customersByDate)
      .map(([date, count]) => ({
        date,
        customers: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

  } catch (error) {
    console.error('Error calculating customer growth:', error);
    return [];
  }
}
