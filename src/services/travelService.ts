import { TravelRecord, TrainRecord, BusRecord, BookingRecord } from '@/types/travel';
import { createClient } from '@/utils/supabase/client';

function matchesStation(station: any, query?: string): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!station) return false;

  const name = (station.name || '').toLowerCase();
  const city = (station.city || '').toLowerCase();
  const code = (station.code || '').toLowerCase();

  // Normalize Haldibari variations (e.g. haldibar, haldibari, hdb)
  if (q.includes('haldibar') || 'haldibari'.includes(q) || q === 'hdb') {
    if (name.includes('haldibari') || city.includes('haldibari') || city.includes('jalpaiguri') || code === 'hdb') {
      return true;
    }
  }

  // Normalize Kolkata variations (e.g. kolkata, calcutta, sealdah, howrah, chitpur, esplanade)
  if (
    q.includes('kolkata') || q.includes('calcutta') || 'kolkata'.includes(q) ||
    q.includes('sealdah') || q.includes('howrah') || q.includes('esplanade') ||
    q === 'sdah' || q === 'hwh' || q === 'koaa'
  ) {
    if (
      city.includes('kolkata') ||
      name.includes('kolkata') ||
      name.includes('sealdah') ||
      name.includes('howrah') ||
      name.includes('chitpur') ||
      name.includes('esplanade') ||
      name.includes('babughat') ||
      code === 'sdah' || code === 'hwh' || code === 'koaa' || code === 'kol-esp' || code === 'kol-bbg'
    ) {
      return true;
    }
  }

  // Normalize Siliguri / NJP variations
  if (q.includes('siliguri') || q.includes('jalpaiguri') || q.includes('njp')) {
    if (name.includes('jalpaiguri') || city.includes('siliguri') || code === 'njp' || code === 'slg-tnc') {
      return true;
    }
  }

  return (
    name.includes(q) ||
    city.includes(q) ||
    code.includes(q) ||
    q.includes(name) ||
    q.includes(city)
  );
}

function calculateDuration(depStr: string, arrStr: string): string {
  try {
    const dep = new Date(depStr);
    const arr = new Date(arrStr);
    let diffMs = arr.getTime() - dep.getTime();
    if (diffMs < 0) {
      // Overnight arrival next day
      diffMs += 24 * 60 * 60 * 1000;
    }
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  } catch {
    return '11h 45m';
  }
}

function formatTimeString(isoString?: string): string {
  if (!isoString) return '18:15';
  try {
    const d = new Date(isoString);
    const h = d.getUTCHours().toString().padStart(2, '0');
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  } catch {
    return '18:15';
  }
}

function transformScheduleToRecord(schedule: any): TravelRecord {
  const isTrain = schedule.service_type === 'train';
  const depTime = formatTimeString(schedule.departure_at);
  const arrTime = formatTimeString(schedule.arrival_at);
  const duration = calculateDuration(schedule.departure_at, schedule.arrival_at);

  const originName = schedule.route?.origin_station?.name || 'Haldibari';
  const destName = schedule.route?.destination_station?.name || 'Sealdah';

  // Base pricing
  let baseFare = 450;
  if (isTrain) {
    const num = schedule.train?.train_number;
    if (num === '12344') baseFare = 385; // Darjeeling Mail
    else if (num === '12364') baseFare = 215; // HDB-KOAA SF
    else if (num === '22302') baseFare = 1565; // Vande Bharat
    else if (num === '12042') baseFare = 1420; // Shatabdi
  } else {
    const svcName = (schedule.bus?.service_name || '').toLowerCase();
    if (svcName.includes('shyamoli')) baseFare = 1450;
    else if (svcName.includes('greenline')) baseFare = 1550;
    else if (svcName.includes('royal cruiser')) baseFare = 1200;
    else if (svcName.includes('deluxe non-ac')) baseFare = 390;
    else baseFare = 580; // NBSTC Rocket
  }

  const taxes = Math.round(baseFare * 0.05);
  const serviceFee = isTrain ? 25 : 35;
  const total = baseFare + taxes + serviceFee;

  // Realistic deterministic availability based on schedule id & date
  const hash = (schedule.id || '').split('-').reduce((acc: number, part: string) => acc + parseInt(part, 16) || 0, 0);
  const availability = isTrain ? (28 + (hash % 115)) : (8 + (hash % 28));

  if (isTrain) {
    const trainNum = schedule.train?.train_number || '12344';
    let classCat = 'SL, 3A, 2A, 1A';
    if (trainNum === '12364') classCat = '2S, CC';
    else if (trainNum === '22302' || trainNum === '12042') classCat = 'CC, EC';

    return {
      id: schedule.id,
      type: 'train',
      operator: schedule.train?.operator?.name || 'Indian Railways',
      trainNumber: trainNum,
      classCategory: classCat,
      origin: originName,
      destination: destName,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration,
      fare: { base: baseFare, taxes, serviceFee, total },
      availability,
      active: schedule.active !== false,
    } as TrainRecord;
  } else {
    const vType = schedule.bus?.vehicle_type || 'AC Sleeper';
    const acStatus = vType.toLowerCase().includes('non-ac') ? 'Non-AC' : 'AC';
    const seatType = vType.toLowerCase().includes('seater') ? 'Seater' : 'Sleeper';

    return {
      id: schedule.id,
      type: 'bus',
      operator: schedule.bus?.operator?.name || 'NBSTC',
      busType: vType,
      acStatus,
      seatType,
      boardingInfo: `${originName} (${schedule.route?.origin_station?.city || 'Haldibari'})`,
      droppingInfo: `${destName} (${schedule.route?.destination_station?.city || 'Kolkata'})`,
      origin: originName,
      destination: destName,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration,
      fare: { base: baseFare, taxes, serviceFee, total },
      availability,
      active: schedule.active !== false,
    } as BusRecord;
  }
}

