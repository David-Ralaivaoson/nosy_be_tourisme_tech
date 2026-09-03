import {
  Accommodation,
  Excursion,
  TransportOption,
  SeasonRate,
  AdditionalService,
} from "@prisma/client";
import { differenceInDays, isWithinInterval, parseISO } from "date-fns";

/**
 * Formate un montant en Ariary malgache
 */
export function formatMGA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " Ar";
}

/**
 * Calcule le nombre de nuits entre deux dates
 */
export function calculateNights(
  arrivalDate: string,
  departureDate: string,
): number {
  if (!arrivalDate || !departureDate) return 0;
  const arrival = parseISO(arrivalDate);
  const departure = parseISO(departureDate);
  const nights = differenceInDays(departure, arrival);
  return Math.max(0, nights);
}

/**
 * Détermine si une date est en haute saison selon les SeasonRate
 */
export function getSeasonRate(
  accommodation: Accommodation & { seasonRates: SeasonRate[] },
  date: string,
): { rate: number; label: string } | null {
  const parsedDate = parseISO(date);

  for (const season of accommodation.seasonRates) {
    if (
      isWithinInterval(parsedDate, {
        start: season.startDate,
        end: season.endDate,
      })
    ) {
      return {
        rate: season.pricePerNight,
        label: season.label || "Saison",
      };
    }
  }

  return null;
}

/**
 * Calcule le prix total d'un hébergement pour une période donnée
 */
export function calculateAccommodationTotal(
  accommodation: Accommodation & { seasonRates?: SeasonRate[] },
  arrivalDate: string,
  departureDate: string,
): { total: number; nights: number; averageRate: number } {
  const nights = calculateNights(arrivalDate, departureDate);

  if (nights === 0) {
    return { total: 0, nights: 0, averageRate: 0 };
  }

  // Si on a des SeasonRate, on calcule nuit par nuit
  if (accommodation.seasonRates && accommodation.seasonRates.length > 0) {
    let total = 0;
    const arrival = parseISO(arrivalDate);

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(arrival);
      currentDate.setDate(arrival.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];

      const seasonRate = getSeasonRate(
        accommodation as Accommodation & { seasonRates: SeasonRate[] },
        dateStr,
      );

      if (seasonRate) {
        total += seasonRate.rate;
      } else {
        // Fallback sur le prix basse saison si pas de saison définie
        total += accommodation.pricePerNightLowSeason;
      }
    }

    return {
      total,
      nights,
      averageRate: Math.round(total / nights),
    };
  }

  // Fallback simple : on utilise le prix selon la date d'arrivée
  const arrivalMonth = parseISO(arrivalDate).getMonth(); // 0-11

  // Haute saison : juillet (6), août (7), septembre (8), décembre (11)
  const isHighSeason =
    arrivalMonth === 6 ||
    arrivalMonth === 7 ||
    arrivalMonth === 8 ||
    arrivalMonth === 11;

  const ratePerNight = isHighSeason
    ? accommodation.pricePerNightHighSeason
    : accommodation.pricePerNightLowSeason;

  const total = nights * ratePerNight;

  return {
    total,
    nights,
    averageRate: ratePerNight,
  };
}

/**
 * Calcule le prix total des excursions
 */
export function calculateExcursionsTotal(
  excursions: Excursion[],
  guests: number,
): number {
  return excursions.reduce((sum, excursion) => {
    return sum + excursion.pricePerPerson * guests;
  }, 0);
}

/**
 * Calcule le prix total des transports
 */
export function calculateTransportsTotal(
  transports: TransportOption[],
  arrivalDate: string,
  departureDate: string,
): number {
  const nights = calculateNights(arrivalDate, departureDate);

  return transports.reduce((sum, transport) => {
    if (transport.unit === "DAY") {
      // Location à la journée : multiplier par le nombre de nuits (minimum 1 jour)
      return sum + transport.price * Math.max(1, nights);
    } else {
      // Transfert : prix fixe par trajet
      return sum + transport.price;
    }
  }, 0);
}

/**
 * Calcule le total général d'un devis
 */
export function calculateQuoteTotal(params: {
  accommodation?: (Accommodation & { seasonRates?: SeasonRate[] }) | null;
  excursions: Excursion[];
  transports: TransportOption[];
  arrivalDate: string;
  departureDate: string;
  guests: number;
}): number {
  const {
    accommodation,
    excursions,
    transports,
    arrivalDate,
    departureDate,
    guests,
  } = params;

  let total = 0;

  // Hébergement
  if (accommodation) {
    const { total: accommodationTotal } = calculateAccommodationTotal(
      accommodation,
      arrivalDate,
      departureDate,
    );
    total += accommodationTotal;
  }

  // Excursions
  total += calculateExcursionsTotal(excursions, guests);

  // Transports
  total += calculateTransportsTotal(transports, arrivalDate, departureDate);

  return Math.round(total);
}

/**
 * Vérifie si les dates sont valides (départ après arrivée, pas dans le passé)
 */
export function validateDates(
  arrivalDate: string,
  departureDate: string,
): {
  valid: boolean;
  error?: string;
} {
  if (!arrivalDate || !departureDate) {
    return { valid: false, error: "Dates requises" };
  }

  const arrival = parseISO(arrivalDate);
  const departure = parseISO(departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (arrival < today) {
    return {
      valid: false,
      error: "La date d'arrivée ne peut pas être dans le passé",
    };
  }

  if (departure <= arrival) {
    return {
      valid: false,
      error: "La date de départ doit être après la date d'arrivée",
    };
  }

  const nights = differenceInDays(departure, arrival);
  if (nights > 90) {
    return { valid: false, error: "Durée maximale : 90 nuits" };
  }

  return { valid: true };
}

export function calculateServicesTotal(
  services: AdditionalService[],
  guests: number,
  arrivalDate: string,
  departureDate: string,
): number {
  const nights = calculateNights(arrivalDate, departureDate);
  return services.reduce((sum, s) => {
    const qty =
      s.unit === "PERSON"
        ? guests
        : s.unit === "DAY" && nights > 0
          ? nights
          : 1;
    return sum + s.price * qty;
  }, 0);
}
