// Carbon emission coefficients based on EPA, DEFRA, and CEA India standards
// Sources: CEA India CO₂ Baseline Database, ARAI, DEFRA 2023, BEE India,
//          Poore & Nemecek (Science 2018), EPA WARM, GHG Protocol
export const EMISSION_FACTORS = {
  // Travel (kg CO2e per passenger-km)
  travel: {
    walking: 0.0,
    bicycle: 0.0,
    metro: 0.032,              // DMRC / DEFRA 2023 urban rail (high occupancy)
    college_bus: 0.038,        // ARAI diesel/CNG 45+ student occupancy
    public_bus: 0.052,         // DEFRA / MoHUA municipal bus average
    ev_two_wheeler: 0.024,     // BEE / CEA: 0.030 kWh/km × 0.81 kg CO2e/kWh
    petrol_two_wheeler: 0.098, // ARAI 100-150cc 4-stroke commuter (40-45 km/L)
    carpool: 0.065,            // petrol car ÷ 3 average occupants
    petrol_car_solo: 0.192,    // DEFRA 2023 medium petrol car, single occupant
  },

  // Electricity (kg CO2e per kWh) — CEA India National Grid, Ver 18
  electricity_per_kwh: 0.81,
  ac_kwh_per_hour: 1.25,       // 1.5-ton BEE-rated inverter AC @ 24°C
  laptop_kwh_per_hour: 0.065,  // Energy Star v8.0 / IEC 62623
  lab_equipment_kwh_per_hour: 0.35,

  // Food & Diet (kg CO2e per person per day)
  // Sources: Poore & Nemecek Science 2018, EAT-Lancet, WRI Diet Calculator
  diet: {
    vegan: 1.45,
    vegetarian: 1.85,
    eggetarian: 2.30,
    non_vegetarian_moderate: 3.20,
    non_vegetarian_heavy: 4.80,
  },

  // Waste & Single-Use Plastics
  plastic_bottle_kg: 0.082,       // 500ml PET bottle — EPA WARM / Franklin LCA
  disposable_paper_cup_kg: 0.035, // PE-lined paper cup — VTT LCA
  food_waste_per_kg: 2.10,        // Unmanaged landfill — IPCC 2006 Waste
  general_waste_per_kg: 0.58,     // Mixed MSW landfill — EPA WARM
};

// ─── Monthly conversion constant ───────────────────────────────────────────────
// Weekly-frequency activities (commute, weekly waste) use 30/7 so that every
// category resolves to a consistent 30-day monthly basis.
// 30 / 7 ≈ 4.286 wks/month  (replaces the previous inconsistent 4.2 value)
const WEEKS_PER_MONTH = 30 / 7;

