export interface Room {
  id: string;
  num: string;
  concept: string;
  name: string;
  desc: string;
  features: string[];
  price: string;
  img: string;
}

export const ROOMS: Room[] = [
  {
    id: 'romantic',
    num: '01',
    concept: 'romantic',
    name: 'Romantic',
    desc: 'Warm amber light, layered soft textiles, and a curated selection of scents. Designed for intimate evenings and slow mornings together.',
    features: ['King bed', 'Bath', 'Mood lighting', 'Balcony'],
    price: '990',
    img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'sky',
    num: '02',
    concept: 'sky',
    name: 'Sky',
    desc: 'An airy, cloud-like space drenched in pale blues and soft whites. Open layout, diffused natural light, and a serene lightness that clears the mind.',
    features: ['Queen bed', 'Skylight', 'Open bath', 'City view'],
    price: '890',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'cinema',
    num: '03',
    concept: 'cinema',
    name: 'Cinema',
    desc: 'A velvet-lined cocoon built for film nights. Projector wall, bespoke audio, deep cushions, and a curated movie library to disappear into.',
    features: ['Projector', 'Surround sound', 'Queen bed', 'Mini bar'],
    price: '1,090',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'nature',
    num: '04',
    concept: 'nature',
    name: 'Nature',
    desc: 'Raw timber, living moss walls, botanical prints and earth tones. A room that brings the outside in — grounding, still, and deeply calm.',
    features: ['King bed', 'Moss wall', 'Soaking tub', 'Garden view'],
    price: '940',
    img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'minimal',
    num: '05',
    concept: 'minimal',
    name: 'Minimal',
    desc: 'Nothing extra. Concrete, oak, linen. The design recedes so you can think clearly. Every object has a reason; everything else has been removed.',
    features: ['Queen bed', 'Concrete walls', 'Rain shower', 'Writing desk'],
    price: '850',
    img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=70',
  },
];

export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'sky', label: 'Sky' },
  { id: 'cinema', label: 'Cinema' },
  { id: 'nature', label: 'Nature' },
  { id: 'minimal', label: 'Minimal' },
];
