// pages/AppointmentBookingPage.tsx
// This page can serve as the main appointment booking page if needed
// It can wrap the modal or have its own layout
// For now, this serves as an example of how the structure would work

import { AppointmentBookingModal } from "../components/AppointmentBookingModal";

interface AppointmentBookingPageProps {
  doctor: any;
}

const AppointmentBookingPage = ({ doctor }: AppointmentBookingPageProps) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pesan Janji Temu</h1>
      <AppointmentBookingModal 
        doctor={doctor} 
        trigger={<button className="btn btn-primary">Pesan Janji</button>} 
      />
    </div>
  );
};

export default AppointmentBookingPage;