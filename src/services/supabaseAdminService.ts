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
  return [];
}

export async function createRoute(data: any) {
  const supabase = await createAdminClient();
  throw new Error("Supabase connection required to persist real data.");
}

// --- TRAIN SERVICES ---
export async function getTrainServices() {
  const supabase = await createAdminClient();
  return [];
}

// --- BUS SERVICES ---
export async function getBusServices() {
  const supabase = await createAdminClient();
  return [];
}

// --- SCHEDULES ---
export async function getSchedules() {
  const supabase = await createAdminClient();
  return [];
}

// --- FARES ---
export async function getFares() {
  const supabase = await createAdminClient();
  return [];
}

// --- AVAILABILITY ---
export async function getAvailability() {
  const supabase = await createAdminClient();
  return [];
}

// --- BOOKINGS ---
export async function getAdminBookings() {
  const supabase = await createAdminClient();
  return [];
}

export async function cancelAdminBooking(bookingId: string) {
  const supabase = await createAdminClient();
  throw new Error("Supabase connection required to persist real data.");
}

// --- PAYMENTS ---
export async function getAdminPayments() {
  const supabase = await createAdminClient();
  return [];
}

// --- REFUNDS ---
export async function getAdminRefunds() {
  const supabase = await createAdminClient();
  return [];
}

