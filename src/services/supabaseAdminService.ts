"use server";

import { createAdminClient } from '@/utils/supabase/server';

// --- OPERATORS ---
export async function getOperators() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export async function createOperator(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('operators').insert([data]);
  if (error) throw error;
  return true;
}

// --- STATIONS ---
export async function getStations() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('stations').select('*').order('name', { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export async function createStation(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('stations').insert([data]);
  if (error) throw error;
  return true;
}

// --- ROUTES ---
export async function getRoutes() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('routes').select(`*, origin_station:origin_station_id(name), destination_station:destination_station_id(name)`);
  return data || [];
}

export async function createRoute(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('routes').insert([data]);
  if (error) throw error;
  return true;
}

// --- TRAIN SERVICES ---
export async function getTrainServices() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('train_services').select(`*, operator:operator_id(name), route:route_id(origin_station_id, destination_station_id)`);
  return data || [];
}
export async function createTrainService(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('train_services').insert([data]);
  if (error) throw error;
  return true;
}

// --- BUS SERVICES ---
export async function getBusServices() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('bus_services').select(`*, operator:operator_id(name), route:route_id(origin_station_id, destination_station_id)`);
  return data || [];
}
export async function createBusService(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('bus_services').insert([data]);
  if (error) throw error;
  return true;
}

// --- SCHEDULES ---
export async function getSchedules() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('schedules').select('*').order('departure_time', { ascending: false });
  return data || [];
}
export async function createSchedule(data: any) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('schedules').insert([data]);
  if (error) throw error;
  return true;
}

// --- BOOKINGS ---
export async function getAdminBookings() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('bookings').select('*, user:user_id(full_name, email)').order('created_at', { ascending: false });
  return data || [];
}

export async function cancelAdminBooking(bookingId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  if (error) throw error;
  return true;
}

