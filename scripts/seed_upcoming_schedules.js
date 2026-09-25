const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bgdnjmllgeksnpoxykza.supabase.co';
const supabaseKey = 'sb_publishable_eR1NLATV3mrIYRVUoJn1Lw_jQ_nWy9h';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUpcoming() {
  console.log('🗓️ Seeding upcoming schedules from 2026-09-25 through 2026-11-25...');

  const { data: trains } = await supabase.from('train_services').select('*');
  const { data: buses } = await supabase.from('bus_services').select('*');
  const { data: routes } = await supabase.from('routes').select('*, origin_station:origin_station_id(*), destination_station:destination_station_id(*)');
  const { data: existingSchedules } = await supabase.from('schedules').select('service_type, train_service_id, bus_service_id, travel_date');

  const existingSet = new Set((existingSchedules || []).map(s => 
    `${s.service_type}_${s.train_service_id || s.bus_service_id}_${s.travel_date}`
  ));

  // Find routes
  const hdbSdah = routes.find(r => r.origin_station?.code === 'HDB' && r.destination_station?.code === 'SDAH');
  const hdbKoaa = routes.find(r => r.origin_station?.code === 'HDB' && r.destination_station?.code === 'KOAA') || hdbSdah;
  const hdbEsp = routes.find(r => r.origin_station?.code === 'HDB' && r.destination_station?.code === 'KOL-ESP') || hdbSdah;
  const njpHwh = routes.find(r => r.origin_station?.code === 'NJP' && r.destination_station?.code === 'HWH') || hdbSdah;
  const slgEsp = routes.find(r => r.origin_station?.code === 'SLG-TNC' && r.destination_station?.code === 'KOL-ESP') || hdbEsp;
  const slgBbg = routes.find(r => r.origin_station?.code === 'SLG-TNC' && r.destination_station?.code === 'KOL-BBG') || hdbEsp;

  // Generate dates from 2026-09-25 to 2026-11-25 (62 days)
  const startDate = new Date('2026-09-25T00:00:00Z');
  const dates = [];
  for (let i = 0; i <= 62; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(d.toISOString().split('T')[0]);
  }

  const toInsert = [];

  // Trains
  for (const t of (trains || [])) {
    let route = hdbSdah;
    let depTime = '18:15';
    let arrTime = '06:00';

    if (t.train_number === '12364') {
      route = hdbKoaa;
      depTime = '08:25';
      arrTime = '19:40';
    } else if (t.train_number === '22302') {
      route = njpHwh;
      depTime = '15:00';
      arrTime = '22:35';
    } else if (t.train_number === '12042') {
      route = njpHwh;
      depTime = '05:30';
      arrTime = '13:45';
    }

    if (!route) continue;

    for (const date of dates) {
      // 12364 runs Wed, Fri, Sun
      if (t.train_number === '12364') {
        const day = new Date(date + 'T00:00:00Z').getUTCDay();
        if (day !== 0 && day !== 3 && day !== 5) continue;
      }

      const key = `train_${t.id}_${date}`;
      if (!existingSet.has(key)) {
        toInsert.push({
          route_id: route.id,
          service_type: 'train',
          train_service_id: t.id,
          bus_service_id: null,
          travel_date: date,
          departure_at: `${date}T${depTime}:00Z`,
          arrival_at: `${date}T${arrTime}:00Z`,
          status: 'scheduled',
          active: true,
        });
        existingSet.add(key);
      }
    }
  }

  // Buses
  for (const b of (buses || [])) {
    let route = hdbSdah;
    let depTime = '17:30';
    let arrTime = '06:30';

    const sName = (b.service_name || '').toLowerCase();
    if (sName.includes('shyamoli')) {
      route = hdbEsp;
      depTime = '19:00';
      arrTime = '06:45';
    } else if (sName.includes('greenline')) {
      route = slgEsp;
      depTime = '20:00';
      arrTime = '07:30';
    } else if (sName.includes('royal cruiser')) {
      route = slgBbg;
      depTime = '18:30';
      arrTime = '06:00';
    } else if (sName.includes('deluxe non-ac')) {
      route = hdbSdah;
      depTime = '16:00';
      arrTime = '06:00';
    }

    if (!route) continue;

    for (const date of dates) {
      const key = `bus_${b.id}_${date}`;
      if (!existingSet.has(key)) {
        toInsert.push({
          route_id: route.id,
          service_type: 'bus',
          train_service_id: null,
          bus_service_id: b.id,
          travel_date: date,
          departure_at: `${date}T${depTime}:00Z`,
          arrival_at: `${date}T${arrTime}:00Z`,
          status: 'scheduled',
          active: true,
        });
        existingSet.add(key);
      }
    }
  }

  console.log(`Prepared ${toInsert.length} schedules to insert...`);

  // Insert in batches of 100
  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100);
    const { error } = await supabase.from('schedules').insert(batch);
    if (error) {
      console.error('Batch insert error at', i, error.message);
    } else {
      console.log(`Inserted batch ${i} - ${i + batch.length}`);
    }
  }

  console.log('✅ Finished seeding upcoming schedules!');
}

seedUpcoming().catch(console.error);
