import { AvailabilityOverride, AvailabilityRange, AvailabilityBooking, DefaultSchedule } from "./types";

export const defaultSchedule: DefaultSchedule = {
  "monday": {
    "enabled": false,
    "capacity": 0
  },
  "tuesday": {
    "enabled": false,
    "capacity": 0
  },
  "wednesday": {
    "enabled": false,
    "capacity": 0
  },
  "thursday": {
    "enabled": false,
    "capacity": 0
  },
  "friday": {
    "enabled": false,
    "capacity": 0
  },
  "saturday": {
    "enabled": true,
    "capacity": 1
  },
  "sunday": {
    "enabled": true,
    "capacity": 2
  }
};

// Manual Date Overrides (e.g., force a Wednesday to be available)
export const overrides: AvailabilityOverride[] = [];

// Blocked Ranges (e.g., vacations)
export const ranges: AvailabilityRange[] = [
  {
    "start": "2026-09-06",
    "end": "2026-09-06",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-09-12",
    "end": "2026-09-12",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-09-13",
    "end": "2026-09-13",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-10-04",
    "end": "2026-10-04",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-10-07",
    "end": "2026-10-12",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2026-10-30",
    "end": "2026-10-30",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2026-10-30",
    "end": "2026-10-30",
    "status": "unavailable",
    "publicLabel": "Unavailable"
  },
  {
    "start": "2026-09-05",
    "end": "2026-09-05",
    "status": "booked",
    "publicLabel": "Booked"
  },
  {
    "start": "2026-09-03",
    "end": "2026-09-03",
    "status": "booked",
    "publicLabel": "Booked"
  },
  {
    "start": "2026-09-26",
    "end": "2026-09-26",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2026-09-27",
    "end": "2026-09-27",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2026-11-24",
    "end": "2026-11-24",
    "status": "unavailable",
    "publicLabel": "Unavailable"
  },
  {
    "start": "2026-11-26",
    "end": "2026-11-26",
    "status": "unavailable",
    "publicLabel": "Unavailable"
  },
  {
    "start": "2026-11-28",
    "end": "2026-11-28",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-11-29",
    "end": "2026-11-29",
    "status": "limited",
    "publicLabel": "Limited"
  },
  {
    "start": "2026-12-24",
    "end": "2026-12-31",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2027-01-01",
    "end": "2027-01-03",
    "status": "unavailable",
    "publicLabel": "Travel"
  },
  {
    "start": "2026-09-20",
    "end": "2026-09-20",
    "status": "booked",
    "publicLabel": "Booked"
  },
  {
    "start": "2026-10-31",
    "end": "2026-10-31",
    "status": "unavailable",
    "publicLabel": "Unavailable"
  },
  {
    "start": "2026-11-01",
    "end": "2026-11-01",
    "status": "unavailable",
    "publicLabel": "Unavailable"
  }
];

// Current Bookings (decrements remaining slots)
export const bookings: AvailabilityBooking[] = [];
