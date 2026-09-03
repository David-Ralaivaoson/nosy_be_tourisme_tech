import {
  PrismaClient,
  AccommodationCategory,
  AccommodationZone,
  ServiceUnit,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed Sainte-Marie...");

  // ============================================================
  // 1. ADMIN USER
  // ============================================================
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@sainte-marie.mg" },
    update: {},
    create: {
      name: "Admin Sainte-Marie",
      email: "admin@sainte-marie.mg",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin créé : admin@sainte-marie.mg / admin123");

  // ============================================================
  // 2. HÉBERGEMENTS (Sainte-Marie)
  // ============================================================

  const lodgesData = [
    {
      slug: "ravinala-beach-lodge",
      name: "Ravinala Beach Lodge",
      category: AccommodationCategory.LUXE,
      zone: AccommodationZone.WEST,
      descriptionFr:
        "Lodge pieds dans l'eau face au coucher de soleil. Piscine à débordement, plage privée, restaurant gastronomique.",
      pricePerNightLowSeason: 480_000,
      pricePerNightHighSeason: 620_000,
      capacity: 4,
      stars: 5,
      rating: 4.8,
      amenities: [
        "Wi-Fi",
        "Piscine",
        "Climatisation",
        "Restaurant",
        "Plage privée",
        "Spa",
      ],
      latitude: -16.88,
      longitude: 49.83,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          altFr: "Vue extérieure",
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          altFr: "Piscine",
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    },
    {
      slug: "bungalows-ampanihy",
      name: "Bungalows Ampanihy",
      category: AccommodationCategory.BUNGALOW,
      zone: AccommodationZone.SOUTH,
      descriptionFr:
        "Bungalows authentiques en bord de Baie d'Ampanihy. Vue imprenable sur les eaux turquoises.",
      pricePerNightLowSeason: 150_000,
      pricePerNightHighSeason: 190_000,
      capacity: 2,
      stars: 3,
      rating: 4.5,
      amenities: ["Wi-Fi", "Ventilateur", "Vue mer", "Restaurant"],
      latitude: -17.03,
      longitude: 49.85,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
          altFr: "Bungalow",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "ecolodge-ile-aux-nattes",
      name: "Écolodge Île aux Nattes",
      category: AccommodationCategory.ECOLODGE,
      zone: AccommodationZone.SOUTH,
      descriptionFr:
        "Écolodge solaire sur l'Île aux Nattes, immersion totale dans la nature.",
      pricePerNightLowSeason: 300_000,
      pricePerNightHighSeason: 380_000,
      capacity: 3,
      stars: 4,
      rating: 4.9,
      amenities: ["Solaire", "Plage privée", "Kayak", "Snorkeling"],
      latitude: -17.07,
      longitude: 49.84,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          altFr: "Écolodge",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "hotel-ambodifotatra",
      name: "Hôtel Ambodifotatra Centre",
      category: AccommodationCategory.HOTEL,
      zone: AccommodationZone.CENTER,
      descriptionFr:
        "Hôtel 3 étoiles au cœur du village principal. Proche du marché et du port.",
      pricePerNightLowSeason: 120_000,
      pricePerNightHighSeason: 160_000,
      capacity: 2,
      stars: 3,
      rating: 4.2,
      amenities: ["Wi-Fi", "Climatisation", "Eau chaude", "Restaurant"],
      latitude: -17.05,
      longitude: 49.84,
      images: [
        {
          url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
          altFr: "Hôtel",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "villa-sainte-marie",
      name: "Villa Sainte-Marie Premium",
      category: AccommodationCategory.VILLA,
      zone: AccommodationZone.WEST,
      descriptionFr:
        "Villa privée 4 chambres avec piscine, jardin tropical et vue mer panoramique.",
      pricePerNightLowSeason: 850_000,
      pricePerNightHighSeason: 1_100_000,
      capacity: 8,
      stars: 5,
      rating: 4.9,
      amenities: [
        "Wi-Fi",
        "Piscine",
        "Climatisation",
        "Cuisine équipée",
        "Personnel",
      ],
      latitude: -16.89,
      longitude: 49.82,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1613490493576-7fde6b967cf6?w=800&q=80",
          altFr: "Villa",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      slug: "guest-house-cocoteraie",
      name: "Guest House La Cocoteraie",
      category: AccommodationCategory.GUEST_HOUSE,
      zone: AccommodationZone.EAST,
      descriptionFr:
        "Chambres d'hôtes familiales dans une cocoteraie centenaires. Petit-déjeuner malgache inclus.",
      pricePerNightLowSeason: 80_000,
      pricePerNightHighSeason: 110_000,
      capacity: 2,
      stars: 2,
      rating: 4.4,
      amenities: ["Wi-Fi", "Petit-déjeuner", "Ventilateur", "Jardin"],
      latitude: -16.92,
      longitude: 49.87,
      images: [
        {
          url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
          altFr: "Guest house",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
  ];

  for (const data of lodgesData) {
    const { images, ...accData } = data;
    const acc = await prisma.accommodation.upsert({
      where: { slug: data.slug },
      update: {},
      create: accData,
    });
    await prisma.accommodationImage.deleteMany({
      where: { accommodationId: acc.id },
    });
    for (const img of images) {
      await prisma.accommodationImage.create({
        data: { accommodationId: acc.id, ...img },
      });
    }
  }
  console.log(`✅ ${lodgesData.length} hébergements avec images`);

  // ============================================================
  // 3. EXCURSIONS
  // ============================================================

  const excursions = await Promise.all([
    prisma.excursion.upsert({
      where: { slug: "safari-baleines" },
      update: {},
      create: {
        slug: "safari-baleines",
        name: "Safari Baleines à Bosse",
        descriptionFr:
          "Observation des baleines à bosse dans leur sanctuaire naturel de juillet à septembre. Sortie en mer de 4 heures avec guide naturaliste, jumelles fournies, déjeuner pique-nique inclus. Approche respectueuse garantie (normes internationales).",
        descriptionEn:
          "Humpback whale watching in their natural sanctuary from July to September. 4-hour boat trip with naturalist guide, binoculars provided, picnic lunch included. Guaranteed respectful approach (international standards).",
        pricePerPerson: 250_000,
        duration: "4 heures",
        includesLunch: true,
        includesTransfer: false,
        latitude: -16.85,
        longitude: 49.9,
        isFeatured: true,
      },
    }),

    prisma.excursion.upsert({
      where: { slug: "baie-ampanihy" },
      update: {},
      create: {
        slug: "baie-ampanihy",
        name: "Excursion Baie d'Ampanihy",
        descriptionFr:
          "Journée complète dans la magnifique Baie d'Ampanihy. Baignade dans les eaux cristallines, snorkeling sur les récifs coralliens, visite du village de pêcheurs, déjeuner de fruits de mer frais sur la plage.",
        descriptionEn:
          "Full day in the magnificent Ampanihy Bay. Swimming in crystal clear waters, snorkeling on coral reefs, visit to the fishing village, fresh seafood lunch on the beach.",
        pricePerPerson: 180_000,
        duration: "Journée complète",
        includesLunch: true,
        includesTransfer: true,
        latitude: -17.02,
        longitude: 49.86,
        isFeatured: true,
      },
    }),

    prisma.excursion.upsert({
      where: { slug: "ile-aux-nattes" },
      update: {},
      create: {
        slug: "ile-aux-nattes",
        name: "Île aux Nattes - Paradis préservé",
        descriptionFr:
          "Escapade sur l'Île aux Nattes, joyau préservé de Sainte-Marie. Traversée en pirogue traditionnelle, plages de sable blanc désertes, baignade dans les piscines naturelles, déjeuner de langoustes grillées. Pas de route, pas de voiture, pur bonheur.",
        descriptionEn:
          "Escape to Île aux Nattes, preserved jewel of Sainte-Marie. Traditional canoe crossing, deserted white sand beaches, swimming in natural pools, grilled lobster lunch. No roads, no cars, pure happiness.",
        pricePerPerson: 220_000,
        duration: "Journée complète",
        includesLunch: true,
        includesTransfer: true,
        latitude: -17.08,
        longitude: 49.83,
        isFeatured: true,
      },
    }),

    prisma.excursion.upsert({
      where: { slug: "piscines-naturelles" },
      update: {},
      create: {
        slug: "piscines-naturelles",
        name: "Piscines Naturelles",
        descriptionFr:
          "Découverte des piscines naturelles formées par les rochers coralliens. Baignade dans des bassins d'eau turquoise protégés des vagues, snorkeling avec poissons tropicaux multicolores. Idéal familles et enfants.",
        descriptionEn:
          "Discovery of natural pools formed by coral rocks. Swimming in turquoise water pools protected from waves, snorkeling with colorful tropical fish. Ideal for families and children.",
        pricePerPerson: 120_000,
        duration: "Demi-journée",
        includesLunch: false,
        includesTransfer: true,
        latitude: -16.9,
        longitude: 49.86,
      },
    }),

    prisma.excursion.upsert({
      where: { slug: "maison-blanche" },
      update: {},
      create: {
        slug: "maison-blanche",
        name: "Maison Blanche & Cimetière Pirates",
        descriptionFr:
          "Visite historique de la Maison Blanche et du cimetière des pirates. Découverte de l'histoire fascinante de Sainte-Marie, repaire de flibustiers au 17ème et 18ème siècles. Guide passionné, anecdotes captivantes.",
        descriptionEn:
          "Historical visit of Maison Blanche and the pirate cemetery. Discovery of Sainte-Marie's fascinating history, a freebooter hideout in the 17th and 18th centuries. Passionate guide, captivating anecdotes.",
        pricePerPerson: 80_000,
        duration: "2 heures",
        includesLunch: false,
        includesTransfer: false,
        latitude: -17.04,
        longitude: 49.84,
      },
    }),

    prisma.excursion.upsert({
      where: { slug: "plongee-sous-marine" },
      update: {},
      create: {
        slug: "plongee-sous-marine",
        name: "Plongée Sous-Marine",
        descriptionFr:
          "Plongée sur les meilleurs sites de Sainte-Marie : récifs coralliens, tombants, épaves. Baptême pour débutants ou plongée confirmée. Matériel fourni, encadrement par moniteurs PADI certifiés. 2 plongées incluses.",
        descriptionEn:
          "Diving on the best sites of Sainte-Marie: coral reefs, drop-offs, wrecks. Baptism for beginners or confirmed diving. Equipment provided, supervision by certified PADI instructors. 2 dives included.",
        pricePerPerson: 350_000,
        duration: "Journée complète",
        includesLunch: true,
        includesTransfer: true,
        latitude: -16.87,
        longitude: 49.88,
      },
    }),
  ]);
  console.log(`✅ ${excursions.length} excursions créées`);

  // ============================================================
  // 4. TRANSPORTS
  // ============================================================

  const transports = await Promise.all([
    prisma.transportOption.upsert({
      where: { slug: "transfert-aeroport" },
      update: {},
      create: {
        slug: "transfert-aeroport",
        name: "Transfert Aéroport ↔ Hôtel",
        transportType: "TRANSFER",
        price: 80_000,
        unit: "TRIP",
        withDriver: true,
        capacity: 4,
        descriptionFr:
          "Transfert privé depuis l'aéroport de Sainte-Marie (SMS) vers votre hôtel. Chauffeur avec panneau à votre nom, véhicule climatisé, eau fraîche offerte. Disponible 24h/24.",
        descriptionEn:
          "Private transfer from Sainte-Marie airport (SMS) to your hotel. Driver with name board, air-conditioned vehicle, complimentary fresh water. Available 24/7.",
      },
    }),

    prisma.transportOption.upsert({
      where: { slug: "transfert-port" },
      update: {},
      create: {
        slug: "transfert-port",
        name: "Transfert Port ↔ Hôtel",
        transportType: "TRANSFER",
        price: 50_000,
        unit: "TRIP",
        withDriver: true,
        capacity: 4,
        descriptionFr:
          "Transfert depuis le port de Sainte-Marie vers votre hôtel. Idéal si vous arrivez par bateau depuis Soanierana-Ivongo ou Tamatave.",
        descriptionEn:
          "Transfer from Sainte-Marie port to your hotel. Ideal if you arrive by boat from Soanierana-Ivongo or Tamatave.",
      },
    }),

    prisma.transportOption.upsert({
      where: { slug: "location-4x4-chauffeur" },
      update: {},
      create: {
        slug: "location-4x4-chauffeur",
        name: "Location 4x4 avec Chauffeur",
        transportType: "VEHICLE_RENTAL",
        price: 350_000,
        unit: "DAY",
        withDriver: true,
        capacity: 5,
        descriptionFr:
          "4x4 Toyota Land Cruiser avec chauffeur-guide local. Idéal pour explorer toute l'île à votre rythme, accès aux pistes difficiles. Carburant inclus, kilométrage illimité.",
        descriptionEn:
          "4x4 Toyota Land Cruiser with local driver-guide. Ideal to explore the whole island at your own pace, access to difficult tracks. Fuel included, unlimited mileage.",
      },
    }),

    prisma.transportOption.upsert({
      where: { slug: "location-quad" },
      update: {},
      create: {
        slug: "location-quad",
        name: "Location Quad",
        transportType: "VEHICLE_RENTAL",
        price: 180_000,
        unit: "DAY",
        withDriver: false,
        capacity: 2,
        descriptionFr:
          "Quad Yamaha 250cc pour explorer les pistes et sentiers de l'île. Casques fournis, assurance incluse. Briefing sécurité obligatoire avant départ. Permis B requis.",
        descriptionEn:
          "Yamaha 250cc quad to explore the island's tracks and trails. Helmets provided, insurance included. Mandatory safety briefing before departure. Driver's license B required.",
      },
    }),

    prisma.transportOption.upsert({
      where: { slug: "location-scooter" },
      update: {},
      create: {
        slug: "location-scooter",
        name: "Location Scooter",
        transportType: "VEHICLE_RENTAL",
        price: 80_000,
        unit: "DAY",
        withDriver: false,
        capacity: 2,
        descriptionFr:
          "Scooter 125cc pour découvrir l'île en toute liberté. Casque fourni, assurance incluse. Parfait pour les trajets courts et les plages proches. Permis A ou B requis.",
        descriptionEn:
          "125cc scooter to discover the island in complete freedom. Helmet provided, insurance included. Perfect for short trips and nearby beaches. License A or B required.",
      },
    }),

    prisma.transportOption.upsert({
      where: { slug: "tuk-tuk" },
      update: {},
      create: {
        slug: "tuk-tuk",
        name: "Tuk-Tuk Privé",
        transportType: "VEHICLE_RENTAL",
        price: 120_000,
        unit: "DAY",
        withDriver: true,
        capacity: 3,
        descriptionFr:
          "Tuk-tuk avec chauffeur pour une journée. Véhicule typique et sympathique, idéal pour les courts trajets et les visites dans les villages. Ambiance locale garantie !",
        descriptionEn:
          "Tuk-tuk with driver for a day. Typical and friendly vehicle, ideal for short trips and village visits. Guaranteed local atmosphere!",
      },
    }),
  ]);
  console.log(`✅ ${transports.length} transports créés`);

  // ============================================================
  // 5. TERRAINS (Immobilier)
  // ============================================================

  const terrains = await Promise.all([
    prisma.terrain.upsert({
      where: { slug: "terrain-vue-mer-1000m2" },
      update: {},
      create: {
        slug: "terrain-vue-mer-1000m2",
        title: "Terrain Titré 1000m² - Vue Mer Panoramique",
        surface: 1000,
        statut: "TITRE_BORNE",
        price: 180_000_000,
        vueMer: true,
        eau: true,
        electricite: true,
        exclusivite: true,
        descriptionFr:
          "Exceptionnel terrain titré et borné de 1000m² avec vue mer panoramique à 180°. Situé sur les hauteurs, accès direct par route goudronnée. Eau et électricité en bordure. Idéal pour projet hôtelier ou villa de prestige.",
        descriptionEn:
          "Exceptional titled and bounded 1000m² land with 180° panoramic sea view. Located on the heights, direct access by paved road. Water and electricity at the edge. Ideal for hotel project or prestige villa.",
        latitude: -16.88,
        longitude: 49.84,
      },
    }),

    prisma.terrain.upsert({
      where: { slug: "terrain-plage-2000m2" },
      update: {},
      create: {
        slug: "terrain-plage-2000m2",
        title: "Terrain Pieds dans l'Eau 2000m²",
        surface: 2000,
        statut: "TITRE_BORNE",
        price: 450_000_000,
        vueMer: true,
        eau: true,
        electricite: true,
        exclusivite: true,
        descriptionFr:
          "Rare terrain pieds dans l'eau de 2000m² avec 40 mètres de plage privée. Emplacement privilégié sur la côte ouest, calme absolu. Toutes les commodités à proximité. Opportunité exceptionnelle pour lodge de luxe.",
        descriptionEn:
          "Rare beachfront land of 2000m² with 40 meters of private beach. Privileged location on the west coast, absolute calm. All amenities nearby. Exceptional opportunity for luxury lodge.",
        latitude: -16.86,
        longitude: 49.83,
      },
    }),

    prisma.terrain.upsert({
      where: { slug: "terrain-centre-500m2" },
      update: {},
      create: {
        slug: "terrain-centre-500m2",
        title: "Terrain Centre Ambodifotatra 500m²",
        surface: 500,
        statut: "BORNE",
        price: 65_000_000,
        vueMer: false,
        eau: true,
        electricite: true,
        exclusivite: false,
        descriptionFr:
          "Terrain borné de 500m² au cœur d'Ambodifotatra, village principal de Sainte-Marie. Proche marché, écoles, centre de santé. Idéal pour commerce, bureaux ou résidence principale.",
        descriptionEn:
          "Bounded land of 500m² in the heart of Ambodifotatra, main village of Sainte-Marie. Close to market, schools, health center. Ideal for business, offices or main residence.",
        latitude: -17.05,
        longitude: 49.84,
      },
    }),

    prisma.terrain.upsert({
      where: { slug: "terrain-nature-3000m2" },
      update: {},
      create: {
        slug: "terrain-nature-3000m2",
        title: "Terrain Nature 3000m² - Cocoteraie",
        surface: 3000,
        statut: "BORNE",
        price: 95_000_000,
        vueMer: true,
        eau: false,
        electricite: false,
        exclusivite: false,
        descriptionFr:
          "Grand terrain borné de 3000m² dans une cocoteraie naturelle. Vue mer lointaine, environnement calme et préservé. Eau et électricité à 200m. Idéal écolodge ou projet agricole.",
        descriptionEn:
          "Large bounded land of 3000m² in a natural coconut grove. Distant sea view, quiet and preserved environment. Water and electricity 200m away. Ideal for ecolodge or agricultural project.",
        latitude: -16.91,
        longitude: 49.86,
      },
    }),
  ]);
  console.log(`✅ ${terrains.length} terrains créés`);

  // ============================================================
  // 6. AVIS CLIENTS
  // ============================================================

  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        name: "Marie Dubois",
        country: "France 🇫🇷",
        rating: 5,
        comment:
          "Un voyage absolument magique ! Le safari baleines était incroyable, nous avons pu observer une mère et son baleineau. L'équipe était attentionnée et professionnelle.",
        tripType: "Safari baleines",
        isVisible: true,
      },
    }),

    prisma.review.create({
      data: {
        name: "Thomas Müller",
        country: "Allemagne 🇩🇪",
        rating: 5,
        comment:
          "L'Île aux Nattes est un véritable paradis sur terre. Plages désertes, eaux cristallines, langoustes grillées... Nous avons vécu un rêve éveillé.",
        tripType: "Île aux Nattes",
        isVisible: true,
      },
    }),

    prisma.review.create({
      data: {
        name: "Sophie Laurent",
        country: "Belgique 🇧🇪",
        rating: 5,
        comment:
          "Organisation parfaite du début à la fin. Les transferts étaient ponctuels, l'hôtel magnifique et les excursions bien organisées. Je recommande vivement !",
        tripType: "Séjour complet",
        isVisible: true,
      },
    }),

    prisma.review.create({
      data: {
        name: "Giovanni Rossi",
        country: "Italie 🇮🇹",
        rating: 4,
        comment:
          "Sainte-Marie est une île magnifique et authentique. La Baie d'Ampanihy est à couper le souffle. Seul bémol : les routes sont parfois difficiles d'accès.",
        tripType: "Excursions",
        isVisible: true,
      },
    }),
  ]);
  console.log(`✅ ${reviews.length} avis clients créés`);

  // SERVICES ADDITIONNELS
  const servicesData: {
    slug: string;
    name: string;
    description: string;
    price: number;
    unit: ServiceUnit;
    icon: string;
    isFeatured?: boolean;
  }[] = [
    {
      slug: "assurance-voyage",
      name: "Assurance voyage complète",
      description:
        "Couverture médicale, annulation, bagages et rapatriement. Partenaire Europ Assistance.",
      price: 45_000,
      unit: "PERSON",
      icon: "Shield",
      isFeatured: true,
    },
    {
      slug: "guide-prive",
      name: "Guide privé francophone",
      description:
        "Guide expert local pour vos excursions. Connaissance approfondie de l'histoire et de la culture.",
      price: 120_000,
      unit: "DAY",
      icon: "UserCheck",
      isFeatured: true,
    },
    {
      slug: "photographe",
      name: "Photographe professionnel",
      description:
        "Shooting photo de votre voyage. 200 photos retouchées livrées en haute définition.",
      price: 350_000,
      unit: "DAY",
      icon: "Camera",
    },
    {
      slug: "transfert-vip",
      name: "Transfert VIP hélicoptère",
      description:
        "Transfert aéroport-hôtel en hélicoptère privé. Vue aérienne exceptionnelle de l'île.",
      price: 1_200_000,
      unit: "FLAT",
      icon: "Plane",
      isFeatured: true,
    },
    {
      slug: "location-gopro",
      name: "Location GoPro + accessoires",
      description:
        "GoPro Hero 12 avec perche, harnais et caisson étanche. Parfait pour snorkeling et plongée.",
      price: 35_000,
      unit: "DAY",
      icon: "Video",
    },
    {
      slug: "masque-palmes",
      name: "Kit snorkeling premium",
      description:
        "Masque et palmes de qualité professionnelle. Tailles adulte et enfant disponibles.",
      price: 15_000,
      unit: "DAY",
      icon: "Waves",
    },
    {
      slug: "cours-cuisine",
      name: "Cours de cuisine malgache",
      description:
        "Apprenez à préparer romazava, ravitoto et autres spécialités avec un chef local.",
      price: 85_000,
      unit: "PERSON",
      icon: "Utensils",
    },
    {
      slug: "massage-spa",
      name: "Massage & spa à domicile",
      description:
        "Massage traditionnel malgache dans votre hébergement. Huiles essentielles locales.",
      price: 75_000,
      unit: "PERSON",
      icon: "Sparkles",
    },
  ];

  for (const data of servicesData) {
    await prisma.additionalService.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }
  console.log(`✅ ${servicesData.length} services additionnels`);

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("📋 Identifiants admin : admin@sainte-marie.mg / admin123");
}

export { main as seedDatabase };

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((e) => {
      console.error("❌ Erreur lors du seed :", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
