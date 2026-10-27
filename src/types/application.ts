export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
  id: string;
  applicantName: string;
  businessName: string;
  category: string;
  description: string;
  whatsapp: string;
  address: string;
  images: string[];
  status: ApplicationStatus;
  submittedAt: string;
  rejectionReason?: string | null;
}
