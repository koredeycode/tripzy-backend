// src/modules/ride/ride.service.ts
import { query } from "../../db";
import { AppError } from "../../middlewares/error.middleware";

export interface Ride {
  ride_id: string;
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  payment_status: string;
  driver_id: string;
  user_id: string;
  created_at: string;
  driver?: object;
}

// Create a new ride
export const createRide = async (data: Partial<Ride>): Promise<Ride> => {
  const {
    origin_address,
    destination_address,
    origin_latitude,
    origin_longitude,
    destination_latitude,
    destination_longitude,
    ride_time,
    fare_price,
    payment_status,
    driver_id,
    user_id,
  } = data;

  if (
    !origin_address ||
    !destination_address ||
    origin_latitude === undefined ||
    origin_longitude === undefined ||
    destination_latitude === undefined ||
    destination_longitude === undefined ||
    !ride_time ||
    fare_price === undefined ||
    !payment_status ||
    !driver_id ||
    !user_id
  ) {
    throw new AppError("Missing required fields", 400);
  }

  try {
    const result = await query(
      `INSERT INTO rides (
        origin_address,
        destination_address,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        ride_time,
        fare_price,
        payment_status,
        driver_id,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        origin_address,
        destination_address,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        ride_time,
        fare_price,
        payment_status,
        driver_id,
        user_id,
      ]
    );

    return result.rows[0] as Ride;
  } catch (err) {
    throw new AppError("Failed to create ride", 500);
  }
};

// Get a ride by ID (with driver info)
export const getRide = async (id: string): Promise<Ride> => {
  if (!id) throw new AppError("Missing ride ID", 400);

  try {
    const result = await query(
      `SELECT
        rides.ride_id,
        rides.origin_address,
        rides.destination_address,
        rides.origin_latitude,
        rides.origin_longitude,
        rides.destination_latitude,
        rides.destination_longitude,
        rides.ride_time,
        rides.fare_price,
        rides.payment_status,
        rides.created_at,
        json_build_object(
          'driver_id', drivers.id,
          'first_name', drivers.first_name,
          'last_name', drivers.last_name,
          'profile_image_url', drivers.profile_image_url,
          'car_image_url', drivers.car_image_url,
          'car_seats', drivers.car_seats,
          'rating', drivers.rating
        ) AS driver
      FROM rides
      INNER JOIN drivers ON rides.driver_id = drivers.id
      WHERE rides.ride_id = $1
      LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) throw new AppError("Ride not found", 404);

    return result.rows[0] as Ride;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Failed to fetch ride", 500);
  }
};
