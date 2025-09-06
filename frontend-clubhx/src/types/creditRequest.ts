
export interface CreditLimitRequest {
  id: string;
  customerId: string;
  customerName: string;
  currentLimit: number;
  requestedLimit: number;
  reason: string;
  requestedBy: string;
  requestedByName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedByName?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

export type CreditLimitStatus = 'pending' | 'approved' | 'rejected';

export interface CreditLimitHistory {
  id: string;
  previousLimit: number;
  newLimit: number;
  changeDate: string;
  changedBy: string;
  changedByName: string;
  method: 'direct' | 'request';
  requestId?: string;
  notes?: string;
}
