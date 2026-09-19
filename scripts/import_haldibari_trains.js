const { createClient } = require('@supabase/supabase-js');

// Connect using Supabase URL and key
const supabaseUrl = 'https://bgdnjmllgeksnpoxykza.supabase.co';
const supabaseKey = 'sb_publishable_eR1NLATV3mrIYRVUoJn1Lw_jQ_nWy9h';
const supabase = createClient(supabaseUrl, supabaseKey);

async function importHaldibariTrains() {
  console.log('🚀 Starting import of Haldibari to Kolkata trains...');

  // 1. Ensure Operator exists
  let { data: operators } = await supabase.from('operators').select('*');
  let operator = operators?.find(o => o.name.toLowerCase().includes('railway') || o.name.toLowerCase().includes('irctc'));
  if (!operator) {
    const { data: newOp, error: opErr } = await supabase.from('operators').insert([{
      name: 'Indian Railways',
      type: 'train',
      active: true,
    }]).select();
    if (opErr) throw opErr;
    operator = newOp[0];
    console.log('Created operator:', operator.name);
  } else {
    console.log('Found existing operator:', operator.name);
  }

  // 2. Ensure Stations exist
  const stationDefs = [
    { name: 'HALDIBARI', code: 'HDB', city: 'Haldibari' },
    { name: 'SEALDAH', code: 'SDAH', city: 'Kolkata' },
    { name: 'KOLKATA TERMINAL (CHITPUR)', code: 'KOAA', city: 'Kolkata' },
    { name: 'HOWRAH JUNCTION', code: 'HWH', city: 'Kolkata' },
    { name: 'NEW JALPAIGURI', code: 'NJP', city: 'Siliguri' },
  ];

  let { data: existingStations } = await supabase.from('stations').select('*');
  existingStations = existingStations || [];

  const stationsMap = {};
  for (const s of existingStations) {
    stationsMap[s.code] = s;
  }

  for (const def of stationDefs) {
    if (!stationsMap[def.code]) {
      const { data: created, error: stErr } = await supabase.from('stations').insert([{
        name: def.name,
        code: def.code,
        city: def.city,
        active: true,
      }]).select();
      if (stErr) console.error('Station insert error:', stErr.message);
      else {
        stationsMap[def.code] = created[0];
        console.log(`Created station: ${def.name} (${def.code})`);
      }
    } else {
      console.log(`Station already exists: ${def.code}`);
    }
  }

  // 3. Ensure Routes exist
  let { data: existingRoutes } = await supabase.from('routes').select('*');
  existingRoutes = existingRoutes || [];

  const routeDefs = [
    {
      origin: 'HDB',
      destination: 'SDAH',
    },
    {
      origin: 'HDB',
      destination: 'KOAA',
    },
    {
      origin: 'NJP',
      destination: 'HWH',
    },
  ];

  const routesMap = {};
  for (const r of existingRoutes) {
    const orig = Object.values(stationsMap).find(s => s.id === r.origin_station_id);
    const dest = Object.values(stationsMap).find(s => s.id === r.destination_station_id);
    if (orig && dest) {
      routesMap[`${orig.code}->${dest.code}`] = r;
    }
  }

  for (const rDef of routeDefs) {
    const key = `${rDef.origin}->${rDef.destination}`;
    const origStation = stationsMap[rDef.origin];
    const destStation = stationsMap[rDef.destination];

    if (origStation && destStation && !routesMap[key]) {
      const { data: createdRoute, error: rtErr } = await supabase.from('routes').insert([{
        origin_station_id: origStation.id,
        destination_station_id: destStation.id,
        active: true,
      }]).select();
      if (rtErr) console.error('Route insert error:', rtErr.message);
      else {
        routesMap[key] = createdRoute[0];
        console.log(`Created route: ${key}`);
      }
    } else if (routesMap[key]) {
      console.log(`Route already exists: ${key}`);
    }
  }

  // 4. Create Train Services
  let { data: existingTrains } = await supabase.from('train_services').select('*');
  existingTrains = existingTrains || [];

  const trainDefs = [
    {
      train_number: '12344',
      train_name: 'Darjeeling Mail (Superfast)',
      route_key: 'HDB->SDAH',
      dep_time: '18:15',
      arr_time: '06:00',
      base_fare: 385.00,
      seats: 720,
    },
    {
      train_number: '12364',
      train_name: 'Haldibari - Kolkata Tri-Weekly SF Express',
      route_key: 'HDB->KOAA',
      dep_time: '08:25',
      arr_time: '19:40',
      base_fare: 215.00,
      seats: 840,
    },
    {
      train_number: '22302',
      train_name: 'New Jalpaiguri - Howrah Vande Bharat Express',
      route_key: 'NJP->HWH',
      dep_time: '15:00',
      arr_time: '22:35',
      base_fare: 1565.00,
      seats: 530,
    },
    {
      train_number: '12042',
      train_name: 'New Jalpaiguri - Howrah Shatabdi Express',
      route_key: 'NJP->HWH',
      dep_time: '05:30',
      arr_time: '13:45',
      base_fare: 1420.00,
      seats: 600,
    },
  ];

  const trainsMap = {};
  for (const t of existingTrains) {
    trainsMap[t.train_number] = t;
  }

  for (const tDef of trainDefs) {
    if (!trainsMap[tDef.train_number]) {
      const route = routesMap[tDef.route_key];
      const { data: createdTrain, error: tErr } = await supabase.from('train_services').insert([{
        operator_id: operator.id,
        train_number: tDef.train_number,
        train_name: tDef.train_name,
        active: true,
      }]).select();

      if (tErr) console.error('Train service insert error:', tErr.message);
      else {
        trainsMap[tDef.train_number] = createdTrain[0];
        console.log(`Created train service: ${tDef.train_number} - ${tDef.train_name}`);
      }
    } else {
      console.log(`Train service already exists: ${tDef.train_number}`);
    }
  }

  // 5. Create Schedules for upcoming dates
  const dates = [
    '2026-09-20',
    '2026-09-21',
    '2026-09-22',
    '2026-09-23',
    '2026-09-24',
    '2026-09-25',
    '2026-09-26',
    '2026-09-27',
  ];

  let { data: existingSchedules } = await supabase.from('schedules').select('*');
  existingSchedules = existingSchedules || [];

  let newSchedulesCount = 0;
  for (const tDef of trainDefs) {
    const train = trainsMap[tDef.train_number];
    const route = routesMap[tDef.route_key];
    if (!train || !route) continue;

    for (const date of dates) {
      // Check if 12364 (tri-weekly: Wed, Fri, Sun)
      const dayOfWeek = new Date(date + 'T00:00:00Z').getUTCDay(); // 0 = Sun, 3 = Wed, 5 = Fri
      if (tDef.train_number === '12364') {
        if (dayOfWeek !== 0 && dayOfWeek !== 3 && dayOfWeek !== 5) {
          continue; // runs only Wed, Fri, Sun
        }
      }

      // Check if schedule already exists
      const alreadyExists = existingSchedules.some(
        s => s.train_service_id === train.id && s.travel_date === date
      );

      if (!alreadyExists) {
        const depTime = `${date}T${tDef.dep_time}:00Z`;
        const arrTime = `${date}T${tDef.arr_time}:00Z`;

        const { error: sErr } = await supabase.from('schedules').insert([{
          route_id: route.id,
          service_type: 'train',
          train_service_id: train.id,
          travel_date: date,
          departure_at: depTime,
          arrival_at: arrTime,
          status: 'scheduled',
          active: true,
        }]);

        if (sErr) console.error('Schedule insert error:', sErr.message);
        else newSchedulesCount++;
      }
    }
  }

  console.log(`✅ Successfully added ${newSchedulesCount} new schedules!`);
  console.log('🎉 Done! All trains and schedules from Haldibari to Kolkata are now in your database.');
}

importHaldibariTrains().catch(console.error);
