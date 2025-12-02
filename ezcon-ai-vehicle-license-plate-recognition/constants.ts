import { Camera, LayoutConfig, EventLog } from './types';

export const CAMERAS: Camera[] = [
  {
    id: 'cam-001',
    name: '1樓入口_camera A',
    status: 'recording',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop', // Silver car rear view
  },
  {
    id: 'cam-002',
    name: 'B2 停車場_Main',
    status: 'recording',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590674899505-1c5c412719a5?q=80&w=1000&auto=format&fit=crop', // Underground parking lot
  },
  {
    id: 'cam-003',
    name: '側門出口_E3',
    status: 'idle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop', // Car front view
  },
  {
    id: 'cam-004',
    name: '1F_車道監控_N',
    status: 'offline',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1000&auto=format&fit=crop', // Dark garage/tunnel
  },
  {
    id: 'cam-005',
    name: 'B1出口_camera B',
    status: 'recording',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop', // Car in motion
  }
];

export const LAYOUTS: LayoutConfig[] = [
  { id: '1', type: 'Single', label: 'Single' },
  { id: '2', type: 'Split 2', label: 'Split 2' },
  { id: '3', type: 'Split 4', label: 'Split 4' },
  { id: '4', type: 'Split 2 PIP', label: 'Split 2 PIP' },
  { id: '5', type: 'PIP LT', label: 'PIP LT' },
  { id: '6', type: 'PIP LB', label: 'PIP LB' },
  { id: '7', type: 'PIP RT', label: 'PIP RT' },
  { id: '8', type: 'PIP RB', label: 'PIP RB' },
  { id: '9', type: 'L1R2', label: 'L1R2' },
  { id: '10', type: 'L1R3', label: 'L1R3' },
  { id: '11', type: 'Big4', label: 'Big4' },
  { id: '12', type: 'PIP RB2', label: 'PIP RB' }, 
];

export const MOCK_EVENTS: EventLog[] = [
  {
    id: 'evt-001',
    dateTime: '2022-02-15 21:42:36',
    zone: '1',
    direction: 'in',
    plateNumber: '6UUC867',
    plateImage: 'https://images.unsplash.com/photo-1549520976-92f75990263f?q=80&w=200&auto=format&fit=crop', // dummy plate
    carImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop',
    country: 'TW',
    brand: 'Toyota',
    model: 'Corolla E140',
    type: 'sedan',
    color: 'WHITE'
  },
  {
    id: 'evt-002',
    dateTime: '2022-02-15 21:42:32',
    zone: '1',
    direction: 'in',
    plateNumber: '7XFF119',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Toyota',
    model: 'RAV4 XA40',
    type: 'suv',
    color: 'WHITE'
  },
  {
    id: 'evt-003',
    dateTime: '2022-02-15 21:42:30',
    zone: '1',
    direction: 'in',
    plateNumber: '23294H3',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Isuzu',
    model: 'Truck',
    type: 'truck',
    color: 'WHITE'
  },
  {
    id: 'evt-004',
    dateTime: '2022-02-15 21:42:29',
    zone: '1',
    direction: 'in',
    plateNumber: '7YKW080',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Mazda',
    model: '3',
    type: 'sedan',
    color: 'BLACK'
  },
  {
    id: 'evt-005',
    dateTime: '2022-02-15 21:42:26',
    zone: '1',
    direction: 'in',
    plateNumber: '90774R2',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Ford',
    model: 'Transit',
    type: 'van',
    color: 'WHITE'
  },
  {
    id: 'evt-006',
    dateTime: '2022-02-15 21:42:25',
    zone: '1',
    direction: 'in',
    plateNumber: '74497Z1',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Nissan',
    model: 'Pathfinder',
    type: 'suv',
    color: 'BLACK'
  },
  {
    id: 'evt-007',
    dateTime: '2022-02-15 21:42:22',
    zone: '1',
    direction: 'in',
    plateNumber: '8EZY010',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Tesla',
    model: 'Model Y',
    type: 'suv',
    color: 'GRAY'
  },
  {
    id: 'evt-008',
    dateTime: '2022-02-15 21:41:45',
    zone: '1',
    direction: 'in',
    plateNumber: '8MFN689',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: '-',
    model: '-',
    type: '-',
    color: '-'
  },
   {
    id: 'evt-009',
    dateTime: '2022-02-15 21:41:33',
    zone: '1',
    direction: 'in',
    plateNumber: '8LZZ576',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Ford',
    model: 'Mustang',
    type: 'coupe',
    color: 'WHITE'
  },
  {
    id: 'evt-010',
    dateTime: '2022-02-15 21:41:24',
    zone: '1',
    direction: 'in',
    plateNumber: '6XYF188',
    plateImage: '',
    carImage: '',
    country: 'TW',
    brand: 'Chevrolet',
    model: 'Niva',
    type: 'suv',
    color: 'WHITE'
  }
];