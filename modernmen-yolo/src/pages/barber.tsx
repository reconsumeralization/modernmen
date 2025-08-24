import React from 'react';
import { BarberHeader } from '../components/barber-header/BarberHeader';
import { ServiceCard } from '../components/service-card/ServiceCard';
import { AppointmentForm } from '../components/appointment-form/AppointmentForm';
import { BarberGallery } from '../components/barber-gallery/BarberGallery';
import { BarberTestimonial } from '../components/barber-testimonial/BarberTestimonial';

const BarberPage: React.FC = () => {
  return (
    <>
      <BarberHeader />
      <ServiceCard />
      <BarberGallery />
      <BarberTestimonial />
      <AppointmentForm />
    </>
  );
};

export default BarberPage;
