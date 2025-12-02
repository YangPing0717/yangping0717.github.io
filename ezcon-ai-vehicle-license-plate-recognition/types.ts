export interface Camera {
  id: string;
  name: string;
  status: 'recording' | 'idle' | 'offline';
  thumbnailUrl: string;
  isPtz?: boolean;
}

export type LayoutType = 
  | 'Single' 
  | 'Split 2' 
  | 'Split 4' 
  | 'Split 2 PIP' 
  | 'PIP LT' 
  | 'PIP LB' 
  | 'PIP RT' 
  | 'PIP RB' 
  | 'L1R2' 
  | 'L1R3' 
  | 'Big4' 
  | 'PIP RB2';

export interface LayoutConfig {
  id: string;
  type: LayoutType;
  label: string;
}

export interface EventLog {
  id: string;
  dateTime: string;
  zone: string;
  direction: 'in' | 'out';
  plateNumber: string;
  plateImage: string; // URL to crop
  carImage: string; // URL to full image
  country: string;
  brand: string;
  model: string;
  type: string; // sedan, suv, etc
  color: string;
}