// src/modules/driver/driver.service.ts
import { query } from "../../db";
import { AppError } from "../../middlewares/error.middleware";

export interface Driver {
  id: string;
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
    const result = await query(
      `SELECT
        id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        rating
      FROM drivers`
    );
    return result.rows as Driver[];
  } catch (err) {
    throw new AppError("Failed to fetch drivers", 500);
  }
};

export const getDriver = async (id: string): Promise<Driver> => {
  if (!id) throw new AppError("Missing driver ID", 400);

  try {
    const result = await query(
      `SELECT
        id,
        first_name,
        last_name,
        profile_image_url,
        car_image_url,
        car_seats,
        rating
      FROM drivers
      WHERE id = $1
      LIMIT 1`,
      [id]
    );
    if (result.rows.length === 0) throw new AppError("Driver not found", 404);

    return result.rows[0] as Driver;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Failed to fetch driver", 500);
  }
};
