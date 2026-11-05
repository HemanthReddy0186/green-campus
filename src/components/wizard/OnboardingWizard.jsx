import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  Layers,
  Car,
  Zap,
  Salad,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  AlertCircle,
  Download,
  Info,
  Check,
  Code,
  Brain,
  Cpu,
  Radio,
  Wrench,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS, ACADEMIC_YEARS, SECTIONS } from '../../data/initialData';
import { calculatePersonalFootprint } from '../../data/emissionFactors';

export default function OnboardingWizard() {
  const { currentUser, setCurrentUser, setCurrentView, addAudit } = useApp();

  // Step state: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections
  const [selectedDept, setSelectedDept] = useState(currentUser.department || 'CSE');
  const [selectedYear, setSelectedYear] = useState(currentUser.year || '3');
  const [selectedSection, setSelectedSection] = useState(currentUser.section || 'F');
  const [selectedModule, setSelectedModule] = useState('direct'); // 'direct' or 'bulk_upload'

  // Direct calculation parameters
  const [commuteMode, setCommuteMode] = useState('petrol_two_wheeler');
  const [commuteDistance, setCommuteDistance] = useState(12); // km roundtrip
  const [commuteDays, setCommuteDays] = useState(5);

  const [accommodationType, setAccommodationType] = useState('hostel'); // 'hostel' or 'day_scholar'
  const [acHoursDaily, setAcHoursDaily] = useState(3);
  const [laptopHoursDaily, setLaptopHoursDaily] = useState(6);

  const [dietType, setDietType] = useState('vegetarian');
  const [plasticBottlesWeekly, setPlasticBottlesWeekly] = useState(2);
  const [paperCupsWeekly, setPaperCupsWeekly] = useState(3);
  const [recyclesWaste, setRecyclesWaste] = useState(true);

  // Bulk file upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Computed results for direct calculation
  const footprintResult = calculatePersonalFootprint({
    commuteMode,
    commuteDistance,
    commuteDaysPerWeek: commuteDays,
    accommodationType,
    acHoursDaily,
    laptopHoursDaily,
    dietType,
    plasticBottlesWeekly,
    paperCupsWeekly,
    recyclesWaste,
  });

  const stepsList = [
    { num: 1, label: 'Department' },
    { num: 2, label: 'Year' },
    { num: 3, label: 'Section' },
    { num: 4, label: 'Module' },
    { num: 5, label: selectedModule === 'bulk_upload' ? 'Upload' : 'Commute' },
    { num: 6, label: selectedModule === 'bulk_upload' ? 'Validate' : 'Energy & Waste' },
    { num: 7, label: 'Review' },
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    // Save audit record
    addAudit({
      title: `${selectedDept} ${ACADEMIC_YEARS.find((y) => y.id === selectedYear)?.title} - Audit`,
      department: selectedDept,
      year: `${selectedYear}rd year`,
      section: `Section ${selectedSection}`,
      totalMonthlyKg: footprintResult.totalMonthly,
      annualEstimatedKg: footprintResult.totalAnnual,
      travelKg: footprintResult.travelMonthly,
      electricityKg: footprintResult.electricityMonthly,
      dietKg: footprintResult.dietMonthly,
      wasteKg: footprintResult.wasteMonthly,
      rating: footprintResult.rating,
      pointsEarned: 50,
    });

    // Update user profile
    setCurrentUser((prev) => ({
      ...prev,
      department: selectedDept,
      year: selectedYear,
      section: selectedSection,
    }));

    setCurrentView('dashboard');
  };

  // Sample CSV template download (Faithful to Screen 12 "Download template")
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'student_id,student_name,department,year,section,commute_mode,distance_km,ac_hours_daily,diet_type,plastic_bottles_weekly\n' +
      'STU101,Alex Rivera,CSE,3,F,petrol_two_wheeler,12,3,vegetarian,2\n' +
      'STU102,Priya Sharma,CSE,3,F,college_bus,18,0,vegan,0\n' +
      'STU103,Rohan Verma,CSE,3,F,bicycle,4,1,non_vegetarian_moderate,4\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'green_campus_student_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate file upload validation matching Screen 13 & 14
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setUploadError(null);
    setUploadSuccess(null);

    setTimeout(() => {
      setIsProcessingFile(false);
      setUploadedFile(file);

      // If file name has 'invalid' or 'wrong', show screenshot's missing column error
      if (file.name.toLowerCase().includes('wrong') || file.name.toLowerCase().includes('invalid')) {
        setUploadError(
          'Missing columns: student_id, student_name, commute_mode. Please use the downloadable template.'
        );
      } else {
        setUploadSuccess(
          `Successfully parsed ${file.name} (48 student records processed, average footprint: 146.2 kg CO₂e).`
        );
      }
    }, 700);
  };

  const getDepartmentIcon = (iconName) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 text-left">
      {/* Top Header / Progress Indicator — Faithful to Screen 06 ("STEP 01 / 07") */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            NEW CAMPAIGN & AUDIT
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-0.5">
            {currentStep === 1 && 'Select a department.'}
            {currentStep === 2 && 'Choose the year.'}
            {currentStep === 3 && 'Choose your section.'}
            {currentStep === 4 && 'Choose your module.'}
            {currentStep === 5 && (selectedModule === 'bulk_upload' ? 'Upload campus data.' : 'Daily commute & travel.')}
            {currentStep === 6 && (selectedModule === 'bulk_upload' ? 'Review & validate records.' : 'Electricity, diet & waste.')}
            {currentStep === 7 && 'Review & verify calculation.'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentStep === 1 && 'Start with the right team.'}
            {currentStep === 2 && 'Select the student batch.'}
            {currentStep === 3 && 'Keep the calculation focused.'}
            {currentStep === 4 && 'Two paths. One connected campus.'}
            {currentStep === 5 && (selectedModule === 'bulk_upload' ? 'Drop your spreadsheet below.' : 'Estimate transport emissions.')}
            {currentStep === 6 && (selectedModule === 'bulk_upload' ? 'Check columns and data types.' : 'Input lifestyle and campus factors.')}
            {currentStep === 7 && 'Save progress and update shared department ranking.'}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400 uppercase">
            Step
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            0{currentStep} <span className="text-slate-300 font-normal text-lg">/ 07</span>
          </div>
        </div>
      </div>

      {/* Stepper Tabs Bar — Faithful to Screens 06-11 */}
      <div className="flex items-center overflow-x-auto py-2 border-b border-slate-200 gap-6 text-xs font-medium no-scrollbar">
        {stepsList.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div
              key={step.num}
              onClick={() => step.num < currentStep && setCurrentStep(step.num)}
              className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition ${
                isCurrent
                  ? 'text-slate-950 font-bold border-b-2 border-slate-900 pb-2 -mb-2.5'
                  : isDone
                  ? 'text-slate-700 hover:text-slate-950'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    isCurrent
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step.num}
                </span>
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Context breadcrumb hint under stepper (e.g. "CSE / 3rd year / Section F") */}
      {currentStep > 1 && (
        <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          <span>{selectedDept}</span>
          {currentStep >= 3 && <span>/ {selectedYear}rd year</span>}
          {currentStep >= 4 && <span>/ Section {selectedSection}</span>}
        </div>
      )}

      {/* Step Contents */}
      <div className="min-h-[380px] pt-2">
        {/* STEP 1: Department Selection Cards — Exact visual style of Screen 06 */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept.id;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50/70 shadow-xs ring-1 ring-slate-800'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      {getDepartmentIcon(dept.icon)}
                    </div>

                    {/* Radio indicator circle matching Screen 06 */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'border-2 border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {dept.code}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {dept.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: Academic Year Cards — Exact visual style of Screen 07 & 08 */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {ACADEMIC_YEARS.map((yr) => {
              const isSelected = selectedYear === yr.id;

              return (
                <div
                  key={yr.id}
                  onClick={() => setSelectedYear(yr.id)}
                  className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-56 ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50/80 shadow-xs ring-1 ring-slate-800'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {yr.num}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'border-2 border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {yr.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {yr.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3: Section Cards — Exact visual style of Screen 09 */}
        {currentStep === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {SECTIONS.map((sec) => {
              const isSelected = selectedSection === sec;

              return (
                <div
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50/80 shadow-xs ring-1 ring-slate-800'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Users className="w-3.5 h-3.5" />
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'border-2 border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      SECTION
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {sec}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 4: Choose Module — Exact visual style of Screen 10 & 11 */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Direct Student Audit */}
            <div
              onClick={() => setSelectedModule('direct')}
              className={`p-8 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                selectedModule === 'direct'
                  ? 'border-slate-800 bg-slate-50/80 shadow-xs ring-1 ring-slate-800'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Leaf className="w-6 h-6" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    selectedModule === 'direct'
                      ? 'bg-slate-900 text-white'
                      : 'border-2 border-slate-300'
                  }`}
                >
                  {selectedModule === 'direct' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Personal Carbon Audit
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Step-by-step interactive questionnaire for daily commute, hostel/home electricity, dining meals, and single-use plastic waste.
                </p>
                <div className="flex gap-2 text-[11px] font-semibold text-slate-400">
                  <span>Interactive</span> • <span>Individual Score</span> • <span>Instant Badges</span>
                </div>
              </div>
            </div>

            {/* Card 2: Bulk CSV Upload */}
            <div
              onClick={() => setSelectedModule('bulk_upload')}
              className={`p-8 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                selectedModule === 'bulk_upload'
                  ? 'border-slate-800 bg-slate-50/80 shadow-xs ring-1 ring-slate-800'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    selectedModule === 'bulk_upload'
                      ? 'bg-slate-900 text-white'
                      : 'border-2 border-slate-300'
                  }`}
                >
                  {selectedModule === 'bulk_upload' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Bulk Campus Spreadsheet
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Upload class student logs via CSV or Excel file. Automatically parses and aggregates emissions across your batch.
                </p>
                <div className="flex gap-2 text-[11px] font-semibold text-slate-400">
                  <span>CSV / Excel</span> • <span>Batch Import</span> • <span>Class Records</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 & 6 (Option A): Direct Input Commute & Energy */}
        {selectedModule === 'direct' && currentStep === 5 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Daily Commute & Travel</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Primary Transport Mode
                </label>
                <select
                  value={commuteMode}
                  onChange={(e) => setCommuteMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="walking">Walking (0 kg CO₂e)</option>
                  <option value="bicycle">Bicycle (0 kg CO₂e)</option>
                  <option value="metro">Metro / Train (0.032 kg/km)</option>
                  <option value="college_bus">College Bus (0.038 kg/km)</option>
                  <option value="public_bus">Public City Bus (0.052 kg/km)</option>
                  <option value="ev_two_wheeler">Electric Scooter / EV (0.024 kg/km)</option>
                  <option value="petrol_two_wheeler">Petrol Bike / Scooter (0.098 kg/km)</option>
                  <option value="carpool">Carpool (2-3 students) (0.065 kg/km)</option>
                  <option value="petrol_car_solo">Solo Petrol Car / Cab (0.192 kg/km)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Green modes (bus, cycle, walk) drastically reduce personal footprint.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Roundtrip Distance (km per day): <span className="font-mono text-emerald-700 font-bold">{commuteDistance} km</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={commuteDistance}
                  onChange={(e) => setCommuteDistance(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 km (Hostel)</span>
                  <span>30 km</span>
                  <span>60 km</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700">Days Commuting Per Week:</span>
                <span className="ml-2 font-mono font-bold text-slate-900">{commuteDays} days</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setCommuteDays(d)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${
                      commuteDays === d
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 (Option A): Direct Input Energy, Food, Waste */}
        {selectedModule === 'direct' && currentStep === 6 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Electricity & Living */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Electricity & Accommodation</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Residence Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccommodationType('hostel')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      accommodationType === 'hostel'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Campus Hostel
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccommodationType('day_scholar')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      accommodationType === 'day_scholar'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Day Scholar / Apartment
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Air Conditioner Usage: <span className="font-mono text-amber-700 font-bold">{acHoursDaily} hrs/day</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={acHoursDaily}
                  onChange={(e) => setAcHoursDaily(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Laptop / Desktop Use: <span className="font-mono font-bold">{laptopHoursDaily} hrs/day</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={laptopHoursDaily}
                  onChange={(e) => setLaptopHoursDaily(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>
            </div>

            {/* Food Habits & Waste */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Salad className="w-4 h-4 text-emerald-600" />
                <span>Diet & Single-Use Waste</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dietary Habit
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="vegan">Vegan (Lowest Impact)</option>
                  <option value="vegetarian">Vegetarian (Balanced)</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian_moderate">Non-Vegetarian (1-2x/week)</option>
                  <option value="non_vegetarian_heavy">Non-Vegetarian (Daily)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Single-Use Plastic Bottles: <span className="font-mono font-bold">{plasticBottlesWeekly} per week</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={plasticBottlesWeekly}
                  onChange={(e) => setPlasticBottlesWeekly(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recyclesWaste}
                    onChange={(e) => setRecyclesWaste(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-slate-900"
                  />
                  <span>I actively segregate dry/wet waste and recycle paper</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 & 6 (Option B): Bulk CSV Dropzone — Exact visual style of Screens 12, 13, 14 */}
        {selectedModule === 'bulk_upload' && (currentStep === 5 || currentStep === 6) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
            {/* Minimalist Dropzone matching Screenshot 12 */}
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 hover:border-slate-400 transition flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                Drop your student list here.
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                CSV or Excel · Up to 5 MB · 5,000 students
              </p>

              <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm">
                <span>Browse files →</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {isProcessingFile && (
                <div className="mt-4 text-xs font-medium text-slate-500 animate-pulse">
                  Parsing student rows and validating columns...
                </div>
              )}
            </div>

            {/* Sub-bar matching Screen 12 ("First worksheet only", "Download template") */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>First worksheet only</span>
              </span>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download template</span>
              </button>
            </div>

            {/* Error banner matching Screenshot 13 & 14 */}
            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Success banner */}
            {uploadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{uploadSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Review & Results Summary */}
        {currentStep === 7 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase">
                  Audit Summary Ready
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-2">
                  {footprintResult.totalMonthly} <span className="text-sm font-medium text-slate-400">kg CO₂e / month</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Annualized impact: <span className="font-bold text-slate-800">{footprintResult.totalAnnual} kg CO₂e / year</span>
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${footprintResult.ratingColor}`}>
                  {footprintResult.rating}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  {footprintResult.diffPercent > 0
                    ? `+${footprintResult.diffPercent}% above campus average`
                    : `${Math.abs(footprintResult.diffPercent)}% lower than campus avg`}
                </p>
              </div>
            </div>

            {/* Category breakdown bar & pills */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">
                Monthly Breakdown by Category
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Travel</div>
                  <div className="text-base font-bold text-slate-900">{footprintResult.travelMonthly} kg</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Electricity</div>
                  <div className="text-base font-bold text-slate-900">{footprintResult.electricityMonthly} kg</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Diet</div>
                  <div className="text-base font-bold text-slate-900">{footprintResult.dietMonthly} kg</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Waste</div>
                  <div className="text-base font-bold text-slate-900">{footprintResult.wasteMonthly} kg</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Completing this audit awards <strong>+50 Eco Points</strong> to you and {selectedDept} department.</span>
              </div>
              <span className="font-bold text-emerald-700">+50 Pts</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer — Exact style of Screens 08, 09, 10 */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          {currentStep < 7 && `Next: ${stepsList[currentStep]?.label}`}
          {currentStep === 7 && 'Confirm your student audit to continue.'}
        </div>

        <div>
          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-95 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition active:scale-95 shadow-md"
            >
              <span>Save & Update Ranking →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

