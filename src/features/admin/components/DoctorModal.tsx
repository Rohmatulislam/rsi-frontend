// features/admin/components/DoctorModal.tsx
// features/admin/components/DoctorModal.tsx
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { DoctorDto } from "~/features/home/api/getDoctors";
import { CreateDoctorDto, UpdateDoctorDto } from "../types/doctor";
import { DoctorImageUploadField } from "./DoctorImageUploadField";
import { useUploadDoctorImage } from "../api/uploadDoctorImage";

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: DoctorDto | null;
  onSave: (data: CreateDoctorDto | UpdateDoctorDto, isEdit: boolean) => void;
  isSaving: boolean;
}

export const DoctorModal = ({
  isOpen,
  onClose,
  doctor,
  onSave,
  isSaving
}: DoctorModalProps) => {
  const isEdit = !!doctor;
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadDoctorImage();
  const [formData, setFormData] = useState<CreateDoctorDto | UpdateDoctorDto>({
    name: "",
    email: "",
    licenseNumber: "",
    phone: "",
    specialization: "",
    department: "",
    imageUrl: "",
    bio: "",
    experience_years: 0,
    education: "",
    certifications: "",
    consultation_fee: 0,
    specialtyImage_url: "",
    is_executive: false,
    sip_number: "",
    bpjs: false,
    slug: "",
    kd_dokter: "",
    description: "",
    isActive: true,
    isStudying: false,
    isOnLeave: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAutoUploading, setIsAutoUploading] = useState(false);

  useEffect(() => {
    if (isEdit && doctor) {
      setFormData(prev => ({
        ...prev,
        name: doctor.name ?? "",
        email: doctor.email ?? "",
        licenseNumber: doctor.licenseNumber ?? "",
        phone: doctor.phone ?? "",
        specialization: doctor.specialization ?? "",
        department: doctor.department ?? "",
        imageUrl: doctor.imageUrl ?? "",
        bio: doctor.bio ?? "",
        experience_years: doctor.experience_years ?? 0,
        education: doctor.education ?? "",
        certifications: doctor.certifications ?? "",
        consultation_fee: doctor.consultation_fee ?? 0,
        specialtyImage_url: doctor.specialtyImage_url ?? "",
        is_executive: doctor.is_executive ?? false,
        sip_number: doctor.sip_number ?? "",
        bpjs: doctor.bpjs ?? false,
        slug: doctor.slug ?? "",
        kd_dokter: doctor.kd_dokter ?? "",
        description: doctor.description ?? "",
        isActive: doctor.isActive ?? true,
        isStudying: doctor.isStudying ?? false,
        isOnLeave: (doctor as any).isOnLeave ?? false,
      }));
    } else {
      setFormData({
        name: "",
        email: "",
        licenseNumber: "",
        phone: "",
        specialization: "",
        department: "",
        imageUrl: "",
        bio: "",
        experience_years: 0,
        education: "",
        certifications: "",
        consultation_fee: 0,
        specialtyImage_url: "",
        is_executive: false,
        sip_number: "",
        bpjs: false,
        slug: "",
        kd_dokter: "",
        description: "",
        isActive: true,
        isStudying: false,
        isOnLeave: false,
      });
    }
  }, [isEdit, doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let val: any = value;
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      val = value === '' ? 0 : Number(value);
    } else if (name === 'isActive' || name === 'isStudying' || name === 'isOnLeave' || name === 'is_executive' || name === 'bpjs') {
      // Convert "true"/"false" strings to actual booleans
      val = value === 'true';
    }

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Helper function to ensure valid field values
  const getFieldSafeValue = (value: any): string | number | boolean => {
    if (value === null || value === undefined) {
      return '';
    }
    return value;
  };

  const handleImageUrlChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: value
    }));
  };

  const handleImageUpload = async (file: File): Promise<string | void> => {
    if (!doctor?.id) return;

    const result = await uploadImage({ id: doctor.id, file });
    if (result.imageUrl) {
      setFormData(prev => ({
        ...prev,
        imageUrl: result.imageUrl
      }));
      setSelectedFile(null); // Clear pending file after successful manual upload
      return result.imageUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalFormData = { ...formData };

    // Auto-upload if there's a selected file and it's an edit mode
    // (In create mode, we might need a different strategy if backend requires ID, 
    // but usually images are uploaded after creation or as base64)
    if (selectedFile && isEdit && doctor?.id) {
      setIsAutoUploading(true);
      try {
        const result = await uploadImage({ id: doctor.id, file: selectedFile });
        if (result.imageUrl) {
          finalFormData.imageUrl = result.imageUrl;
        }
      } catch (error) {
        // We might want to show an alert or continue with old data
      } finally {
        setIsAutoUploading(false);
      }
    }

    onSave(finalFormData, isEdit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <DoctorImageUploadField
                value={formData.imageUrl || ""}
                onChange={handleImageUrlChange}
                disabled={isSaving || isUploading}
                entityId={doctor?.id}
                onUpload={handleImageUpload}
                isUploading={isUploading || isAutoUploading}
                onFileSelect={setSelectedFile}
              />
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="licenseNumber">License Number *</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="kd_dokter">Doctor Code (Khanza)</Label>
              <Input
                id="kd_dokter"
                name="kd_dokter"
                value={formData.kd_dokter}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="consultation_fee">Consultation Fee</Label>
              <Input
                id="consultation_fee"
                name="consultation_fee"
                type="number"
                value={formData.consultation_fee}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="is_executive">Executive?</Label>
              <select
                id="is_executive"
                name="is_executive"
                value={formData.is_executive ? "true" : "false"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="doctorStatus">Status Dokter</Label>
              <select
                id="doctorStatus"
                name="doctorStatus"
                value={
                  !formData.isActive ? "inactive" :
                    formData.isOnLeave ? "on_leave" :
                      formData.isStudying ? "studying" : "active"
                }
                onChange={(e) => {
                  const status = e.target.value;
                  let newValues: any = {};
                  switch (status) {
                    case "active":
                      newValues = { isActive: true, isStudying: false, isOnLeave: false };
                      break;
                    case "studying":
                      newValues = { isActive: true, isStudying: true, isOnLeave: false };
                      break;
                    case "on_leave":
                      newValues = { isActive: true, isStudying: false, isOnLeave: true };
                      break;
                    case "inactive":
                      newValues = { isActive: false, isStudying: false, isOnLeave: false };
                      break;
                  }
                  setFormData(prev => ({ ...prev, ...newValues }));
                }}
                className="w-full p-2 border rounded"
              >
                <option value="active">✅ Aktif</option>
                <option value="studying">📚 Sedang Pendidikan</option>
                <option value="on_leave">🏖️ Sedang Cuti</option>
                <option value="inactive">❌ Non-Aktif</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || isUploading || isAutoUploading}
            >
              {isSaving || isAutoUploading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};