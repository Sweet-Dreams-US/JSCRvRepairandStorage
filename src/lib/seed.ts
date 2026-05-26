// Realistic seed data for the JSC RV Repair demo.
// Dates are computed relative to "now" so the demo always feels fresh.

import type {
  ActivityEvent,
  Customer,
  Expense,
  Invoice,
  Job,
  Lead,
  Message,
  PickupRequest,
  Quote,
  Rv,
  Shift,
  StaffMember,
  StorageSpot,
  Thread,
  TimeEntry,
} from "./types";

const now = new Date();
function daysAgo(d: number) {
  return new Date(now.getTime() - d * 86400000).toISOString();
}
function daysFromNow(d: number) {
  return new Date(now.getTime() + d * 86400000).toISOString();
}
function hoursAgo(h: number) {
  return new Date(now.getTime() - h * 3600000).toISOString();
}
function atDate(daysOffset: number, hour: number, minute = 0) {
  const d = new Date(now.getTime() + daysOffset * 86400000);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ---------- STAFF ----------
export const STAFF: StaffMember[] = [
  {
    id: "staff-joe",
    email: "joe@jscrvrepair.com",
    name: "Joe Crawford",
    role: "admin",
    phone: "(574) 453-1573",
    title: "Owner / Master Tech",
    hireDate: daysAgo(365 * 8),
    hourlyRate: 95,
    skills: ["Diagnosis", "Electrical", "Plumbing", "Slide-outs", "Roofs", "Body Work"],
    color: "#dc2626",
    createdAt: daysAgo(365 * 8),
  },
  {
    id: "staff-tina",
    email: "tina@jscrvrepair.com",
    name: "Tina Hartwell",
    role: "manager",
    phone: "(574) 453-1574",
    title: "Office Manager",
    hireDate: daysAgo(365 * 4),
    hourlyRate: 32,
    skills: ["Scheduling", "Quoting", "Customer Service", "Accounting"],
    color: "#2563eb",
    createdAt: daysAgo(365 * 4),
  },
  {
    id: "staff-hank",
    email: "hank@jscrvrepair.com",
    name: "Marcus \"Hank\" Henderson",
    role: "tech",
    phone: "(574) 453-1575",
    title: "Lead Technician",
    hireDate: daysAgo(365 * 5),
    hourlyRate: 38,
    skills: ["Appliance", "Generators", "A/C", "Furnace", "Refrigeration"],
    color: "#16a34a",
    createdAt: daysAgo(365 * 5),
  },
  {
    id: "staff-danny",
    email: "danny@jscrvrepair.com",
    name: "Daniel Klingsmith",
    role: "tech",
    phone: "(574) 453-1576",
    title: "RV Technician",
    hireDate: daysAgo(365 * 2),
    hourlyRate: 28,
    skills: ["Plumbing", "Tanks", "Slides", "Awnings"],
    color: "#f59e0b",
    createdAt: daysAgo(365 * 2),
  },
  {
    id: "staff-eddie",
    email: "eddie@jscrvrepair.com",
    name: "Eddie Brooks",
    role: "tech",
    phone: "(574) 453-1577",
    title: "Yard & Prep Technician",
    hireDate: daysAgo(365),
    hourlyRate: 22,
    skills: ["Detailing", "Tires", "Batteries", "Lot Movement", "Pre-trip Prep"],
    color: "#9333ea",
    createdAt: daysAgo(365),
  },
];

// ---------- CUSTOMERS ----------
export const CUSTOMERS: Customer[] = [
  {
    id: "cust-demo",
    email: "demo@customer.com",
    name: "Jane Whitcomb",
    role: "customer",
    phone: "(574) 555-0140",
    address: "1284 Lakeshore Dr, Syracuse, IN 46567",
    rvIds: ["rv-101"],
    preferredContact: "email",
    joinedDate: daysAgo(420),
    lifetimeValue: 8420,
    notes: "Long-time storage customer. Travels every spring & fall. Prefers text for quick stuff, email for quotes.",
    createdAt: daysAgo(420),
  },
  {
    id: "cust-bishop",
    email: "tom.bishop@example.com",
    name: "Tom & Linda Bishop",
    role: "customer",
    phone: "(574) 555-0118",
    address: "412 W Main St, Warsaw, IN 46580",
    rvIds: ["rv-102"],
    preferredContact: "phone",
    joinedDate: daysAgo(900),
    lifetimeValue: 14200,
    notes: "Snowbirds — gone Nov–Mar. Always wants a full inspection before they leave.",
    createdAt: daysAgo(900),
  },
  {
    id: "cust-reynolds",
    email: "mike.reynolds@example.com",
    name: "Mike Reynolds",
    role: "customer",
    phone: "(574) 555-0192",
    address: "8821 Hidden Cove Ln, Goshen, IN 46526",
    rvIds: ["rv-103"],
    preferredContact: "email",
    joinedDate: daysAgo(60),
    lifetimeValue: 1200,
    notes: "New customer — referred by Jim Atwood. Newer Class A, very particular about cosmetic work.",
    createdAt: daysAgo(60),
  },
  {
    id: "cust-whitfield",
    email: "sarah.whitfield@example.com",
    name: "Sarah Whitfield",
    role: "customer",
    phone: "(574) 555-0103",
    address: "2200 N Buffalo St, Warsaw, IN 46580",
    rvIds: ["rv-104"],
    preferredContact: "text",
    joinedDate: daysAgo(180),
    lifetimeValue: 3600,
    notes: "Quote pending — slide motor issue. Budget conscious, asks lots of questions.",
    createdAt: daysAgo(180),
  },
  {
    id: "cust-anderson",
    email: "anderson.family@example.com",
    name: "Greg & Mel Anderson",
    role: "customer",
    phone: "(574) 555-0177",
    address: "654 E Pickwick Rd, Syracuse, IN 46567",
    rvIds: ["rv-105"],
    preferredContact: "email",
    joinedDate: daysAgo(15),
    lifetimeValue: 0,
    notes: "First-timer with the toy hauler. Wants long-term storage + spring prep package.",
    createdAt: daysAgo(15),
  },
  {
    id: "cust-ostrander",
    email: "g.ostrander@example.com",
    name: "Greg Ostrander",
    role: "customer",
    phone: "(574) 555-0150",
    address: "70 Lake View Dr, North Webster, IN 46555",
    rvIds: ["rv-106"],
    preferredContact: "phone",
    joinedDate: daysAgo(600),
    lifetimeValue: 4800,
    notes: "Boat storage only. Picks up Memorial Day weekend, returns after Labor Day.",
    createdAt: daysAgo(600),
  },
  {
    id: "cust-keller",
    email: "p.keller@example.com",
    name: "Pam Keller",
    role: "customer",
    phone: "(260) 555-0181",
    address: "1801 W Polk St, Milford, IN 46542",
    rvIds: ["rv-107"],
    preferredContact: "email",
    joinedDate: daysAgo(220),
    lifetimeValue: 2100,
    notes: "Retired teacher, weekend traveler. Loves the pickup-prep service.",
    createdAt: daysAgo(220),
  },
  {
    id: "cust-doyle",
    email: "rdoyle@example.com",
    name: "Robert Doyle",
    role: "customer",
    phone: "(574) 555-0166",
    address: "3320 N CR 175 E, Pierceton, IN 46562",
    rvIds: ["rv-108"],
    preferredContact: "phone",
    joinedDate: daysAgo(80),
    lifetimeValue: 950,
    notes: "Older fifth wheel, ongoing roof issues. Patient.",
    createdAt: daysAgo(80),
  },
];

// ---------- RVS ----------
export const RVS: Rv[] = [
  {
    id: "rv-101",
    customerId: "cust-demo",
    nickname: "Wanderlust",
    type: "Travel Trailer",
    make: "Jayco",
    model: "Jay Flight 28BHS",
    year: 2021,
    length: 32,
    vin: "1UJBJ0BR3M1XW0123",
    plateState: "IN",
    plateNumber: "RV-2841",
    color: "White / Tan",
    notes: "Owner-installed solar (200W). Two slides.",
  },
  {
    id: "rv-102",
    customerId: "cust-bishop",
    nickname: "Snowbird",
    type: "Fifth Wheel",
    make: "Grand Design",
    model: "Reflection 303RLS",
    year: 2019,
    length: 34,
    vin: "573RL3FN6KE410987",
    plateState: "IN",
    plateNumber: "BISH-01",
    color: "White / Grey",
    notes: "Aftermarket residential fridge. Onan generator.",
  },
  {
    id: "rv-103",
    customerId: "cust-reynolds",
    type: "Class A",
    make: "Tiffin",
    model: "Allegro Bus 45OPP",
    year: 2023,
    length: 45,
    vin: "4UZAB3DA9NCMR9988",
    plateState: "IN",
    plateNumber: "REYN-22",
    color: "Pearl White",
    notes: "Brand new — owner is fussy about scratches. Full paint, not decals.",
  },
  {
    id: "rv-104",
    customerId: "cust-whitfield",
    type: "Fifth Wheel",
    make: "Forest River",
    model: "Cardinal 3950TZX",
    year: 2017,
    length: 41,
    vin: "4X4FCAM23H8901234",
    plateState: "IN",
    plateNumber: "WHIT-77",
    color: "Champagne",
    notes: "Bedroom slide motor failure — diagnosed 6 days ago.",
  },
  {
    id: "rv-105",
    customerId: "cust-anderson",
    nickname: "Adventure Hauler",
    type: "Toy Hauler",
    make: "Heartland",
    model: "Cyclone 4006",
    year: 2022,
    length: 43,
    vin: "5SFCG4422NE556677",
    plateState: "IN",
    plateNumber: "ANDR-04",
    color: "Charcoal / Red",
    notes: "Hauls two side-by-sides. Wants tie-down inspection.",
  },
  {
    id: "rv-106",
    customerId: "cust-ostrander",
    nickname: "The Knot Boss",
    type: "Boat",
    make: "Sea Ray",
    model: "Sundancer 320",
    year: 2018,
    length: 32,
    vin: "SERV1234B818",
    color: "Navy / White",
    notes: "Trailer included for storage.",
  },
  {
    id: "rv-107",
    customerId: "cust-keller",
    type: "Class C",
    make: "Winnebago",
    model: "Minnie Winnie 26T",
    year: 2020,
    length: 28,
    vin: "1FDXE45S8LDC30021",
    plateState: "IN",
    plateNumber: "KEL-26T",
    color: "White",
    notes: "House batteries swapped to lithium last summer.",
  },
  {
    id: "rv-108",
    customerId: "cust-doyle",
    type: "Fifth Wheel",
    make: "Keystone",
    model: "Montana 3711FL",
    year: 2012,
    length: 39,
    vin: "4YDF37120CR123456",
    plateState: "IN",
    plateNumber: "DOY-12",
    color: "White / Tan",
    notes: "Soft spots near front cap — needs major reseal.",
  },
];

// ---------- STORAGE LOT ----------
function makeLot(): StorageSpot[] {
  const spots: StorageSpot[] = [];
  // Zone A: 12 medium spots
  const aOccupancy: Record<string, string | undefined> = {
    "A-01": "rv-102",
    "A-02": "rv-101",
    "A-04": "rv-105",
    "A-06": "rv-107",
    "A-08": "rv-108",
    "A-11": "rv-104",
  };
  for (let i = 1; i <= 12; i++) {
    const label = `A-${String(i).padStart(2, "0")}`;
    const occupiedByRvId = aOccupancy[label];
    spots.push({
      id: `lot-a${i}`,
      label,
      zone: "A",
      size: "medium",
      hasPower: i <= 6,
      monthlyRate: 95,
      occupiedByRvId,
      status: occupiedByRvId ? "stored" : "out",
    });
  }
  // Zone B: 8 large spots
  const bOccupancy: Record<string, string | undefined> = {
    "B-01": "rv-103",
    "B-04": undefined,
    "B-07": undefined,
  };
  for (let i = 1; i <= 8; i++) {
    const label = `B-${String(i).padStart(2, "0")}`;
    const occupiedByRvId = bOccupancy[label];
    spots.push({
      id: `lot-b${i}`,
      label,
      zone: "B",
      size: "large",
      hasPower: true,
      monthlyRate: 135,
      occupiedByRvId,
      status: occupiedByRvId ? "stored" : "out",
    });
  }
  // Zone C: 6 xl spots
  for (let i = 1; i <= 6; i++) {
    spots.push({
      id: `lot-c${i}`,
      label: `C-${String(i).padStart(2, "0")}`,
      zone: "C",
      size: "xl",
      hasPower: true,
      monthlyRate: 175,
      status: "out",
    });
  }
  // Boat zone: 6 small spots
  const boatOccupancy: Record<string, string | undefined> = {
    "Boat-02": "rv-106",
  };
  for (let i = 1; i <= 6; i++) {
    const label = `Boat-${String(i).padStart(2, "0")}`;
    const occupiedByRvId = boatOccupancy[label];
    spots.push({
      id: `lot-boat${i}`,
      label,
      zone: "Boat",
      size: "small",
      hasPower: false,
      monthlyRate: 65,
      occupiedByRvId,
      status: occupiedByRvId ? "stored" : "out",
    });
  }
  // Mark spot A-02 as pending pickup (the demo customer)
  const aTwo = spots.find((s) => s.label === "A-02");
  if (aTwo) aTwo.status = "pending-pickup";
  return spots;
}
export const LOT: StorageSpot[] = makeLot();

// ---------- JOBS ----------
export const JOBS: Job[] = [
  {
    id: "job-1042",
    number: "WO-1042",
    customerId: "cust-whitfield",
    rvId: "rv-104",
    title: "Bedroom slide motor — won't extend",
    description:
      "Slide motor hums but slide will not move. Suspect motor seized or planetary gear failure. Pulled trim — sees no obvious obstruction.",
    status: "quote-sent",
    priority: "normal",
    assignedTechIds: ["staff-danny"],
    createdAt: daysAgo(7),
    scheduledStart: atDate(2, 9, 0),
    scheduledEnd: atDate(2, 16, 0),
    estimatedHours: 6,
    notes: [
      {
        id: "n1",
        authorId: "staff-danny",
        authorName: "Danny",
        body: "Pulled the motor — clearly seized. Lippert replacement is in stock at supplier, can have tomorrow.",
        createdAt: daysAgo(6),
        internal: true,
      },
    ],
    checklist: [
      { id: "c1", label: "Disconnect battery", done: true, doneBy: "Danny", doneAt: daysAgo(6) },
      { id: "c2", label: "Remove old motor", done: true, doneBy: "Danny", doneAt: daysAgo(6) },
      { id: "c3", label: "Install replacement", done: false },
      { id: "c4", label: "Cycle test 5x", done: false },
      { id: "c5", label: "Reseal trim", done: false },
    ],
    quoteId: "quote-2041",
    tags: ["slide", "lippert", "parts-on-order"],
  },
  {
    id: "job-1043",
    number: "WO-1043",
    customerId: "cust-reynolds",
    rvId: "rv-103",
    title: "10K mile service + roof inspection",
    description:
      "Manufacturer-recommended service interval. Lube slides, inspect all roof seams & caulking, brake check, generator service.",
    status: "in-progress",
    priority: "normal",
    assignedTechIds: ["staff-hank", "staff-danny"],
    createdAt: daysAgo(3),
    scheduledStart: atDate(0, 8, 0),
    scheduledEnd: atDate(0, 17, 0),
    estimatedHours: 9,
    actualHours: 4.5,
    notes: [
      {
        id: "n2",
        authorId: "staff-hank",
        authorName: "Hank",
        body: "Front cap caulking is starting to crack. Recommended add-on reseal — $385. Awaiting Mike's OK.",
        createdAt: hoursAgo(2),
        internal: false,
      },
    ],
    checklist: [
      { id: "c1", label: "Slide lube (4)", done: true, doneBy: "Danny", doneAt: hoursAgo(3) },
      { id: "c2", label: "Generator oil + filter", done: true, doneBy: "Hank", doneAt: hoursAgo(2) },
      { id: "c3", label: "Brake inspection", done: false },
      { id: "c4", label: "Roof seam walk", done: false },
      { id: "c5", label: "House battery test", done: false },
    ],
    tags: ["service", "class-a", "high-value"],
  },
  {
    id: "job-1044",
    number: "WO-1044",
    customerId: "cust-bishop",
    rvId: "rv-102",
    title: "Pre-snowbird departure checklist",
    description: "Full pre-trip + winterize-prep. Tires, brakes, hitch, all systems, holding tanks, smoke detectors.",
    status: "approved",
    priority: "high",
    assignedTechIds: ["staff-hank"],
    createdAt: daysAgo(5),
    scheduledStart: atDate(4, 8, 0),
    scheduledEnd: atDate(4, 14, 0),
    estimatedHours: 5,
    notes: [],
    checklist: [
      { id: "c1", label: "Tire pressure + tread depth all 6", done: false },
      { id: "c2", label: "Wheel bearings repack", done: false },
      { id: "c3", label: "Brake controller test", done: false },
      { id: "c4", label: "Generator load test", done: false },
      { id: "c5", label: "All slides cycled 3x", done: false },
      { id: "c6", label: "Smoke / CO / LP detector test", done: false },
    ],
    tags: ["pre-trip", "snowbird"],
  },
  {
    id: "job-1045",
    number: "WO-1045",
    customerId: "cust-doyle",
    rvId: "rv-108",
    title: "Front cap reseal + delamination repair",
    description: "Soft spots in front cap. Need to evaluate extent, reseal seams, address delam if isolated.",
    status: "diagnosing",
    priority: "high",
    assignedTechIds: ["staff-joe"],
    createdAt: daysAgo(2),
    estimatedHours: 12,
    notes: [
      {
        id: "n1",
        authorId: "staff-joe",
        authorName: "Joe",
        body: "Moisture meter showing 22% in three spots. Going to pull front cap to assess — likely larger job than initially thought.",
        createdAt: daysAgo(1),
        internal: true,
      },
    ],
    checklist: [
      { id: "c1", label: "Moisture map front cap", done: true, doneBy: "Joe", doneAt: daysAgo(1) },
      { id: "c2", label: "Pull cap for inspection", done: false },
      { id: "c3", label: "Document findings + photos for quote", done: false },
    ],
    tags: ["body", "delamination", "major"],
  },
  {
    id: "job-1046",
    number: "WO-1046",
    customerId: "cust-keller",
    rvId: "rv-107",
    title: "Refrigerator not cooling on propane",
    description: "Works fine on shore power. On LP it lights briefly then goes out. Suspect thermocouple or burner orifice.",
    status: "intake",
    priority: "normal",
    assignedTechIds: [],
    createdAt: hoursAgo(6),
    estimatedHours: 2,
    notes: [],
    checklist: [
      { id: "c1", label: "Verify symptoms", done: false },
      { id: "c2", label: "Clean burner / orifice", done: false },
      { id: "c3", label: "Replace thermocouple if needed", done: false },
    ],
    tags: ["fridge", "propane"],
  },
  {
    id: "job-1047",
    number: "WO-1047",
    customerId: "cust-demo",
    rvId: "rv-101",
    title: "Spring de-winterize + pickup prep",
    description: "Customer requested pickup prep package. De-winterize, sanitize fresh tank, top off propane, air all tires.",
    status: "ready",
    priority: "normal",
    assignedTechIds: ["staff-eddie"],
    createdAt: daysAgo(2),
    scheduledStart: atDate(1, 8, 0),
    scheduledEnd: atDate(1, 11, 0),
    completedAt: hoursAgo(20),
    estimatedHours: 3,
    actualHours: 2.75,
    notes: [
      {
        id: "n1",
        authorId: "staff-eddie",
        authorName: "Eddie",
        body: "All done. Sanitized lines, ran clear. Tires aired to 65 PSI. Propane topped off (filled 7 gallons).",
        createdAt: hoursAgo(20),
        internal: false,
      },
    ],
    checklist: [
      { id: "c1", label: "Blow out lines + bypass water heater", done: true, doneBy: "Eddie", doneAt: hoursAgo(22) },
      { id: "c2", label: "Sanitize fresh water tank", done: true, doneBy: "Eddie", doneAt: hoursAgo(21) },
      { id: "c3", label: "Top off propane", done: true, doneBy: "Eddie", doneAt: hoursAgo(20) },
      { id: "c4", label: "Tires to manufacturer spec", done: true, doneBy: "Eddie", doneAt: hoursAgo(20) },
      { id: "c5", label: "Battery test + reconnect", done: true, doneBy: "Eddie", doneAt: hoursAgo(20) },
    ],
    invoiceId: "inv-3060",
    tags: ["pickup-prep", "spring"],
  },
  {
    id: "job-1048",
    number: "WO-1048",
    customerId: "cust-anderson",
    rvId: "rv-105",
    title: "Initial intake + cargo tie-down inspection",
    description: "New customer dropping off for long-term storage. Wants ramp door seal + tie-down points inspected before storage.",
    status: "intake",
    priority: "low",
    assignedTechIds: ["staff-danny"],
    createdAt: hoursAgo(36),
    scheduledStart: atDate(3, 13, 0),
    scheduledEnd: atDate(3, 15, 0),
    estimatedHours: 2,
    notes: [],
    checklist: [
      { id: "c1", label: "Photo-document condition", done: false },
      { id: "c2", label: "Tie-down inspection", done: false },
      { id: "c3", label: "Ramp door seal check", done: false },
      { id: "c4", label: "Move to assigned lot spot", done: false },
    ],
    tags: ["intake", "new-customer", "toy-hauler"],
  },
  {
    id: "job-1041",
    number: "WO-1041",
    customerId: "cust-bishop",
    rvId: "rv-102",
    title: "Awning fabric replacement",
    description: "Replace torn awning fabric — Carefree 18'.",
    status: "completed",
    priority: "normal",
    assignedTechIds: ["staff-hank", "staff-eddie"],
    createdAt: daysAgo(21),
    scheduledStart: daysAgo(14),
    scheduledEnd: daysAgo(14),
    completedAt: daysAgo(14),
    estimatedHours: 3,
    actualHours: 2.5,
    notes: [],
    checklist: [],
    invoiceId: "inv-3055",
    tags: ["awning"],
  },
];

// ---------- QUOTES ----------
export const QUOTES: Quote[] = [
  {
    id: "quote-2041",
    number: "Q-2041",
    jobId: "job-1042",
    customerId: "cust-whitfield",
    rvId: "rv-104",
    status: "sent",
    lineItems: [
      { id: "li1", kind: "part", description: "Lippert slide motor (replacement)", quantity: 1, unitPrice: 285, taxable: true },
      { id: "li2", kind: "labor", description: "R&R slide motor, cycle test, reseal trim", quantity: 4, unitPrice: 125, taxable: false },
      { id: "li3", kind: "service", description: "Shop supplies + sealant", quantity: 1, unitPrice: 28, taxable: true },
    ],
    notes: "Quote valid for 30 days. Parts available locally — can complete within 2 business days of approval.",
    subtotal: 813,
    taxRate: 0.07,
    taxAmount: 21.91,
    total: 834.91,
    validUntil: daysFromNow(23),
    createdAt: daysAgo(6),
    sentAt: daysAgo(6),
  },
  {
    id: "quote-2042",
    number: "Q-2042",
    jobId: "job-1045",
    customerId: "cust-doyle",
    rvId: "rv-108",
    status: "draft",
    lineItems: [
      { id: "li1", kind: "labor", description: "Pull front cap for inspection", quantity: 3, unitPrice: 125, taxable: false },
      { id: "li2", kind: "labor", description: "Repair delamination (estimated)", quantity: 8, unitPrice: 125, taxable: false },
      { id: "li3", kind: "part", description: "Filon panel + adhesive kit", quantity: 1, unitPrice: 740, taxable: true },
      { id: "li4", kind: "labor", description: "Reinstall + reseal all seams", quantity: 4, unitPrice: 125, taxable: false },
      { id: "li5", kind: "service", description: "Disposal + shop supplies", quantity: 1, unitPrice: 95, taxable: true },
    ],
    notes: "Estimated. Actual cost may vary +/- 15% pending findings once cap is removed.",
    subtotal: 2710,
    taxRate: 0.07,
    taxAmount: 58.45,
    total: 2768.45,
    validUntil: daysFromNow(30),
    createdAt: hoursAgo(4),
  },
  {
    id: "quote-2040",
    number: "Q-2040",
    jobId: "job-1043",
    customerId: "cust-reynolds",
    rvId: "rv-103",
    status: "approved",
    lineItems: [
      { id: "li1", kind: "service", description: "10K Mile Manufacturer Service Package", quantity: 1, unitPrice: 685, taxable: false },
      { id: "li2", kind: "part", description: "Onan generator service kit", quantity: 1, unitPrice: 89, taxable: true },
      { id: "li3", kind: "part", description: "Brake adjusters (set)", quantity: 1, unitPrice: 145, taxable: true },
    ],
    subtotal: 919,
    taxRate: 0.07,
    taxAmount: 16.38,
    total: 935.38,
    validUntil: daysFromNow(20),
    createdAt: daysAgo(4),
    sentAt: daysAgo(4),
    decidedAt: daysAgo(3),
  },
  {
    id: "quote-2039",
    number: "Q-2039",
    customerId: "cust-demo",
    rvId: "rv-101",
    status: "approved",
    lineItems: [
      { id: "li1", kind: "service", description: "Spring De-winterize + Pickup Prep Package", quantity: 1, unitPrice: 195, taxable: false },
      { id: "li2", kind: "part", description: "Propane refill (7 gallons)", quantity: 7, unitPrice: 4.5, taxable: true },
    ],
    subtotal: 226.5,
    taxRate: 0.07,
    taxAmount: 2.21,
    total: 228.71,
    validUntil: daysAgo(0),
    createdAt: daysAgo(3),
    sentAt: daysAgo(3),
    decidedAt: daysAgo(2),
  },
];

// ---------- INVOICES ----------
export const INVOICES: Invoice[] = [
  {
    id: "inv-3060",
    number: "INV-3060",
    jobId: "job-1047",
    quoteId: "quote-2039",
    customerId: "cust-demo",
    status: "sent",
    lineItems: QUOTES.find((q) => q.id === "quote-2039")!.lineItems,
    subtotal: 226.5,
    taxRate: 0.07,
    taxAmount: 2.21,
    total: 228.71,
    amountPaid: 0,
    balanceDue: 228.71,
    dueDate: daysFromNow(14),
    createdAt: hoursAgo(20),
    sentAt: hoursAgo(20),
    payments: [],
  },
  {
    id: "inv-3055",
    number: "INV-3055",
    jobId: "job-1041",
    customerId: "cust-bishop",
    status: "paid",
    lineItems: [
      { id: "li1", kind: "part", description: "Carefree 18' awning fabric (sandstone)", quantity: 1, unitPrice: 385, taxable: true },
      { id: "li2", kind: "labor", description: "Awning fabric R&R", quantity: 2.5, unitPrice: 125, taxable: false },
    ],
    subtotal: 697.5,
    taxRate: 0.07,
    taxAmount: 26.95,
    total: 724.45,
    amountPaid: 724.45,
    balanceDue: 0,
    dueDate: daysAgo(0),
    createdAt: daysAgo(14),
    sentAt: daysAgo(14),
    payments: [
      {
        id: "pay-1",
        amount: 724.45,
        method: "card",
        reference: "Visa ****4421",
        receivedAt: daysAgo(11),
        notedBy: "Tina",
      },
    ],
  },
  {
    id: "inv-3053",
    number: "INV-3053",
    customerId: "cust-keller",
    status: "overdue",
    lineItems: [
      { id: "li1", kind: "service", description: "Monthly storage — Zone A spot A-06", quantity: 1, unitPrice: 95, taxable: false },
    ],
    subtotal: 95,
    taxRate: 0,
    taxAmount: 0,
    total: 95,
    amountPaid: 0,
    balanceDue: 95,
    dueDate: daysAgo(8),
    createdAt: daysAgo(30),
    sentAt: daysAgo(30),
    payments: [],
  },
  {
    id: "inv-3056",
    number: "INV-3056",
    customerId: "cust-ostrander",
    status: "paid",
    lineItems: [
      { id: "li1", kind: "service", description: "Boat storage — Boat-02 (winter)", quantity: 6, unitPrice: 65, taxable: false },
    ],
    subtotal: 390,
    taxRate: 0,
    taxAmount: 0,
    total: 390,
    amountPaid: 390,
    balanceDue: 0,
    dueDate: daysAgo(5),
    createdAt: daysAgo(35),
    sentAt: daysAgo(35),
    payments: [
      { id: "pay-2", amount: 390, method: "check", reference: "Check #1882", receivedAt: daysAgo(20), notedBy: "Tina" },
    ],
  },
];

// ---------- PICKUP REQUESTS ----------
export const PICKUPS: PickupRequest[] = [
  {
    id: "pickup-201",
    customerId: "cust-demo",
    rvId: "rv-101",
    pickupDate: daysFromNow(2),
    returnDate: daysFromNow(12),
    prepRequests: ["tires-aired", "battery-check", "water-fill", "exterior-wash"],
    notes: "Heading to Brown County for a 10-day trip. Would love it ready to roll Friday morning!",
    status: "confirmed",
    createdAt: daysAgo(2),
  },
  {
    id: "pickup-202",
    customerId: "cust-bishop",
    rvId: "rv-102",
    pickupDate: daysFromNow(7),
    returnDate: daysFromNow(140),
    prepRequests: ["tires-aired", "battery-check", "propane-check", "generator-test", "slide-test", "fridge-cooldown"],
    notes: "Heading south for the winter. Full pre-trip please.",
    status: "pending",
    createdAt: hoursAgo(20),
  },
  {
    id: "pickup-203",
    customerId: "cust-keller",
    rvId: "rv-107",
    pickupDate: daysFromNow(10),
    returnDate: daysFromNow(13),
    prepRequests: ["tires-aired", "fridge-cooldown"],
    notes: "Quick weekend trip to Indiana Dunes.",
    status: "pending",
    createdAt: hoursAgo(8),
  },
];

// ---------- MESSAGES ----------
export const THREADS: Thread[] = [
  {
    id: "thread-1",
    subject: "Spring pickup prep + trip prep questions",
    customerId: "cust-demo",
    jobId: "job-1047",
    rvId: "rv-101",
    participantIds: ["cust-demo", "staff-tina", "staff-eddie"],
    lastMessageAt: hoursAgo(19),
    unreadFor: { "cust-demo": 1, "staff-tina": 0, "staff-eddie": 0 },
  },
  {
    id: "thread-2",
    subject: "Slide motor quote — Q-2041",
    customerId: "cust-whitfield",
    jobId: "job-1042",
    participantIds: ["cust-whitfield", "staff-tina", "staff-danny"],
    lastMessageAt: hoursAgo(2),
    unreadFor: { "cust-whitfield": 0, "staff-tina": 1, "staff-danny": 1 },
  },
  {
    id: "thread-3",
    subject: "Front cap caulking add-on",
    customerId: "cust-reynolds",
    jobId: "job-1043",
    participantIds: ["cust-reynolds", "staff-hank", "staff-tina"],
    lastMessageAt: hoursAgo(2),
    unreadFor: { "cust-reynolds": 1, "staff-hank": 0, "staff-tina": 0 },
  },
];

export const MESSAGES: Message[] = [
  // Thread 1 — demo customer
  {
    id: "msg-1",
    threadId: "thread-1",
    fromUserId: "cust-demo",
    fromName: "Jane Whitcomb",
    fromRole: "customer",
    body: "Hi Joe! Wanted to confirm — picking up the trailer Friday morning. Could you make sure tires are aired and the battery's good? Heading to Brown County for 10 days.",
    createdAt: daysAgo(2),
    readBy: ["cust-demo", "staff-tina", "staff-eddie"],
  },
  {
    id: "msg-2",
    threadId: "thread-1",
    fromUserId: "staff-tina",
    fromName: "Tina Hartwell",
    fromRole: "manager",
    body: "Got it Jane! I'll have Eddie take care of all of that. Anything else on the list? Want us to top off the fresh water tank?",
    createdAt: daysAgo(2),
    readBy: ["cust-demo", "staff-tina", "staff-eddie"],
  },
  {
    id: "msg-3",
    threadId: "thread-1",
    fromUserId: "cust-demo",
    fromName: "Jane Whitcomb",
    fromRole: "customer",
    body: "Yes please! And if you can do an exterior wash that would be amazing. Whatever it costs.",
    createdAt: daysAgo(2),
    readBy: ["cust-demo", "staff-tina", "staff-eddie"],
  },
  {
    id: "msg-4",
    threadId: "thread-1",
    fromUserId: "staff-eddie",
    fromName: "Eddie Brooks",
    fromRole: "tech",
    body: "All wrapped up! Tires aired to 65 PSI, battery tested 12.8V, fresh tank sanitized and filled, propane topped off (7 gallons), exterior washed and dried. She's parked back at A-02 and ready when you are. Have a great trip!",
    createdAt: hoursAgo(19),
    readBy: ["staff-tina", "staff-eddie"],
  },
  // Thread 2 — Whitfield quote
  {
    id: "msg-5",
    threadId: "thread-2",
    fromUserId: "staff-tina",
    fromName: "Tina Hartwell",
    fromRole: "manager",
    body: "Hi Sarah, quote Q-2041 is in your portal for review. Total is $834.91. Parts are in stock locally so we can knock this out in 1-2 days once you approve.",
    createdAt: daysAgo(6),
    readBy: ["cust-whitfield", "staff-tina", "staff-danny"],
  },
  {
    id: "msg-6",
    threadId: "thread-2",
    fromUserId: "cust-whitfield",
    fromName: "Sarah Whitfield",
    fromRole: "customer",
    body: "Thanks! Quick question — is the Lippert the same model my original was? And does the labor include resealing the trim that was pulled?",
    createdAt: hoursAgo(2),
    readBy: ["cust-whitfield"],
  },
  // Thread 3 — Reynolds caulking
  {
    id: "msg-7",
    threadId: "thread-3",
    fromUserId: "staff-hank",
    fromName: "Marcus Henderson",
    fromRole: "tech",
    body: "Hi Mike — while doing the roof walk on your 10K service, noticed the front cap caulking is starting to crack in a couple spots. Not leaking yet, but worth addressing. Add-on would be $385. Want me to take care of it while we're in there?",
    createdAt: hoursAgo(2),
    readBy: ["staff-hank", "staff-tina"],
  },
];

// ---------- LEADS ----------
export const LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Wesley Hartman",
    email: "wes.hartman@example.com",
    phone: "(574) 555-0211",
    rvType: "Class C",
    interest: "repair",
    message: "AC stopped blowing cold last weekend. Need it looked at before our July trip. What's your earliest opening?",
    source: "google",
    status: "new",
    createdAt: hoursAgo(2),
  },
  {
    id: "lead-2",
    name: "Carla Mendoza",
    email: "cmendoza@example.com",
    phone: "(574) 555-0244",
    rvType: "Travel Trailer",
    interest: "storage",
    message: "Looking for a covered outdoor spot for a 28' travel trailer starting Oct 1. Do you have monthly availability?",
    source: "website",
    status: "new",
    createdAt: hoursAgo(8),
  },
  {
    id: "lead-3",
    name: "Stuart Demaree",
    email: "sdemaree@example.com",
    phone: "(260) 555-0162",
    rvType: "Fifth Wheel",
    interest: "quote",
    message: "Want a quote for a complete roof reseal on a 2014 Montana. Can send photos.",
    source: "facebook",
    status: "contacted",
    createdAt: daysAgo(2),
    assignedTo: "staff-tina",
  },
  {
    id: "lead-4",
    name: "Hannah Olbrich",
    email: "hannah.o@example.com",
    phone: "(574) 555-0119",
    rvType: "Class A",
    interest: "maintenance",
    message: "First-time RV owner — what does annual maintenance typically include? Recommended by a neighbor.",
    source: "referral",
    status: "scheduled",
    createdAt: daysAgo(5),
    assignedTo: "staff-tina",
  },
];

