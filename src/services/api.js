import { VEHICLES, AGENCIES } from '../data/vehicles';
import { INITIAL_RESERVATIONS, PAST_RENTALS, HISTORY_STATS } from '../data/reservations';

let reservationsDatabase = [...INITIAL_RESERVATIONS];

const simulateNetworkDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApiService = {
  async getVehicles(category = 'Todos') {
    await simulateNetworkDelay(300);
    if (!category || category === 'Todos') {
      return [...VEHICLES];
    }
    return VEHICLES.filter((v) => v.category.toLowerCase() === category.toLowerCase());
  },

  async getVehicleById(id) {
    await simulateNetworkDelay(200);
    const vehicle = VEHICLES.find((v) => v.id === id);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }
    return vehicle;
  },

  async getReservations() {
    await simulateNetworkDelay(300);
    return [...reservationsDatabase];
  },

  async createReservation(bookingData) {
    await simulateNetworkDelay(600);

    const randomCode = 'AF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newReservation = {
      id: 'res-' + (reservationsDatabase.length + 1),
      code: randomCode,
      carName: bookingData.carName,
      category: bookingData.category,
      emoji: bookingData.emoji,
      image: bookingData.image,
      agency: bookingData.agency || 'Aeroporto de Maceió',
      pickupDate: bookingData.pickupDate || '20/10/2026 às 10:00',
      returnDate: bookingData.returnDate || '24/10/2026 às 10:00',
      days: bookingData.days || 4,
      dailyRate: bookingData.dailyRate,
      fees: 42,
      total: (bookingData.dailyRate * (bookingData.days || 4)) + 42,
      status: 'Confirmada',
      inspected: false,
      inspectionPhoto: null,
      createdAt: new Date().toISOString(),
    };

    reservationsDatabase = [newReservation, ...reservationsDatabase];
    return newReservation;
  },

  async cancelReservation(reservationId) {
    await simulateNetworkDelay(300);
    reservationsDatabase = reservationsDatabase.filter((r) => r.id !== reservationId);
    return { success: true };
  },

  async saveInspection(reservationId, photoUri) {
    await simulateNetworkDelay(300);
    reservationsDatabase = reservationsDatabase.map((r) => {
      if (r.id === reservationId) {
        return { ...r, inspected: true, inspectionPhoto: photoUri };
      }
      return r;
    });
    return { success: true };
  },

  async getHistory() {
    await simulateNetworkDelay(300);
    return {
      stats: HISTORY_STATS,
      pastRentals: [...PAST_RENTALS],
    };
  },

  async getAgencies() {
    await simulateNetworkDelay(200);
    return [...AGENCIES];
  },
};
