const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bgdnjmllgeksnpoxykza.supabase.co';
const supabaseKey = 'sb_publishable_eR1NLATV3mrIYRVUoJn1Lw_jQ_nWy9h';
const supabase = createClient(supabaseUrl, supabaseKey);

async function importHaldibariBuses() {
  console.log('🚌 Starting import of Haldibari & North Bengal to Kolkata bus services...');

  // 1. Create Bus Operators
  const busOperatorDefs = [
    { name: 'NBSTC (North Bengal State Transport)', type: 'bus' },
    { name: 'Shyamoli Paribahan Pvt. Ltd.', type: 'bus' },
    { name: 'Greenline Travels', type: 'bus' },
    { name: 'Royal Cruiser', type: 'bus' },
  ];

  let { data: existingOps } = await supabase.from('operators').select('*');
  existingOps = existingOps || [];

  const operatorsMap = {};
  for (const o of existingOps) {
    operatorsMap[o.name] = o;
  }

  for (const opDef of busOperatorDefs) {
    const existing = existingOps.find(o => o.name.toLowerCase() === opDef.name.toLowerCase());
    if (!existing) {
      const { data: created, error } = await supabase.from('operators').insert([{
        name: opDef.name,
        type: opDef.type,
        active: true,
      }]).select();
      if (error) console.error('Operator insert error:', error.message);
      else {
        operatorsMap[opDef.name] = created[0];
        console.log(`Created operator: ${opDef.name}`);
      }
    } else {
      operatorsMap[opDef.name] = existing;
      console.log(`Operator already exists: ${opDef.name}`);
    }
  }

  // 2. Ensure Bus Terminals / Stations
  const busStationDefs = [
    { name: 'ESPLANADE BUS TERMINUS (KOLKATA)', code: 'KOL-ESP', city: 'Kolkata' },
    { name: 'BABUGHAT BUS TERMINUS (KOLKATA)', code: 'KOL-BBG', city: 'Kolkata' },
    { name: 'TENZING NORGAY CENTRAL BUS TERMINUS', code: 'SLG-TNC', city: 'Siliguri' },
  ];

  let { data: existingStations } = await supabase.from('stations').select('*');
  existingStations = existingStations || [];

  const stationsMap = {};
  for (const s of existingStations) {
    stationsMap[s.code] = s;
  }

  for (const sDef of busStationDefs) {
    if (!stationsMap[sDef.code]) {
      const { data: created, error } = await supabase.from('stations').insert([{
        name: sDef.name,
        code: sDef.code,
        city: sDef.city,
        active: true,
      }]).select();
      if (error) console.error('Station insert error:', error.message);
      else {
        stationsMap[sDef.code] = created[0];
        console.log(`Created station: ${sDef.name} (${sDef.code})`);
      }
    } else {
      console.log(`Station already exists: ${sDef.code}`);
    }
  }

  // 3. Ensure Routes exist
  let { data: existingRoutes } = await supabase.from('routes').select('*');
  existingRoutes = existingRoutes || [];

  const routeDefs = [
    { origin: 'HDB', destination: 'SDAH' },
    { origin: 'HDB', destination: 'KOL-ESP' },
    { origin: 'SLG-TNC', destination: 'KOL-ESP' },
    { origin: 'SLG-TNC', destination: 'KOL-BBG' },
    { origin: 'NJP', destination: 'HWH' },
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
      const { data: createdRoute, error } = await supabase.from('routes').insert([{
        origin_station_id: origStation.id,
        destination_station_id: destStation.id,
        active: true,
      }]).select();
      if (error) console.error('Route insert error:', error.message);
      else {
        routesMap[key] = createdRoute[0];
        console.log(`Created route: ${key}`);
      }
    } else if (routesMap[key]) {
      console.log(`Route already exists: ${key}`);
    }
  }

  // 4. Create Bus Services
  let { data: existingBuses } = await supabase.from('bus_services').select('*');
  existingBuses = existingBuses || [];

  const busDefs = [
    {
      operator_name: 'NBSTC (North Bengal State Transport)',
      service_name: 'NBSTC Rocket AC Express (Haldibari - Kolkata)',
      vehicle_type: 'AC Seater (2+2)',
      route_key: 'HDB->SDAH',
      dep_time: '17:30',
      arr_time: '06:30',
      seats: 45,
      fare: 580.00,
    },
    {
      operator_name: 'Shyamoli Paribahan Pvt. Ltd.',
      service_name: 'Shyamoli Volvo 9600 Multi-Axle AC Sleeper',
      vehicle_type: 'AC Sleeper (2+1)',
      route_key: 'HDB->KOL-ESP',
      dep_time: '19:00',
      arr_time: '06:45',
      seats: 36,
      fare: 1450.00,
    },
    {
      operator_name: 'Greenline Travels',
      service_name: 'Greenline Volvo B11R Luxury Sleeper',
      vehicle_type: 'AC Sleeper (2+1)',
      route_key: 'SLG-TNC->KOL-ESP',
      dep_time: '20:00',
      arr_time: '07:30',
      seats: 38,
      fare: 1550.00,
    },
    {
      operator_name: 'Royal Cruiser',
      service_name: 'Royal Cruiser Mercedes-Benz Super Luxury',
      vehicle_type: 'Semi-Sleeper (2+2)',
      route_key: 'SLG-TNC->KOL-BBG',
      dep_time: '18:30',
      arr_time: '06:00',
      seats: 42,
      fare: 1200.00,
    },
    {
      operator_name: 'NBSTC (North Bengal State Transport)',
      service_name: 'NBSTC Deluxe Non-AC Express',
      vehicle_type: 'Seater (2+3)',
      route_key: 'HDB->SDAH',
      dep_time: '16:00',
      arr_time: '06:00',
      seats: 52,
      fare: 390.00,
    },
  ];

  const busesMap = {};
  for (const b of existingBuses) {
    busesMap[b.service_name] = b;
  }

  for (const bDef of busDefs) {
    if (!busesMap[bDef.service_name]) {
      const op = operatorsMap[bDef.operator_name];
      const { data: createdBus, error } = await supabase.from('bus_services').insert([{
        operator_id: op ? op.id : null,
        service_name: bDef.service_name,
        vehicle_type: bDef.vehicle_type,
        active: true,
      }]).select();

      if (error) console.error('Bus service insert error:', error.message);
      else {
        busesMap[bDef.service_name] = createdBus[0];
        console.log(`Created bus service: ${bDef.service_name}`);
      }
    } else {
      console.log(`Bus service already exists: ${bDef.service_name}`);
    }
  }

  // 5. Create Schedules for Upcoming Dates
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
  for (const bDef of busDefs) {
    const bus = busesMap[bDef.service_name];
    const route = routesMap[bDef.route_key] || routesMap['HDB->SDAH'];
    if (!bus || !route) continue;

    for (const date of dates) {
      const alreadyExists = existingSchedules.some(
        s => s.bus_service_id === bus.id && s.travel_date === date
      );

      if (!alreadyExists) {
        const depTime = `${date}T${bDef.dep_time}:00Z`;
        const arrTime = `${date}T${bDef.arr_time}:00Z`;

        const { error } = await supabase.from('schedules').insert([{
          route_id: route.id,
          service_type: 'bus',
          bus_service_id: bus.id,
          travel_date: date,
          departure_at: depTime,
          arrival_at: arrTime,
          status: 'scheduled',
          active: true,
        }]);

        if (error) console.error('Schedule insert error:', error.message);
        else newSchedulesCount++;
      }
    }
  }

  console.log(`✅ Successfully added ${newSchedulesCount} new bus schedules!`);
  console.log('🎉 Done! All bus services and schedules are now live in the database.');
}

importHaldibariBuses().catch(console.error);
