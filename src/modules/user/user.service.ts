// src/modules/user/user.service.ts
import { query } from "../../db";
import { AppError } from "../../middlewares/error.middleware";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

// Update a user
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const { first_name, last_name } = data;

  if (!first_name || !last_name) {
    throw new AppError("Missing required fields", 400);
  }

  const result = await query(
    `UPDATE users
     SET first_name = $1,
         last_name = $2
     WHERE id = $3
     RETURNING id, first_name, last_name, email`,
    [first_name, last_name, id]
  );

  if (result.rows.length === 0) throw new AppError("User not found", 404);

  return result.rows[0] as User;
};

// Get rides for a user
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
  created_at: string;
  driver: object;
}

export const getUserRides = async (userId: string): Promise<Ride[]> => {
  if (!userId) throw new AppError("Missing required fields", 400);

  const result = await query(
    `SELECT
      rides.ride_id,
      rides.user_id,
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
    WHERE rides.user_id = $1
    ORDER BY rides.created_at DESC`,
    [userId]
  );

  return result.rows as Ride[];
};