// ---------- SHIFTS ----------
export const SHIFTS: Shift[] = (() => {
  const out: Shift[] = [];
  // 2 weeks of shifts for techs
  const techs = ["staff-hank", "staff-danny", "staff-eddie"];
  for (let d = -3; d <= 10; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dow = day.getDay();
    if (dow === 0) continue; // closed Sunday
    techs.forEach((id, idx) => {
      const start = new Date(day);
      start.setHours(dow === 6 ? 9 : 8, 0, 0, 0);
      const end = new Date(day);
      end.setHours(dow === 6 ? 13 : 17, 0, 0, 0);
      out.push({
        id: `shift-${id}-${d}`,
        staffId: id,
        start: start.toISOString(),
        end: end.toISOString(),
        kind: idx === 2 ? "lot" : "shop",
      });
    });
    // Office: Tina
    const tStart = new Date(day);
    tStart.setHours(8, 30, 0, 0);
    const tEnd = new Date(day);
    tEnd.setHours(dow === 6 ? 13 : 16, 30, 0, 0);
    out.push({
      id: `shift-tina-${d}`,
      staffId: "staff-tina",
      start: tStart.toISOString(),
      end: tEnd.toISOString(),
      kind: "office",
    });
  }
  return out;
})();

// ---------- TIME ENTRIES ----------
export const TIME_ENTRIES: TimeEntry[] = [
  { id: "te-1", staffId: "staff-danny", jobId: "job-1042", start: daysAgo(6), end: daysAgo(6), notes: "Diagnosed", billable: true },
  { id: "te-2", staffId: "staff-hank", jobId: "job-1043", start: hoursAgo(5), end: hoursAgo(2.5), notes: "Slide lube + gen service", billable: true },
  { id: "te-3", staffId: "staff-danny", jobId: "job-1043", start: hoursAgo(5), end: hoursAgo(3), notes: "Assisted Hank", billable: true },
  { id: "te-4", staffId: "staff-joe", jobId: "job-1045", start: daysAgo(1), end: daysAgo(1), notes: "Diagnosed front cap", billable: true },
  { id: "te-5", staffId: "staff-eddie", jobId: "job-1047", start: hoursAgo(22), end: hoursAgo(19.25), notes: "Pickup prep", billable: true },
];

