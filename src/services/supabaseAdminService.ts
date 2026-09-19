// Admin service — runs in the browser using the anon key.
// Matches normalized database schema from Supabase.
import { createClient } from '@/utils/supabase/client';

// --- OPERATORS ---
export async function getOperators() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operators')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getOperators error:', error.message);
    return [];
  }
  return (data || []).map(op => ({
    ...op,
    status: op.status || (op.active ? 'active' : 'inactive'),
  }));
}

export async function createOperator(data: any) {
  const supabase = createClient();
  const payload = {
    name: data.name,
    type: data.type === 'both' ? 'train' : data.type,
    active: data.status !== 'inactive',
  };
  const { error } = await supabase.from('operators').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateOperator(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.type !== undefined) payload.type = data.type === 'both' ? 'train' : data.type;
  if (data.status !== undefined) payload.active = data.status !== 'inactive';
  const { error } = await supabase.from('operators').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteOperator(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('operators').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- STATIONS ---
export async function getStations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('getStations error:', error.message);
    return [];
  }
  return (data || []).map(st => ({
    ...st,
    status: st.status || (st.active ? 'active' : 'inactive'),
    type: st.type || 'train',
  }));
}

export async function createStation(data: any) {
  const supabase = createClient();
  const payload = {
    name: data.name,
    code: (data.code || '').trim().toUpperCase(),
    city: data.city,
    active: data.status !== 'inactive',
  };
  const { error } = await supabase.from('stations').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateStation(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.code !== undefined) payload.code = (data.code || '').trim().toUpperCase();
  if (data.city !== undefined) payload.city = data.city;
  if (data.status !== undefined) payload.active = data.status !== 'inactive';
  const { error } = await supabase.from('stations').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteStation(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('stations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- ROUTES ---
export async function getRoutes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('routes')
    .select('*, origin_station:origin_station_id(name, city), destination_station:destination_station_id(name, city)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getRoutes error:', error.message);
    return [];
  }
  return (data || []).map(r => ({
    ...r,
    name: r.name || `${r.origin_station?.name || 'Origin'} → ${r.destination_station?.name || 'Destination'}`,
    status: r.status || (r.active ? 'active' : 'inactive'),
    distance_km: r.distance_km || 0,
    estimated_duration_minutes: r.estimated_duration_minutes || 0,
  }));
}

export async function createRoute(data: any) {
  const supabase = createClient();
  const payload = {
    origin_station_id: data.origin_station_id,
    destination_station_id: data.destination_station_id,
    active: true,
  };
  const { error } = await supabase.from('routes').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateRoute(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.origin_station_id) payload.origin_station_id = data.origin_station_id;
  if (data.destination_station_id) payload.destination_station_id = data.destination_station_id;
  const { error } = await supabase.from('routes').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteRoute(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('routes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- TRAIN SERVICES ---
export async function getTrainServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('train_services')
    .select('*, operator:operator_id(name)');

  if (error) {
    console.error('getTrainServices error:', error.message);
    return [];
  }
  return (data || []).map(t => ({
    ...t,
    name: t.train_name,
    status: t.status || (t.active ? 'active' : 'inactive'),
  }));
}

export async function createTrainService(data: any) {
  const supabase = createClient();
  const payload = {
    operator_id: data.operator_id || null,
    train_number: data.train_number,
    train_name: data.name || data.train_name,
    active: true,
  };
  const { error } = await supabase.from('train_services').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateTrainService(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.name || data.train_name) payload.train_name = data.name || data.train_name;
  if (data.train_number) payload.train_number = data.train_number;
  if (data.operator_id) payload.operator_id = data.operator_id;
  const { error } = await supabase.from('train_services').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteTrainService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('train_services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- BUS SERVICES ---
export async function getBusServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bus_services')
    .select('*, operator:operator_id(name)');

  if (error) {
    console.error('getBusServices error:', error.message);
    return [];
  }
  return (data || []).map(b => ({
    ...b,
    name: b.service_name,
    bus_number: b.bus_number || b.id.slice(0, 6).toUpperCase(),
    bus_type: b.vehicle_type,
    status: b.status || (b.active ? 'active' : 'inactive'),
  }));
}

export async function createBusService(data: any) {
  const supabase = createClient();
  const payload = {
    operator_id: data.operator_id || null,
    service_name: data.name || data.service_name,
    vehicle_type: data.bus_type || data.vehicle_type || 'AC Sleeper',
    active: true,
  };
  const { error } = await supabase.from('bus_services').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateBusService(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.name || data.service_name) payload.service_name = data.name || data.service_name;
  if (data.bus_type || data.vehicle_type) payload.vehicle_type = data.bus_type || data.vehicle_type;
  if (data.operator_id) payload.operator_id = data.operator_id;
  const { error } = await supabase.from('bus_services').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteBusService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('bus_services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// --- SCHEDULES ---
export async function getSchedules() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('schedules')
    .select('*, train:train_service_id(train_name, train_number), bus:bus_service_id(service_name)')
    .order('travel_date', { ascending: false });

  if (error) {
    console.error('getSchedules error:', error.message);
    return [];
  }
  return (data || []).map(s => ({
    ...s,
    service_id: s.service_type === 'train' ? s.train?.train_name : s.bus?.service_name,
    departure_time: s.departure_at ? new Date(s.departure_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
    arrival_time: s.arrival_at ? new Date(s.arrival_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00 PM',
    available_seats: s.available_seats || 50,
    base_fare: s.base_fare || 450,
    status: s.status || 'active',
  }));
}

export async function createSchedule(data: any) {
  const supabase = createClient();
  const travelDate = data.travel_date || new Date().toISOString().split('T')[0];
  const departureAt = `${travelDate}T${data.departure_time || '10:00'}:00Z`;
  const arrivalAt = `${travelDate}T${data.arrival_time || '18:00'}:00Z`;
  const payload: any = {
    service_type: data.service_type,
    travel_date: travelDate,
    departure_at: departureAt,
    arrival_at: arrivalAt,
    status: 'scheduled',
    active: true,
  };
  if (data.service_type === 'train') {
    payload.train_service_id = data.service_id;
  } else {
    payload.bus_service_id = data.service_id;
  }
  const { error } = await supabase.from('schedules').insert([payload]);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateSchedule(id: string, data: any) {
  const supabase = createClient();
  const payload: any = {};
  if (data.travel_date) payload.travel_date = data.travel_date;
  if (data.status) payload.status = data.status;
  const { error } = await supabase.from('schedules').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteSchedule(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('schedules').delete().eq('id', id);
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
  return (data || []).map(b => ({
    ...b,
    status: b.booking_status || b.status || 'pending',
  }));
}

export async function cancelAdminBooking(bookingId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ booking_status: 'cancelled', status: 'cancelled' })
    .eq('id', bookingId);
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
