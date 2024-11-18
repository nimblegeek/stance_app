import type { User, Class, Booking } from "db/schema";

export type ClassWithBookings = Class & {
  bookings: (Booking & { user: User })[];
};

export type BookingWithClass = Booking & {
  class: Class;
};
