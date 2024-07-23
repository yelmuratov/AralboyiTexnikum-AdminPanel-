// components/ui/EditApplicantModal.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Modal } from './Modal';
import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import axios from 'axios';

interface Applicant {
    id?: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: string;
    phone_number: string;
    secondary_phone_number: string;
    category: number;
    source: string;
    created_at?: string;
    updated_at?: string;
  }
  

interface EditApplicantModalProps {
  open: boolean;
  onClose: () => void;
  fetchApplicants: () => void;
  applicant: Applicant | null;
  categories: { id: number; name: string }[];
}

export const EditApplicantModal = ({ open, onClose, fetchApplicants, applicant, categories }: EditApplicantModalProps) => {
  const [formData, setFormData] = useState(applicant);

  useEffect(() => {
    setFormData(applicant);
  }, [applicant]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        const { id, ...data } = formData;
        await axios.put(`https://aralboyitexnikum.uz/api/backend/admission/applicants/${id}/`, { ...data, source: 'website' });
        fetchApplicants();
        onClose();
      } catch (error) {
        console.error('Failed to update applicant', error);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-medium">Edit Applicant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" value={formData?.first_name || ''} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" value={formData?.last_name || ''} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_name">Middle Name</Label>
          <Input id="middle_name" value={formData?.middle_name || ''} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input id="date_of_birth" type="date" value={formData?.date_of_birth || ''} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" type="tel" value={formData?.phone_number || ''} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondary_phone_number">Secondary Phone Number</Label>
          <Input id="secondary_phone_number" type="tel" value={formData?.secondary_phone_number || ''} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" value={formData?.category || 0} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2">
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
};
