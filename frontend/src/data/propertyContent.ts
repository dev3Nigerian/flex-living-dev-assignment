export interface PropertyContent {
  id: number;
  name: string;
  headline: string;
  location: {
    city: string;
    country: string;
    address: string;
    mapEmbedUrl: string;
  };
  heroImages: string[];
  stats: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  highlights: { label: string; value: string }[];
  description: string;
  amenities: string[];
  houseRules: string[];
  nearby: string[];
}

export const propertyContent: Record<string, PropertyContent> = {
  '253093': {
    id: 253093,
    name: '2B N1 A - 29 Shoreditch Heights',
    headline: 'Industrial character meets hotel-grade service in the heart of East London.',
    location: {
      city: 'London',
      country: 'United Kingdom',
      address: '29 Great Eastern St, Shoreditch N1',
      mapEmbedUrl: 'https://maps.google.com/maps?q=29%20Great%20Eastern%20St%2C%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    heroImages: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    ],
    stats: {
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      beds: 3,
    },
    highlights: [
      { label: 'Sleeps', value: '5 guests' },
      { label: 'Layout', value: '2 Bed · 2 Bath · 1 Flex Room' },
      { label: 'Workspace', value: 'Dedicated desk + 300 Mbps Wi-Fi' },
      { label: 'Concierge', value: 'On-demand 24/7' },
    ],
    description:
      'Replicating The Flex flagship aesthetic, this duplex layers exposed brick, steel-framed windows, and curated art with generous natural light. Guests enjoy seamless digital check-in, weekly housekeeping, and access to The Flex Clubhouse for events & co-working.',
    amenities: [
      'Self check-in with smart lock',
      'Washer & dryer in suite',
      'Fully stocked chef’s kitchen',
      'Hotel-grade linens',
      'Sonos sound',
      'Blackout shades',
      'Premium bathroom amenities',
      'Air conditioning',
      'Complimentary bike storage',
      'Weekly housekeeping included',
    ],
    houseRules: [
      'No smoking or vaping',
      'Quiet hours after 10 pm',
      'Pets on request only',
      'No parties or filming without approval',
    ],
    nearby: ['Old Spitalfields Market (6 min walk)', 'Liverpool St Station (9 min walk)', 'Columbia Road Flower Market (15 min walk)'],
  },
  '112233': {
    id: 112233,
    name: 'Canary Wharf Docklands Loft',
    headline: 'Skyline duplex with cinematic Thames views and concierge-grade service.',
    location: {
      city: 'London',
      country: 'United Kingdom',
      address: '14 Hertsmere Rd, Canary Wharf E14',
      mapEmbedUrl: 'https://maps.google.com/maps?q=14%20Hertsmere%20Rd%2C%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    heroImages: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=800&q=80',
    ],
    stats: {
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      beds: 2,
    },
    highlights: [
      { label: 'Sleeps', value: '4 guests' },
      { label: 'Views', value: 'Docklands skyline' },
      { label: 'Connectivity', value: 'Jubilee/DLR in 3 mins' },
      { label: 'Speed', value: '500 Mbps fibre' },
    ],
    description:
      'A bright, modern loft perched above the Canary Wharf estate. Floor-to-ceiling windows, integrated Sonos audio, and a serviced lobby deliver a hotel-like experience tailored for extended stays.',
    amenities: [
      'Concierge welcome',
      'In-suite washer/dryer',
      'Climate control',
      'Ergonomic workspace',
      'Fully stocked kitchen',
      'High-speed fibre',
    ],
    houseRules: ['No smoking', 'No pets without approval', 'Respect building quiet hours (10pm-7am)'],
    nearby: ['Canary Wharf Crossrail (4 min)', 'Jubilee Park (5 min)', 'Le Cabrera (2 min)'],
  },
  '556677': {
    id: 556677,
    name: 'Soho Design Studio',
    headline: 'Creative bolt-hole with gallery lighting and a remote-work ready setup.',
    location: {
      city: 'London',
      country: 'United Kingdom',
      address: '71 Berwick St, Soho W1F',
      mapEmbedUrl: 'https://maps.google.com/maps?q=71%20Berwick%20St%2C%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    heroImages: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1467987506553-8f3916508521?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    ],
    stats: {
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      beds: 2,
    },
    highlights: [
      { label: 'Sleeps', value: '3 guests' },
      { label: 'Workspace', value: 'Dual monitors + sit/stand desk' },
      { label: 'Sound', value: 'Acoustic insulation upgrade' },
      { label: 'Service', value: 'Weekly housekeeping' },
    ],
    description:
      'Set above Berwick Street Market, the studio merges polished concrete floors with curated art pieces. Perfect for remote workers needing proximity to the West End and a private, quiet space to focus.',
    amenities: [
      'Smart lock entry',
      'Curated minibar',
      'Dedicated fibre',
      'Air conditioning',
      'Rain shower',
      'Nespresso Pro machine',
    ],
    houseRules: ['No parties or events', 'Please keep music low after 9pm', 'Pet stays reviewed case-by-case'],
    nearby: ['Soho Theatre (3 min)', 'Tottenham Court Rd (6 min)', 'Soho House 40 Greek Street (2 min)'],
  },
  '334455': {
    id: 334455,
    name: 'Camden Town Artist Retreat',
    headline: 'A bohemian townhouse with leafy terrace and curated record collection.',
    location: {
      city: 'London',
      country: 'United Kingdom',
      address: '12 Royal College St, Camden NW1',
      mapEmbedUrl: 'https://maps.google.com/maps?q=12%20Royal%20College%20St%2C%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    heroImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484100356142-db6ab6244067?auto=format&fit=crop&w=800&q=80',
    ],
    stats: {
      guests: 5,
      bedrooms: 3,
      bathrooms: 2,
      beds: 4,
    },
    highlights: [
      { label: 'Sleeps', value: '5 guests' },
      { label: 'Outdoor', value: 'Private terrace' },
      { label: 'Music', value: 'Vintage amp + vinyl' },
      { label: 'Workspace', value: 'Artist table + fibre' },
    ],
    description:
      'Blending exposed brick with mid-century furniture, the retreat is ideal for longer creative residencies. Two living zones and a foliage-lined terrace invite both collaboration and downtime.',
    amenities: [
      'Full kitchen',
      'Projector & Sonos',
      'High-speed Wi-Fi',
      'Utility room',
      'Weekly cleaning',
      'Heated floors',
    ],
    houseRules: ['Respect neighbours after 9pm', 'No smoking indoors', 'Pets allowed on request'],
    nearby: ['Camden Market (4 min)', 'Regent’s Canal (2 min)', 'Mornington Crescent (5 min)'],
  },
  '778899': {
    id: 778899,
    name: 'Notting Hill Garden Maisonette',
    headline: 'Serene two-level home with conservatory dining and private garden.',
    location: {
      city: 'London',
      country: 'United Kingdom',
      address: '8 Chepstow Villas, Notting Hill W11',
      mapEmbedUrl: 'https://maps.google.com/maps?q=8%20Chepstow%20Villas%2C%20London&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    heroImages: [
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    ],
    stats: {
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      beds: 4,
    },
    highlights: [
      { label: 'Sleeps', value: '6 guests' },
      { label: 'Garden', value: 'South-facing, furnished' },
      { label: 'Family', value: 'Travel cot + high chair' },
      { label: 'Connectivity', value: 'Central line (7 min)' },
    ],
    description:
      'Pastel hues, chequerboard floors, and vaulted ceilings define this maisonette. Families love the sunroom dining table and the ability to step right into a private garden oasis after exploring Portobello Road.',
    amenities: [
      'Chef’s kitchen',
      'In-unit laundry',
      'Bath + rain shower',
      'Smart TV & Sonos',
      'Dedicated workspace',
      'Fast Wi-Fi',
    ],
    houseRules: ['No amplified music outdoors', 'Kindly remove shoes upstairs', 'No parties'],
    nearby: ['Portobello Road (3 min)', 'Holland Park (10 min)', 'Notting Hill Gate (7 min)'],
  },
};

