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

export const getDriver = async (id: string): Promise<Driver> => {
  if (!id) throw new AppError("Missing driver ID", 400);

  try {
    const response = await sql`
      SELECT
        id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        rating
      FROM drivers
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (response.length === 0) throw new AppError("Ride not found", 404);

    return response[0] as Driver;
  } catch (err) {
    throw new AppError("Failed to fetch driver", 500);
  }
};
