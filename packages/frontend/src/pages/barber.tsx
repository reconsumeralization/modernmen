import React from 'react';
import { Header as BarberHeader } from '../components/barber/Header';
import { ServiceCard } from '../components/barber/ServiceCard';
import { AppointmentForm } from '../components/barber/AppointmentForm';
import { BarberGallery } from '../components/barber/Gallery';
import { BarberTestimonial } from '../components/barber/Testimonial';

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
