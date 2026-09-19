// Admin service — runs in the browser using the anon key.
// Admin-level access is enforced by Supabase RLS policies that check the user's role.
import { createClient } from '@/utils/supabase/client';

// --- OPERATORS ---
export async function getOperators() {
  const supabase = createClient();
  const { data, error } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getOperators:', error.message); return []; }
  return data || [];
}
export async function createOperator(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('operators').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- STATIONS ---
export async function getStations() {
  const supabase = createClient();
  const { data, error } = await supabase.from('stations').select('*').order('name', { ascending: true });
  if (error) { console.error('getStations:', error.message); return []; }
  return data || [];
}
export async function createStation(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('stations').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- ROUTES ---
export async function getRoutes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('routes')
    .select('*, origin_station:origin_station_id(name), destination_station:destination_station_id(name)');
  if (error) { console.error('getRoutes:', error.message); return []; }
  return data || [];
}
export async function createRoute(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('routes').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- TRAIN SERVICES ---
export async function getTrainServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('train_services')
    .select('*, operator:operator_id(name), route:route_id(origin_station_id, destination_station_id)');
  if (error) { console.error('getTrainServices:', error.message); return []; }
  return data || [];
}
export async function createTrainService(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('train_services').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- BUS SERVICES ---
export async function getBusServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bus_services')
    .select('*, operator:operator_id(name), route:route_id(origin_station_id, destination_station_id)');
  if (error) { console.error('getBusServices:', error.message); return []; }
  return data || [];
}
export async function createBusService(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('bus_services').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- SCHEDULES ---
export async function getSchedules() {
  const supabase = createClient();
  const { data, error } = await supabase.from('schedules').select('*').order('travel_date', { ascending: false });
  if (error) { console.error('getSchedules:', error.message); return []; }
  return data || [];
}
export async function createSchedule(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('schedules').insert([data]);
  if (error) throw new Error(error.message);
  return true;
}

// --- BOOKINGS ---
export async function getAdminBookings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*, user:user_id(full_name, email)')
    .order('created_at', { ascending: false });
  if (error) { console.error('getAdminBookings:', error.message); return []; }
  return data || [];
}
export async function cancelAdminBooking(bookingId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  if (error) throw new Error(error.message);
  return true;
}

// --- FARES ---
export async function getFares() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('fares').select('*');
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// --- AVAILABILITY ---
export async function getAvailability() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('schedules').select('*');
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// --- PAYMENTS ---
export async function getAdminPayments() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('payments').select('*');
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// --- REFUNDS ---
export async function getAdminRefunds() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('refunds').select('*');
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}
