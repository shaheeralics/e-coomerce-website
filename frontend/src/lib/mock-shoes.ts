import { Shoe } from '@/types';

export const MOCK_SHOES: Shoe[] = [
  {
    id: 'velocity-stratus-v1',
    name: 'Velocity Stratus V1',
    description: 'Engineered for ultimate cloud-like comfort, the Stratus features a highly responsive foam midsole and a breathable engineered mesh upper. Ideal for daily runners seeking supreme cushioning and high energy return.',
    price: 160,
    category: 'running',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508184964240-ee96bb96778f?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Infrared Red', 'Midnight Black', 'Platinum Grey'],
    inStock: true,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'Best Seller',
    specs: [
      'Heel-to-toe drop: 8mm',
      'Weight: 265g (US size 9)',
      'Midsole: Responsive HyperFoam technology',
      'Outsole: Multi-surface high-traction rubber'
    ],
    materials: [
      'Upper: 100% Recycled polyester engineered mesh',
      'Lining: Soft breathable microfiber',
      'Insole: Molded Ortholite comfort bed'
    ]
  },
  {
    id: 'velocity-aeromax-blue',
    name: 'Velocity Aeromax',
    description: 'A fusion of athletic performance and sleek street style. The Aeromax offers lightweight support with a form-fitting knit collar and dual-density cushioning that moves naturally with your foot.',
    price: 145,
    originalPrice: 180,
    category: 'running',
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ['Deep Ocean Blue', 'Cool Grey', 'Neon Green'],
    inStock: true,
    rating: 4.6,
    reviewsCount: 98,
    badge: 'Sale',
    specs: [
      'Heel-to-toe drop: 6mm',
      'Weight: 240g (US size 9)',
      'Support: Neutral stability framework',
      'Flexibility: Deep flex-groove tread'
    ],
    materials: [
      'Upper: Dynamic AeroKnit weave',
      'Midsole: Ultra-light EVA blend',
      'Sustainability: Contains 40% ocean plastic yarn'
    ]
  },
  {
    id: 'velocity-onyx-minimalist',
    name: 'Velocity Onyx Minimalist',
    description: 'Stripped back to the absolute essentials, the Onyx is a masterclass in modern footwear design. Featuring a premium leather lining and a seamless mesh construct, it is the perfect daily driver.',
    price: 130,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Matte Black', 'Classic White', 'Slate Grey'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 215,
    badge: 'New',
    specs: [
      'Profile: Low-cut lifestyle sneaker',
      'Weight: 220g (US size 9)',
      'Sole height: 25mm flat cushion',
      'Closure: Premium waxed cotton laces'
    ],
    materials: [
      'Upper: Double-layer breathable jacquard',
      'Lining: Premium full-grain Nappa leather',
      'Outsole: Vulcanized natural rubber'
    ]
  },
  {
    id: 'velocity-origin-classic',
    name: 'Velocity Origin Gum',
    description: 'An archival design reimagined for today. The Origin pairs textured canvas and soft suede detailing with a retro gum sole, bringing nostalgic athletic aesthetics to your modern wardrobe.',
    price: 110,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    colors: ['Desert Sand / Gum', 'Forest Green / White', 'Classic Navy'],
    inStock: true,
    rating: 4.5,
    reviewsCount: 76,
    specs: [
      'Style: Retro heritage sneakers',
      'Footbed: Cushioned cork-topped EVA foam',
      'Arch support: Moderate structured arch support'
    ],
    materials: [
      'Upper: High-density organic cotton canvas & Suede trim',
      'Outsole: 100% Natural Forest Stewardship Council (FSC) rubber gum'
    ]
  },
  {
    id: 'velocity-trailblazer-rugged',
    name: 'Velocity Trailblazer',
    description: 'Engineered for off-road discovery. The Trailblazer combines a waterproof ripstop upper with high-traction, deep-lugged rubber to conquer muddy paths, rocky trails, and mountain peaks.',
    price: 175,
    category: 'running',
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: ['Earthy Olive / Volt', 'Cargo Charcoal', 'Trail Rust Orange'],
    inStock: true,
    rating: 4.7,
    reviewsCount: 64,
    badge: 'New',
    specs: [
      'Heel-to-toe drop: 10mm',
      'Lugs: 5mm directional traction lugs',
      'Waterproofing: HydroShield breathable membrane',
      'Toe cap: Reinforced TPU stone guard'
    ],
    materials: [
      'Upper: Ripstop ballistic nylon & Kevlar reinforcement overlays',
      'Midsole: Dual-density compression-molded EVA',
      'Outsole: High-friction MaxGrip rubber'
    ]
  },
  {
    id: 'velocity-zenith-limited',
    name: 'Velocity Zenith Chromatic',
    description: 'Strictly limited. The Zenith features a futuristic chromatic design with light-reflective overlays that shift colorway in motion. Includes custom numbered branding details.',
    price: 240,
    category: 'limited',
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19de842?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [41, 42, 43, 44, 45],
    colors: ['Chromatic Silver', 'Holographic Violet', 'Ghost White'],
    inStock: true,
    rating: 4.95,
    reviewsCount: 38,
    badge: 'Limited Drop',
    specs: [
      'Series: Limited to 500 individually numbered pairs',
      'Reflectivity: 360-degree high-intensity 3M reflective finish',
      'Carbon Plate: Full-length propulsion carbon fiber shank'
    ],
    materials: [
      'Upper: Translucent mono-mesh composite structure',
      'Lining: Seamless spandex-sleeve comfort lining',
      'Insole: Premium cork cushioning'
    ]
  },
  {
    id: 'velocity-luna-knit-women',
    name: 'Velocity Luna Knit',
    description: 'Designed around the unique geometry of a woman\'s foot. The Luna Knit offers a contouring sock-like collar, customized midfoot support, and a featherweight stride that feels like a natural extension of your body.',
    price: 135,
    category: 'women',
    images: [
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ['Blush Pink / Rose Gold', 'Orchid Purple', 'Alabaster White'],
    inStock: true,
    rating: 4.7,
    reviewsCount: 112,
    specs: [
      'Gender: Female specific last shape',
      'Heel-to-toe drop: 7mm',
      'Weight: 195g (US women size 7)',
      'Sole: Lightweight responsive cushion'
    ],
    materials: [
      'Upper: Form-fitting FlyWeave yarn knit',
      'Midsole: Bio-based sugarcane SweetFoam',
      'Insole: Odor-resistant merino wool lining'
    ]
  },
  {
    id: 'velocity-eco-breeze',
    name: 'Velocity Eco Breeze',
    description: 'Our most sustainable shoe yet. Crafted with carbon-neutral materials, the Eco Breeze provides breezy ventilation and soft, natural cushioning that treads lightly on the planet.',
    price: 120,
    category: 'casual',
    images: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: ['Eco Sand', 'Sage Green', 'Cloud Grey'],
    inStock: true,
    rating: 4.8,
    reviewsCount: 156,
    badge: 'Best Seller',
    specs: [
      'Carbon footprint: 4.8kg CO2e (industry avg: ~14kg)',
      'Ventilation: High-breathability open knit structure',
      'Machine Washable: Yes, on delicate/cold cycle'
    ],
    materials: [
      'Upper: 100% eucalyptus tree fiber weave',
      'Midsole: SweetFoam sugarcane-based EVA',
      'Laces: Made from 100% recycled plastic bottles'
    ]
  },
  {
    id: 'velocity-phantom-pro',
    name: 'Velocity Phantom Pro',
    description: 'An elite racing shoe built to crush personal records. Featuring a stiff carbon fiber plate and our thickest stack of resilient nitrogen-infused foam, the Phantom Pro propels you forward with every stride.',
    price: 250,
    category: 'running',
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: ['Pitch Black / Carbon', 'Hyper Volt Neon'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 57,
    badge: 'New',
    specs: [
      'Midsole: Nitrogen-injected MaxSpeed foam stack',
      'Plate: Full-length curve-profile carbon fiber plate',
      'Weight: 185g (featherlight weight)',
      'Stack height: 39.5mm heel / 31.5mm forefoot'
    ],
    materials: [
      'Upper: Hyper-breathable engineered monofilament mesh',
      'Laces: Non-slip ribbed racing laces',
      'Outsole: Aerated lightweight traction rubber'
    ]
  },
  {
    id: 'velocity-apex-trainer',
    name: 'Velocity Apex Trainer',
    description: 'A versatile cross-training shoe designed for high-intensity gym workouts, lifting, and short sprints. Features a wide, stable flat base and a protective TPU cage for side-to-side stabilization.',
    price: 130,
    category: 'men',
    images: [
      'https://images.unsplash.com/photo-1506076962349-337ee3387d62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: ['Asphalt Grey / Crimson', 'Total White / Gum'],
    inStock: false,
    rating: 4.4,
    reviewsCount: 83,
    specs: [
      'Drop: 4mm low drop for lifting stability',
      'Base: Wide heel footprint for squatting support',
      'Outsole: Gripper rubber wrap-ups for rope climbs'
    ],
    materials: [
      'Upper: Abrasion-resistant honeycomb weave mesh',
      'Cage: Reinforced TPU wrap-around stability cage',
      'Midsole: Medium-density supportive compound'
    ]
  }
];
