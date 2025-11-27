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
        drivers.id,
        drivers.user_id,
        drivers.car_image_url,
        drivers.car_seats,
        drivers.rating,
        users.first_name,
        users.last_name,
        users.profile_image_url
      FROM drivers
      JOIN users ON drivers.user_id = users.id`
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
        drivers.id,
        drivers.user_id,
        drivers.car_image_url,
        drivers.car_seats,
        drivers.rating,
        users.first_name,
        users.last_name,
        users.profile_image_url
      FROM drivers
      JOIN users ON drivers.user_id = users.id
      WHERE drivers.id = $1`,
      [id]
    );
    if (result.rows.length === 0) throw new AppError("Driver not found", 404);

    return result.rows[0] as Driver;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Failed to fetch driver", 500);
  }
};
