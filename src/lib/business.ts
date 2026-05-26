/**
 * Single source of truth for JSC RV Repair business facts.
 * Update here to propagate across the site.
 */
export const BUSINESS = {
  name: "JSC RV Repair",
  tagline: "RV Service, Storage & Maintenance — Built Around You",
  owner: "Joe Crawford",
  ownerShort: "Joe",
  about:
    "We're your local RV service experts, here to keep your rig road-ready. From routine maintenance to major repairs, we work on all makes and models — motorhomes, travel trailers, fifth wheels, boats, and more.",
  phone: "(574) 453-1573",
  phoneRaw: "+15744531573",
  email: "joe@jscrvrepair.com",
  address: {
    street: "6283 N St Rd 15",
    city: "Leesburg",
    state: "IN",
    zip: "46538",
    landmark: "Behind Owens Meat Market",
  },
  hours: {
    monday: "8:00 AM – 5:00 PM",
    tuesday: "8:00 AM – 5:00 PM",
    wednesday: "8:00 AM – 5:00 PM",
    thursday: "8:00 AM – 5:00 PM",
    friday: "8:00 AM – 5:00 PM",
    saturday: "By Appointment",
    sunday: "Closed",
  },
  socials: {
    facebook: "https://www.facebook.com/p/JSC-RV-Repair-100089516223252/",
    instagram: "https://www.instagram.com/jsc_rv_repair/",
  },
  services: [
    "Routine RV maintenance & seasonal prep",
    "Roof inspections, resealing, and replacement",
    "Slide-out repair, adjustment & service",
    "Awning service & replacement",
    "Plumbing, water heater & holding tank repair",
    "Electrical, batteries, solar & converter service",
    "Appliance repair (fridge, A/C, furnace)",
    "Brake, wheel bearing, and suspension service",
    "Generator service & winterization",
    "Body work, decal repair, fiberglass",
    "Pre-trip inspections",
    "Major collision & insurance work",
  ],
  storageFeatures: [
    "Outdoor RV & boat storage",
    "Secured lot behind Owens Meat Market",
    "Notice-based pickup: tell us when you're heading out, we'll prep it",
    "Optional tire inflation & systems check before pickup",
    "Wash, dump & refill add-ons on request",
    "Battery tending available",
  ],
  rvTypes: [
    "Class A Motorhomes",
    "Class B Camper Vans",
    "Class C Motorhomes",
    "Travel Trailers",
    "Fifth Wheels",
    "Toy Haulers",
    "Pop-ups",
    "Boats (storage)",
  ],
  serviceArea:
    "Leesburg, Warsaw, Syracuse, Milford, North Webster, Goshen, Elkhart and the surrounding Kosciusko & Elkhart County area",
  yearsInBusiness: 8,
  rating: 4.9,
  reviewCount: 87,
} as const;

export function formatAddressLine() {
  const a = BUSINESS.address;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}
