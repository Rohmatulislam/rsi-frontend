import { useState, useEffect } from 'react';
import { AppointmentFormData, PatientSearchState, PatientData, AvailableDate } from '../services/appointmentService';
import { useCreateAppointment } from '../api/createAppointment';
import { toast } from "sonner";

export const useAppointmentForm = (doctor: any, user?: any, serviceItem?: { id: string, name: string }, initialPoliId?: string) => {
  // Simplifikasi alur: 3 Langkah utama
  // Langkah 1: Jadwal (Poli + Tanggal + Waktu)
  // Langkah 2: Data & Konfirmasi (Form + Summary + Persetujuan)
  // Langkah 3: Selesai (Success)
  const [step, setStep] = useState(1);
  const [bookingCode, setBookingCode] = useState('');

  // Tentukan poli awal
  let initialPoli = { poliId: '', poliName: '' };
  if (initialPoliId) {
    initialPoli = { poliId: initialPoliId, poliName: '' }; // Name will be filled by step or backend
  } else if (doctor?.categories && doctor.categories.length === 1) {
    initialPoli = {
      poliId: doctor.categories[0].id || doctor.categories[0].slug || "1",
      poliName: doctor.categories[0].name
    };
  }

  const [formData, setFormData] = useState<AppointmentFormData>({
    poliId: initialPoli.poliId,
    poliName: initialPoli.poliName,
    serviceItemId: serviceItem?.id,
    serviceItemName: serviceItem?.name,
    date: '',
    time: '',
    patientType: 'old',
    mrNumber: '',
    nik: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    gender: '' as 'L' | 'P' | '',
    paymentType: '', // kd_pj dari Khanza
    paymentName: '', // png_jawab dari Khanza
    bpjsNumber: '',
    keluhan: '',
    religion: '',
    consentTerms: false,
    consentPrivacy: false,
    consentFee: false,
    bpjsClass: '',
    bpjsFaskes: '',
    bpjsRujukan: '',
    penanggungJawab: '',
    hubunganPenanggungJawab: '',  // Hubungan dengan pasien
  });

  // Patient search state
  const [patientSearch, setPatientSearch] = useState<PatientSearchState>({
    loading: false,
    found: false,
    patientData: null,
    error: '',
  });

  const createAppointmentMutation = useCreateAppointment();
  const loading = createAppointmentMutation.isPending;

  // Persistence Key
  const DRAFT_KEY = `booking_draft_${doctor?.id || 'unknown'}`;

  // NEW: Auto-fill for New Patient using User Profile data
  useEffect(() => {
    // Only auto-fill if user is logged in AND it's a new paitent type
    // AND the form fields for these are still empty (to avoid overwriting manual changes or drafts)
    if (user && formData.patientType === 'new' && !formData.nik && !formData.fullName) {
      console.log('✨ [AUTO-FILL] Populating form with user profile data');

      setFormData(prev => ({
        ...prev,
        nik: (user as any).nik || prev.nik,
        fullName: user.name || prev.fullName,
        phone: (user as any).phoneNumber || (user as any).phone || prev.phone,
        email: user.email || prev.email,
        address: (user as any).address || prev.address,
        birthDate: (user as any).birthDate || prev.birthDate,
        gender: (user as any).gender || prev.gender,
      }));
    }
  }, [user, formData.patientType]);

  // Load draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const { step: savedStep, formData: savedData } = JSON.parse(savedDraft);

        // Only load if it's not a success step (step 3)
        if (savedStep < 3) {
          setStep(savedStep);
          setFormData(prev => ({ ...prev, ...savedData }));

          // Re-search patient if mrNumber was saved
          if (savedData.mrNumber && savedData.patientType === 'old') {
            searchPatient(savedData.mrNumber);
          }
        }
      } catch (e) {
        console.error('Error loading booking draft:', e);
      }
    }
  }, [DRAFT_KEY, doctor?.id]);

  // Save draft on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't save if in success step
    if (step < 3) {
      const draft = {
        step,
        formData: {
          ...formData,
          consentTerms: false, // Don't persist consents for safety
          consentPrivacy: false,
          consentFee: false,
        },
        timestamp: new Date().getTime()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [formData, step, DRAFT_KEY]);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  // Search patient by RM number or NIK
  const searchPatient = async (identifier: string) => {
    if (!identifier || identifier.length < 3) {
      setPatientSearch({ loading: false, found: false, patientData: null, error: '' });
      return;
    }

    // Determine type based on length (NIK is 16 digits, RM is typically 6 or less)
    const isNIK = identifier.length >= 15; // NIK is exact 16, but 15+ is a safe bet for detection
    const typeLabel = isNIK ? 'NIK' : 'RM';

    console.log(`🔍 [SEARCH] Starting patient search for ${typeLabel}:`, identifier);
    setPatientSearch({ loading: true, found: false, patientData: null, error: '' });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000/api';
      const endpoint = isNIK ? 'search-patient-nik' : 'search-patient';
      const url = `${baseUrl}/appointments/${endpoint}/${identifier}`;
      console.log('🔍 [SEARCH] Fetching URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (data.found) {
        console.log(`✅ [SEARCH] Patient found via ${typeLabel}:`, data.patient.nm_pasien);
        setPatientSearch({
          loading: false,
          found: true,
          patientData: data.patient as PatientData,
          error: '',
        });

        // Auto-fill form data with patient data
        setFormData(prev => ({
          ...prev,
          mrNumber: data.patient.no_rkm_medis || prev.mrNumber,
          nik: data.patient.no_ktp || prev.nik,
          fullName: data.patient.nm_pasien || prev.fullName,
          phone: data.patient.no_tlp || prev.phone,
          email: data.patient.email || prev.email,
          address: data.patient.alamat || prev.address,
          birthDate: data.patient.tgl_lahir || prev.birthDate,
          gender: (data.patient.jk === 'L' || data.patient.jk === 'P' ? data.patient.jk : '') as 'L' | 'P' | '',
          religion: data.patient.agama || prev.religion,
          bpjsNumber: data.patient.no_peserta || prev.bpjsNumber,
        }));
      } else {
        console.warn(`⚠️ [SEARCH] Patient not found via ${typeLabel}:`, data.message);
        setPatientSearch({
          loading: false,
          found: false,
          patientData: null,
          error: data.message || 'Pasien tidak ditemukan',
        });
      }
    } catch (error) {
      console.error('❌ [SEARCH] Error occurred:', error);
      setPatientSearch({
        loading: false,
        found: false,
        patientData: null,
        error: 'Gagal mencari data pasien',
      });
    }
  };

  // Generate available dates based on doctor schedules
  const getAvailableDates = (): AvailableDate[] => {
    const dates: AvailableDate[] = [];
    const today = new Date();
    const daysMap: Record<number, string> = {
      0: 'Minggu',
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu',
    };

    // Generate next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Check if doctor has schedule on this day
      const dayOfWeek = date.getDay();
      const hasSchedule = doctor?.schedules?.some((s: any) => s.dayOfWeek === dayOfWeek);

      if (hasSchedule) {
        const schedule = doctor?.schedules?.find((s: any) => s.dayOfWeek === dayOfWeek);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = daysMap[dayOfWeek];
        const dateDisplay = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        dates.push({
          value: dateStr,
          label: `${dayName}, ${dateDisplay} (${schedule?.startTime || '08:00'} - ${schedule?.endTime || '14:00'})`,
        });
      }
    }

    return dates;
  };

  // Generate available times for a selected date based on doctor's schedule
  const getAvailableTimesForDate = (selectedDate: string): string[] => {
    if (!selectedDate || !doctor?.schedules) return [];

    // Find the doctor's schedule for this day of week
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();

    // Get the schedule for this day
    const schedule = doctor?.schedules?.find((s: any) => s.dayOfWeek === dayOfWeek);
    if (!schedule) return [];

    // Extract start and end times
    const startTime = schedule.startTime || '08:00';
    const endTime = schedule.endTime || '17:00';

    // Generate time slots (30-min intervals)
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]) || 0;
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]) || 0;

    const times: string[] = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    // Create time slots
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      times.push(timeString);

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute = 0;
      }
    }

    return times;
  };

  const resetForm = (currentDoctor: any = doctor) => {
    // Jika dokter hanya memiliki 1 poliklinik, kita langsung set dan lanjut ke langkah 2
    const resetStep = (currentDoctor?.categories && currentDoctor.categories.length === 1) ? 2 : 1;
    const resetPoli = (currentDoctor?.categories && currentDoctor.categories.length === 1)
      ? {
        poliId: currentDoctor.categories[0].id || currentDoctor.categories[0].slug || "1",
        poliName: currentDoctor.categories[0].name
      }
      : { poliId: '', poliName: '' };

    setStep(resetStep);
    setBookingCode('');
    setFormData({
      poliId: resetPoli.poliId,
      poliName: resetPoli.poliName,
      date: '',
      time: '',
      patientType: 'old',
      mrNumber: '',
      nik: '',
      fullName: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      gender: '',
      paymentType: '', // kd_pj dari Khanza
      paymentName: '', // png_jawab dari Khanza
      bpjsNumber: '',
      keluhan: '',
      religion: '',
      consentTerms: false,
      consentPrivacy: false,
      consentFee: false,
      bpjsClass: '',
      bpjsFaskes: '',
      bpjsRujukan: '',
      penanggungJawab: '',
      hubunganPenanggungJawab: '',
    });
    setPatientSearch({
      loading: false,
      found: false,
      patientData: null,
      error: '',
    });
    clearDraft();
  };

  const handleSubmit = async () => {
    // Check if all consents are given
    if (!formData.consentTerms || !formData.consentPrivacy || !formData.consentFee) {
      toast.error("Mohon centang semua persetujuan sebelum melanjutkan booking.");
      return;
    }

    console.log('Data yang dikirim ke backend:', {
      doctorId: doctor?.id,
      poliId: formData.poliId,
      poliName: formData.poliName,
      bookingDate: formData.date,
      bookingTime: formData.time,
      patientType: formData.patientType,
      paymentType: formData.paymentType,
      penanggungJawab: formData.penanggungJawab,
    });

    // Build payload based on patient type
    const payload: any = {
      doctorId: doctor?.id || null,
      poliId: formData.poliId, // Include the selected poli
      bookingDate: formData.date,
      bookingTime: formData.time, // Include the selected time
      patientType: formData.patientType,
      paymentType: formData.paymentType,
      createdByUserId: user?.id || null, // Track user yang membuat booking
      serviceItemId: formData.serviceItemId,
      serviceItemName: formData.serviceItemName,
    };

    // Add fields based on patient type
    if (formData.patientType === 'old') {
      // Old patient - only need mrNumber
      payload.mrNumber = formData.mrNumber;
    } else {
      // New patient - need all registration fields
      payload.nik = formData.nik;
      payload.patientName = formData.fullName;
      payload.patientPhone = formData.phone;
      payload.birthDate = formData.birthDate;
      payload.gender = formData.gender;

      // Optional fields
      if (formData.email) payload.patientEmail = formData.email;
      if (formData.address) payload.patientAddress = formData.address;
    }

    // Add BPJS number if payment type is BPJS-related
    const isBpjsPayment = formData.paymentName?.toLowerCase().includes('bpjs') ||
      formData.paymentName?.toLowerCase().includes('jkn') ||
      formData.paymentName?.toLowerCase().includes('kis');
    if (isBpjsPayment && formData.bpjsNumber) {
      payload.bpjsNumber = formData.bpjsNumber;
      if (formData.bpjsRujukan) {
        payload.bpjsRujukan = formData.bpjsRujukan;
      }
    }

    // Add keluhan if provided
    if (formData.keluhan) {
      payload.keluhan = formData.keluhan;
    }

    // Add penanggung jawab
    if (formData.penanggungJawab) {
      payload.penanggungJawab = formData.penanggungJawab;
    }

    // Show loading toast
    const loadingToast = toast.loading("Memproses booking Anda...");

    createAppointmentMutation.mutate(payload, {
      onSuccess: (data: any) => {
        toast.dismiss(loadingToast); // Remove loading toast
        setBookingCode(data.bookingCode || "REG-XXXX");
        setStep(3); // Step 3 for success page after confirmation/submission
        clearDraft(); // Success! Clear the draft.
        toast.success(data.message || "Janji temu berhasil dibuat!", {
          duration: 5000,
        });
        if (data.isNewPatient) {
          toast.success(`No. RM Anda: ${data.noRM}`, {
            duration: 7000,
            description: "Simpan nomor ini untuk kunjungan berikutnya"
          });
        }
      },
      onError: (error: any) => {
        toast.dismiss(loadingToast); // Remove loading toast
        const errorMessage = error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Gagal membuat janji temu. Mohon coba kembali.";

        // More specific error handling
        if (error?.response?.status === 429) {
          toast.error("Terlalu banyak permintaan. Mohon tunggu sebentar sebelum mencoba kembali.", {
            duration: 5000,
          });
        } else if (error?.response?.status === 400) {
          toast.error(errorMessage, {
            duration: 5000,
          });
        } else {
          toast.error(errorMessage, {
            duration: 7000,
            description: "Pastikan data yang Anda masukkan sudah benar dan lengkap."
          });
        }
        console.error('Booking error:', error);
      }
    });
  };

  return {
    step,
    setStep,
    bookingCode,
    setBookingCode,
    formData,
    setFormData,
    patientSearch,
    setPatientSearch,
    searchPatient,
    getAvailableDates,
    getAvailableTimesForDate,
    resetForm,
    handleSubmit,
    loading
  };
};