export interface Room {
  id: string;
  number: string;
  name: string;
  concept: string;
  description: string;
  price: string;
  image: string;
  href: string;
}

export interface Concept {
  id: string;
  number: string;
  name: string;
  description: string;
  href: string;
}

export interface Review {
  id: string;
  stars: number;
  quote: string;
  authorInitial: string;
  authorName: string;
}

export const ROOMS: Room[] = [
  {
    id: "romantic",
    number: "01",
    name: "Romantic",
    concept: "romantic",
    description: "Warm light, soft textures, a gentle mood for two.",
    price: "990k",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=70",
    href: "/rooms?concept=romantic",
  },
  {
    id: "sky",
    number: "02",
    name: "Sky",
    concept: "sky",
    description: "Airy tones, open feeling, bright and calm.",
    price: "890k",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=70",
    href: "/rooms?concept=sky",
  },
  {
    id: "cinema",
    number: "03",
    name: "Cinema",
    concept: "cinema",
    description: "Projector nights, velvet touch, dim warm glow.",
    price: "1,090k",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=70",
    href: "/rooms?concept=cinema",
  },
  {
    id: "nature",
    number: "04",
    name: "Nature",
    concept: "nature",
    description: "Green accents, wood warmth, botanical calm.",
    price: "940k",
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=70",
    href: "/rooms?concept=nature",
  },
  {
    id: "minimal",
    number: "05",
    name: "Minimal",
    concept: "minimal",
    description: "Clean lines, quiet space, intentional detail.",
    price: "850k",
    image:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=70",
    href: "/rooms?concept=minimal",
  },
];

export const CONCEPTS: Concept[] = [
  {
    id: "romantic",
    number: "01",
    name: "Romantic",
    description: "Warm light, soft textures, gentle mood.",
    href: "/rooms?concept=romantic",
  },
  {
    id: "sky",
    number: "02",
    name: "Sky",
    description: "Airy tones, open feeling, bright calm.",
    href: "/rooms?concept=sky",
  },
  {
    id: "cinema",
    number: "03",
    name: "Cinema",
    description: "Projector nights, velvet touch, dim glow.",
    href: "/rooms?concept=cinema",
  },
  {
    id: "nature",
    number: "04",
    name: "Nature",
    description: "Green accents, wood warmth, botanical calm.",
    href: "/rooms?concept=nature",
  },
  {
    id: "minimal",
    number: "05",
    name: "Minimal",
    description: "Clean lines, quiet space, intentional detail.",
    href: "/rooms?concept=minimal",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    stars: 5,
    quote:
      '"The room felt like a boutique hotel — minimal but warm. Lighting at night was perfect."',
    authorInitial: "L",
    authorName: "Linh · Minimal Room",
  },
  {
    id: "r2",
    stars: 5,
    quote:
      '"Cinema room is such a vibe. Projector + cozy textures = best staycation."',
    authorInitial: "M",
    authorName: "Minh · Cinema Room",
  },
  {
    id: "r3",
    stars: 5,
    quote:
      '"Everything looked curated — from the materials to small amenities. Very photogenic."',
    authorInitial: "H",
    authorName: "Hà · Romantic Room",
  },
];