// ---------- EXPENSES ----------
export const EXPENSES: Expense[] = [
  { id: "exp-1", date: daysAgo(2), category: "parts", vendor: "Lippert Components", amount: 285, description: "Slide motor for WO-1042", jobId: "job-1042" },
  { id: "exp-2", date: daysAgo(4), category: "parts", vendor: "Cummins Onan", amount: 89, description: "Generator service kit (WO-1043)", jobId: "job-1043" },
  { id: "exp-3", date: daysAgo(8), category: "fuel", vendor: "Speedway", amount: 142.55, description: "Shop truck + transport", jobId: undefined },
  { id: "exp-4", date: daysAgo(12), category: "utilities", vendor: "Kosciusko REMC", amount: 412.18, description: "Monthly electric", jobId: undefined },
  { id: "exp-5", date: daysAgo(28), category: "rent", vendor: "Property LLC", amount: 2100, description: "Monthly lot lease", jobId: undefined },
  { id: "exp-6", date: daysAgo(15), category: "insurance", vendor: "Hartford Business", amount: 1180, description: "Garage liability premium", jobId: undefined },
  { id: "exp-7", date: daysAgo(20), category: "parts", vendor: "Carefree of Colorado", amount: 285, description: "Awning fabric for WO-1041", jobId: "job-1041" },
  { id: "exp-8", date: daysAgo(60), category: "tools", vendor: "Snap-on", amount: 480, description: "Torque wrench set", jobId: undefined },
  { id: "exp-9", date: daysAgo(7), category: "marketing", vendor: "Meta Ads", amount: 240, description: "Storage promotion boost", jobId: undefined },
  { id: "exp-10", date: daysAgo(33), category: "payroll", vendor: "Payroll", amount: 14820, description: "Bi-weekly payroll", jobId: undefined },
];

