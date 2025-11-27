// src/modules/user/user.service.ts
import { neon } from "@neondatabase/serverless";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error.middleware";

const sql = neon(env.DATABASE_URL!);

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  clerk_id: string;
}

// Create a new user
export const createUser = async (data: Partial<User>): Promise<User> => {
  const { first_name, last_name, email, clerk_id } = data;

  if (!first_name || !last_name || !email || !clerk_id) {
    throw new AppError("Missing required fields", 400);
  }

  const result = await sql`
    INSERT INTO users (first_name, last_name, email, clerk_id)
    VALUES (${first_name}, ${last_name}, ${email}, ${clerk_id})
    RETURNING *;
  `;

  return result[0] as User;
};

//Get a user by clerk_id
export const getUserByClerkId = async (
  clerk_id: string
): Promise<User | null> => {
  const result = await sql`
    SELECT * FROM users WHERE clerk_id = ${clerk_id};
  `;

  if (result.length === 0) return null;
  return result[0] as User;
};

// Update a user
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const { first_name, last_name } = data;

  if (!first_name || !last_name) {
    throw new AppError("Missing required fields", 400);
  }

  const result = await sql`
    UPDATE users
    SET first_name = ${first_name},
        last_name = ${last_name}
    WHERE clerk_id = ${id}
    RETURNING *;
  `;

  if (result.length === 0) throw new AppError("User not found", 404);

  return result[0] as User;
};

// Get rides for a user
export interface Ride {
  ride_id: number;
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: string;
  fare_price: number;
  payment_status: string;
  created_at: string;
  driver: object;
}

export const getUserRides = async (userId: string): Promise<Ride[]> => {
  if (!userId) throw new AppError("Missing required fields", 400);

  const rides = await sql`
    SELECT
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
    WHERE rides.user_id = ${userId}
    ORDER BY rides.created_at DESC;
  `;

  return rides as Ride[];
};
