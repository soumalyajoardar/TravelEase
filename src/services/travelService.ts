import { TravelRecord } from '@/types/travel';

// STRICT RULE: No dummy or fabricated data. Start empty.
let mockDatabase: TravelRecord[] = [];

export async function searchTravelRecords(
  origin?: string,
  destination?: string,
  type?: string
): Promise<TravelRecord[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockDatabase.filter(record => {
    if (!record.active) return false;
    if (origin && record.origin.toLowerCase() !== origin.toLowerCase()) return false;
    if (destination && record.destination.toLowerCase() !== destination.toLowerCase()) return false;
    if (type && type !== 'all' && record.type !== type) return false;
    return true;
  });
}

export async function getRecordById(id: string): Promise<TravelRecord | null> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const record = mockDatabase.find(r => r.id === id);
  return record || null;
}

export async function getAllAdminRecords(): Promise<TravelRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDatabase;
}

export async function addRecord(record: TravelRecord) {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockDatabase.push(record);
}

export async function deleteRecord(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockDatabase = mockDatabase.filter(r => r.id !== id);
}

// Mock Bookings Database
const mockBookings: import('../types/travel').BookingRecord[] = [];

export async function createBooking(bookingData: Omit<import('../types/travel').BookingRecord, 'id' | 'pnr' | 'createdAt'>): Promise<import('../types/travel').BookingRecord> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newBooking: import('../types/travel').BookingRecord = {
    ...bookingData,
    id: 'BKG' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    pnr: 'PNR' + Math.floor(Math.random() * 1000000000).toString(),
    createdAt: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return newBooking;
}

export async function getBookingById(id: string): Promise<import('../types/travel').BookingRecord | null> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const booking = mockBookings.find(b => b.id === id);
  return booking || null;
}

export async function getMyBookings(): Promise<import('../types/travel').BookingRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this would filter by the authenticated user's ID
  return mockBookings;
}

export async function cancelBooking(id: string): Promise<import('../types/travel').BookingRecord | null> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const bookingIndex = mockBookings.findIndex(b => b.id === id);
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      status: 'cancelled',
      // We could add refund status fields here if we expanded the type
    } as any;
    return mockBookings[bookingIndex];
  }
  return null;
}
