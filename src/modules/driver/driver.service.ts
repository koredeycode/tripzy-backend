// src/modules/driver/driver.service.ts
import { neon } from "@neondatabase/serverless";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error.middleware";

const sql = neon(env.DATABASE_URL!);

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  car_image_url?: string;
  car_seats?: number;
  rating?: number;
}

// Get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    const drivers = await sql`
      SELECT
        id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        rating
      FROM drivers;
    `;
    return drivers as Driver[];
  } catch (err) {
    throw new AppError("Failed to fetch drivers", 500);
  }
};
