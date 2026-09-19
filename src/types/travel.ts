export type TravelType = 'train' | 'bus';
export type ACStatus = 'AC' | 'Non-AC';
export type SeatType = 'Sleeper' | 'Seater';

export interface FareDetails {
  base: number;
  taxes: number;
  serviceFee: number;
  total: number;
}

export interface BaseTravelRecord {
  id: string;
  type: TravelType;
  operator: string;
  origin: string;
  destination: string;
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  duration: string; // e.g., 11h 50m
  fare: FareDetails;
  availability: number;
  active: boolean;
}

export interface TrainRecord extends BaseTravelRecord {
  type: 'train';
  trainNumber: string;
  classCategory: string; // e.g., 2A, 3A, SL
}

export interface BusRecord extends BaseTravelRecord {
  type: 'bus';
  busType: string; // e.g., Volvo, Scania
  acStatus: ACStatus;
  seatType: SeatType;
  boardingInfo: string;
  droppingInfo: string;
}

export type TravelRecord = TrainRecord | BusRecord;

export interface BookingRecord {
  id: string;
  pnr?: string;
  trip: TravelRecord;
  passengers: {
    fullName: string;
    age: string;
    gender: string;
  }[];
  totalPaid: number;
  status: 'confirmed' | 'payment_pending' | 'payment_failed' | 'booking_failed' | 'booking_confirmation_pending' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}
