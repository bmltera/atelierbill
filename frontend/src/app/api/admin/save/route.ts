import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In development/local mode, we can write to the filesystem
    // In production (static export), this endpoint won't exist or won't work, which matches Option A's local-only admin approach.
    const overridesPath = path.join(process.cwd(), "src", "availability", "overrides.ts");
    
    const fileContent = `import { AvailabilityOverride, AvailabilityRange, AvailabilityBooking, DefaultSchedule } from "./types";

export const defaultSchedule: DefaultSchedule = ${JSON.stringify(data.defaultSchedule, null, 2)};

// Manual Date Overrides (e.g., force a Wednesday to be available)
export const overrides: AvailabilityOverride[] = ${JSON.stringify(data.overrides || [], null, 2)};

// Blocked Ranges (e.g., vacations)
export const ranges: AvailabilityRange[] = ${JSON.stringify(data.ranges || [], null, 2)};

// Current Bookings (decrements remaining slots)
export const bookings: AvailabilityBooking[] = ${JSON.stringify(data.bookings || [], null, 2)};
`;

    fs.writeFileSync(overridesPath, fileContent, "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save overrides:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
