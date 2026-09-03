"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuoteState {
  arrivalDate: string;
  departureDate: string;
  guests: number;
  accommodationId: string | null;
  excursionIds: string[];
  transportIds: string[];
  serviceIds: string[];
  setDates: (arrival: string, departure: string, guests: number) => void;
  setAccommodation: (id: string | null) => void;
  toggleExcursion: (id: string) => void;
  toggleTransport: (id: string) => void;
  toggleService: (id: string) => void;
  reset: () => void;
  itemQuantities: Record<string, number>;
  setItemQuantity: (id: string, qty: number) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      arrivalDate: "",
      departureDate: "",
      guests: 2,
      accommodationId: null,
      excursionIds: [],
      transportIds: [],
      serviceIds: [],
      itemQuantities: {},

      setDates: (arrival, departure, guests) =>
        set({ arrivalDate: arrival, departureDate: departure, guests }),

      setAccommodation: (id) => set({ accommodationId: id }),

      setItemQuantity: (id, qty) =>
        set((state) => ({
          itemQuantities: { ...state.itemQuantities, [id]: Math.max(1, qty) },
        })),

      toggleExcursion: (id) =>
        set((state) => {
          const exists = state.excursionIds.includes(id);
          if (exists) {
            const { [id]: _, ...rest } = state.itemQuantities;
            return {
              excursionIds: state.excursionIds.filter((x) => x !== id),
              itemQuantities: rest,
            };
          }
          return {
            excursionIds: [...state.excursionIds, id],
            itemQuantities: { ...state.itemQuantities, [id]: state.guests }, // Défaut = nombre de voyageurs
          };
        }),

      toggleTransport: (id) =>
        set((state) => {
          const exists = state.transportIds.includes(id);
          if (exists) {
            const { [id]: _, ...rest } = state.itemQuantities;
            return {
              transportIds: state.transportIds.filter((x) => x !== id),
              itemQuantities: rest,
            };
          }
          // Pour les transports, on ne connait pas encore l'unité ici, on met 1 par défaut, le UI gèrera l'override
          return {
            transportIds: [...state.transportIds, id],
            itemQuantities: { ...state.itemQuantities, [id]: 1 },
          };
        }),

      toggleService: (id) =>
        set((state) => {
          const exists = state.serviceIds.includes(id);
          if (exists) {
            const { [id]: _, ...rest } = state.itemQuantities;
            return {
              serviceIds: state.serviceIds.filter((x) => x !== id),
              itemQuantities: rest,
            };
          }
          return {
            serviceIds: [...state.serviceIds, id],
            itemQuantities: { ...state.itemQuantities, [id]: 1 },
          };
        }),

      reset: () =>
        set({
          accommodationId: null,
          excursionIds: [],
          transportIds: [],
          serviceIds: [],
          itemQuantities: {},
        }),
    }),
    { name: "sm-quote" },
  ),
);

export const selectQuoteCount = (s: QuoteState) =>
  (s.accommodationId ? 1 : 0) +
  s.excursionIds.length +
  s.transportIds.length +
  s.serviceIds.length;