// ─── Personal Monthly Footprint ────────────────────────────────────────────────
export function calculatePersonalFootprint(inputs) {
  // ── 1. Commute (weekly activity → 30-day month) ─────────────────────────────
  const commuteFactor = EMISSION_FACTORS.travel[inputs.commuteMode] ?? 0.098;
  // Guard: distance and days must be non-negative finite numbers
  const commuteDistance    = Math.max(0, Number(inputs.commuteDistance)    || 0);
  const commuteDaysPerWeek = Math.max(0, Math.min(7, Number(inputs.commuteDaysPerWeek) || 5));
  const monthlyKm      = commuteDistance * commuteDaysPerWeek * WEEKS_PER_MONTH;
  const travelMonthly  = monthlyKm * commuteFactor;

  // ── 2. Electricity (30-day basis — no weekly conversion needed) ──────────────
  // Note: AC hours must represent the student's personal share in a shared room.
  const acHoursDaily     = Math.max(0, Math.min(24, Number(inputs.acHoursDaily)     || 0));
  const laptopHoursDaily = Math.max(0, Math.min(24, Number(inputs.laptopHoursDaily) || 6));
  const isHosteler       = inputs.accommodationType === 'hostel';

  const baseElectricityDaily = isHosteler ? 2.5 : 4.0; // base room load kWh/day
  const acDailyKwh     = acHoursDaily     * EMISSION_FACTORS.ac_kwh_per_hour;
  const laptopDailyKwh = laptopHoursDaily * EMISSION_FACTORS.laptop_kwh_per_hour;
  const totalDailyKwh  = baseElectricityDaily + acDailyKwh + laptopDailyKwh;
  const electricityMonthly = totalDailyKwh * 30 * EMISSION_FACTORS.electricity_per_kwh;

  // ── 3. Diet (30-day basis) ───────────────────────────────────────────────────
  const dietDailyFactor = EMISSION_FACTORS.diet[inputs.dietType] ?? 1.85;
  const dietMonthly     = dietDailyFactor * 30;

  // ── 4. Waste (weekly activity → 30-day month, same multiplier as commute) ────
  const plasticBottlesWeekly = Math.max(0, Number(inputs.plasticBottlesWeekly) || 0);
  const paperCupsWeekly      = Math.max(0, Number(inputs.paperCupsWeekly)      || 0);
  const recycles             = inputs.recyclesWaste === true;

  const plasticMonthly = plasticBottlesWeekly * WEEKS_PER_MONTH * EMISSION_FACTORS.plastic_bottle_kg;
  const cupMonthly     = paperCupsWeekly      * WEEKS_PER_MONTH * EMISSION_FACTORS.disposable_paper_cup_kg;
  const baselineWasteMonthly = isHosteler ? 8.0 : 14.0; // kg misc waste/month
  const wasteMonthly = (
    plasticMonthly + cupMonthly + (baselineWasteMonthly * EMISSION_FACTORS.general_waste_per_kg)
  ) * (recycles ? 0.65 : 1.0);

  // ── 5. Guard each category — no negative emissions ───────────────────────────
  const safeTravelMonthly      = Math.max(0, travelMonthly);
  const safeElectricityMonthly = Math.max(0, electricityMonthly);
  const safeDietMonthly        = Math.max(0, dietMonthly);
  const safeWasteMonthly       = Math.max(0, wasteMonthly);

  const totalMonthly = safeTravelMonthly + safeElectricityMonthly + safeDietMonthly + safeWasteMonthly;
  // Annualized 12-Month Equivalent Projection (calendar-year extrapolation)
  const totalAnnual  = totalMonthly * 12;

  const campusAverage = 165.0; // kg CO2e/month campus student average
  const diffPercent   = Math.round(((totalMonthly - campusAverage) / campusAverage) * 100);

  let rating      = 'Average';
  let ratingColor = 'text-amber-600 bg-amber-50 border-amber-200';
  if (totalMonthly < 120) {
    rating      = 'Eco Champion';
    ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (totalMonthly > 220) {
    rating      = 'High Footprint';
    ratingColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  return {
    travelMonthly:      Math.round(safeTravelMonthly      * 10) / 10,
    electricityMonthly: Math.round(safeElectricityMonthly * 10) / 10,
    dietMonthly:        Math.round(safeDietMonthly        * 10) / 10,
    wasteMonthly:       Math.round(safeWasteMonthly       * 10) / 10,
    totalMonthly:       Math.round(totalMonthly           * 10) / 10,
    totalAnnual:        Math.round(totalAnnual),
    campusAverage,
    diffPercent,
    rating,
    ratingColor,
    // Expose sanitized commute inputs for the What-If Simulator
    commuteMode:         inputs.commuteMode || 'petrol_two_wheeler',
    commuteDistance,
    commuteDaysPerWeek,
  };
}

// ─── College Event Carbon Footprint ────────────────────────────────────────────
export function calculateEventFootprint(eventData) {
  // Guard primary inputs
  const attendees     = Math.max(1,  Number(eventData.attendees)     || 100);
  const durationHours = Math.max(0,  Number(eventData.durationHours) || 6);
  const venueType     = eventData.venueType || 'auditorium';

  // ── 1. Attendee Travel ───────────────────────────────────────────────────────
  // Normalize mode percentages so combined total never exceeds 100%.
  // Any remaining % is implicitly walking/cycling (zero-emission).
  const rawBusPct  = Math.max(0, Number(eventData.commutePercentBus        || 40));
  const rawBikePct = Math.max(0, Number(eventData.commutePercentTwoWheeler || 25));
  const rawCarPct  = Math.max(0, Number(eventData.commutePercentCar        || 10));
  const rawTotal   = rawBusPct + rawBikePct + rawCarPct;
  const normFactor = rawTotal > 100 ? 100 / rawTotal : 1;
  const busPct     = rawBusPct  * normFactor;
  const bikePct    = rawBikePct * normFactor;
  const carPct     = rawCarPct  * normFactor;

  // Clamp derived counts to actual event size
  const busPax        = Math.min(attendees, attendees * (busPct  / 100));
  const twoWheelerPax = Math.min(attendees, attendees * (bikePct / 100));
  const carPax        = Math.min(attendees, attendees * (carPct  / 100));
  const avgDistance   = Math.max(0, Number(eventData.avgDistanceKm) || 16); // roundtrip km

  const travelEmissions =
    (busPax        * avgDistance * EMISSION_FACTORS.travel.college_bus) +
    (twoWheelerPax * avgDistance * EMISSION_FACTORS.travel.petrol_two_wheeler) +
    (carPax        * avgDistance * (EMISSION_FACTORS.travel.petrol_car_solo / 2)); // avg 2 occupants

  // ── 2. Venue Energy & Lighting ───────────────────────────────────────────────
  let venueKwPerHour = 15;
  if (venueType === 'seminar_hall')     venueKwPerHour = 8;
  if (venueType === 'outdoor')          venueKwPerHour = 6;
  if (venueType === 'auditorium_large') venueKwPerHour = 30;

  const energyEmissions = venueKwPerHour * durationHours * EMISSION_FACTORS.electricity_per_kwh;

  // ── 3. Catering / Food ───────────────────────────────────────────────────────
  // Clamp meal count: cannot exceed actual attendance
  const mealsProvided = Math.min(
    attendees,
    Math.max(0, Number(eventData.mealsCount) || (eventData.providesFood ? attendees : 0))
  );
  const vegRatio    = Math.min(1, Math.max(0, Number(eventData.vegRatioPercent || 75) / 100));
  const nonVegRatio = 1 - vegRatio;
  const foodEmissions = mealsProvided * ((vegRatio * 0.95) + (nonVegRatio * 2.40));

  // ── 4. Materials & Disposables ───────────────────────────────────────────────
  const usesDisposables  = eventData.cutleryType === 'single_use_plastic';
  const cutleryEmission  = usesDisposables ? (mealsProvided * 0.12) : (mealsProvided * 0.02);
  const bannersCount     = Math.max(0, Number(eventData.flexBannersCount) || 4);
  const printedPrograms  = Math.max(0, Number(eventData.printedBrochures) || 0);
  const materialsEmissions = cutleryEmission + (bannersCount * 6.5) + (printedPrograms * 0.04);

  const totalKgCO2e   = Math.max(0, travelEmissions + energyEmissions + foodEmissions + materialsEmissions);
  const perAttendeeKg = Math.round((totalKgCO2e / attendees) * 100) / 100;

  // ── 5. Eco Grade ─────────────────────────────────────────────────────────────
  let grade = 'B', gradeBadge = 'bg-teal-100 text-teal-800 border-teal-300';
  if      (perAttendeeKg < 2.0) { grade = 'A+'; gradeBadge = 'bg-emerald-600 text-white border-emerald-700'; }
  else if (perAttendeeKg < 3.5) { grade = 'A';  gradeBadge = 'bg-emerald-500 text-white border-emerald-600'; }
  else if (perAttendeeKg < 5.0) { grade = 'B';  gradeBadge = 'bg-teal-100 text-teal-800 border-teal-300';   }
  else if (perAttendeeKg < 7.5) { grade = 'C';  gradeBadge = 'bg-amber-100 text-amber-800 border-amber-300'; }
  else                           { grade = 'D';  gradeBadge = 'bg-rose-100 text-rose-800 border-rose-300';   }

  // Trees required = total CO2e ÷ 21 kg (annual sequestration per mature tree — not immediate removal)
  const treesToOffset = Math.ceil(totalKgCO2e / 21);

  return {
    totalKgCO2e:  Math.round(totalKgCO2e),
    totalMetricTons: Math.round((totalKgCO2e / 1000) * 100) / 100,
    perAttendeeKg,
    grade,
    gradeBadge,
    breakdown: {
      travel:    Math.round(travelEmissions),
      energy:    Math.round(energyEmissions),
      food:      Math.round(foodEmissions),
      materials: Math.round(materialsEmissions),
    },
    treesToOffset,
    // Expose normalized split so UI can warn when rescaling occurred
    effectiveCommuteSplit: { busPct, bikePct, carPct, wasNormalized: rawTotal > 100 },
  };
}