// ---------- ACTIVITY FEED ----------
export const ACTIVITY: ActivityEvent[] = [
  {
    id: "act-1",
    kind: "quote-sent",
    actorId: "staff-tina",
    actorName: "Tina",
    description: "Sent quote Q-2041 to Sarah Whitfield ($834.91)",
    targetType: "quote",
    targetId: "quote-2041",
    createdAt: daysAgo(6),
  },
  {
    id: "act-2",
    kind: "quote-approved",
    actorId: "cust-reynolds",
    actorName: "Mike Reynolds",
    description: "Approved quote Q-2040 ($935.38)",
    targetType: "quote",
    targetId: "quote-2040",
    createdAt: daysAgo(3),
  },
  {
    id: "act-3",
    kind: "job-status-changed",
    actorId: "staff-hank",
    actorName: "Hank",
    description: "WO-1043 → In Progress",
    targetType: "job",
    targetId: "job-1043",
    createdAt: hoursAgo(5),
  },
  {
    id: "act-4",
    kind: "pickup-requested",
    actorId: "cust-bishop",
    actorName: "Tom Bishop",
    description: "Requested pickup for Snowbird (5th wheel) on " + new Date(daysFromNow(7)).toLocaleDateString(),
    targetType: "pickup",
    targetId: "pickup-202",
    createdAt: hoursAgo(20),
  },
  {
    id: "act-5",
    kind: "lead-created",
    actorId: "lead-1",
    actorName: "Wesley Hartman",
    description: "New lead from Google — AC repair inquiry",
    targetType: "lead",
    targetId: "lead-1",
    createdAt: hoursAgo(2),
  },
  {
    id: "act-6",
    kind: "payment-received",
    actorId: "staff-tina",
    actorName: "Tina",
    description: "Logged $390.00 check from Greg Ostrander (INV-3056)",
    targetType: "invoice",
    targetId: "inv-3056",
    createdAt: daysAgo(20),
  },
  {
    id: "act-7",
    kind: "job-status-changed",
    actorId: "staff-eddie",
    actorName: "Eddie",
    description: "WO-1047 → Ready for Pickup",
    targetType: "job",
    targetId: "job-1047",
    createdAt: hoursAgo(19),
  },
  {
    id: "act-8",
    kind: "message-sent",
    actorId: "staff-hank",
    actorName: "Hank",
    description: "Messaged Mike Reynolds re: front cap caulking add-on ($385)",
    targetType: "job",
    targetId: "job-1043",
    createdAt: hoursAgo(2),
  },
];