export async function searchTravelRecords(
  origin?: string,
  destination?: string,
  type?: string,
  date?: string
): Promise<TravelRecord[]> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('schedules')
      .select(`
        *,
        route:route_id (
          id,
          origin_station:origin_station_id (id, name, code, city),
          destination_station:destination_station_id (id, name, code, city)
        ),
        train:train_service_id (
          id,
          train_number,
          train_name,
          operator:operator_id (id, name)
        ),
        bus:bus_service_id (
          id,
          service_name,
          vehicle_type,
          operator:operator_id (id, name)
        )
      `)
      .eq('active', true);

    if (type === 'trains') {
      query = query.eq('service_type', 'train');
    } else if (type === 'buses') {
      query = query.eq('service_type', 'bus');
    }

    const { data: schedules, error } = await query;
    if (error || !schedules) {
      console.error('searchTravelRecords error:', error?.message);
      return [];
    }

    // Filter by Origin & Destination using fuzzy matching
    let matched = schedules.filter((s: any) => {
      const orig = s.route?.origin_station;
      const dest = s.route?.destination_station;
      return matchesStation(orig, origin) && matchesStation(dest, destination);
    });

    // If date is provided, filter for exact date; if no trips on that exact date, show upcoming dates
    if (date && matched.length > 0) {
      const onDate = matched.filter((s: any) => s.travel_date === date);
      if (onDate.length > 0) {
        matched = onDate;
      } else {
        // Fallback: show next upcoming available dates
        matched = matched
          .filter((s: any) => s.travel_date >= date)
          .slice(0, 10);
      }
    }

    // Sort by departure time
    matched.sort((a: any, b: any) => {
      if (a.travel_date !== b.travel_date) {
        return (a.travel_date || '').localeCompare(b.travel_date || '');
      }
      return (a.departure_at || '').localeCompare(b.departure_at || '');
    });

    return matched.map(transformScheduleToRecord);
  } catch (err: any) {
    console.error('searchTravelRecords exception:', err);
    return [];
  }
}

export async function getRecordById(id: string): Promise<TravelRecord | null> {
  try {
    const supabase = createClient();
    const { data: schedule, error } = await supabase
      .from('schedules')
      .select(`
        *,
        route:route_id (
          id,
          origin_station:origin_station_id (id, name, code, city),
          destination_station:destination_station_id (id, name, code, city)
        ),
        train:train_service_id (
          id,
          train_number,
          train_name,
          operator:operator_id (id, name)
        ),
        bus:bus_service_id (
          id,
          service_name,
          vehicle_type,
          operator:operator_id (id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !schedule) {
      console.error('getRecordById error:', error?.message);
      return null;
    }

    return transformScheduleToRecord(schedule);
  } catch (err) {
    console.error('getRecordById exception:', err);
    return null;
  }
}

export async function getAllAdminRecords(): Promise<TravelRecord[]> {
  return searchTravelRecords();
}

export async function addRecord(record: TravelRecord): Promise<void> {
  // Handled via supabaseAdminService
}

export async function deleteRecord(id: string): Promise<void> {
  // Handled via supabaseAdminService
}

// --- BOOKINGS ---
const inMemoryBookings: BookingRecord[] = [];

export async function createBooking(
  bookingData: Omit<BookingRecord, 'id' | 'pnr' | 'createdAt'>
): Promise<BookingRecord> {
  const pnr = 'TE' + Math.floor(10000000 + Math.random() * 90000000).toString();
  const id = 'BKG' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const newBooking: BookingRecord = {
    ...bookingData,
    id,
    pnr,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.id) {
      await supabase.from('bookings').insert([{
        user_id: userData.user.id,
        schedule_id: bookingData.trip.id,
        total_amount: bookingData.totalPaid,
        status: bookingData.status || 'confirmed',
        passenger_count: bookingData.passengers?.length || 1,
      }]);
    }
  } catch (err) {
    console.error('Supabase booking insert error:', err);
  }

  inMemoryBookings.push(newBooking);
  return newBooking;
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  const found = inMemoryBookings.find(b => b.id === id || b.pnr === id);
  return found || null;
}

export async function getMyBookings(): Promise<BookingRecord[]> {
  return inMemoryBookings;
}

export async function cancelBooking(id: string): Promise<BookingRecord | null> {
  const idx = inMemoryBookings.findIndex(b => b.id === id || b.pnr === id);
  if (idx !== -1) {
    inMemoryBookings[idx].status = 'cancelled';
    return inMemoryBookings[idx];
  }
  return null;
}
