/**
 * This file previously contained logic for "Space Booking" (e.g. meeting rooms),
 * which is incompatible with the SmartWaste schema (Waste Collection Points).
 * The logic relied on non-existent models (Visit) and fields (seats, isFullSpaceBooking).
 * 
 * We are stubbing these functions to prevent build errors in legacy routes.
 * These routes should likely be removed or refactored to relevant Waste Booking features if needed.
 */

export async function isDateAvailable(spaceId: number, date: Date): Promise<{ available: boolean, remainingSeats: number }> {
    // Logic disabled as 'Visit' model and 'seats' field do not exist.
    return { available: true, remainingSeats: 100 };
}


export async function getMonthlyAvailability(spaceId: number, year: number, month: number) {
    // Logic disabled. Returns all days as available.
    // If you need actual "Waste Drop-off Booking", this needs to be re-implemented 
    // against a valid Booking model in schema.prisma.
    return [];
}