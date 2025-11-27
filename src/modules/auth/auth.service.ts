import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { query } from '../../db';
import { AppError } from '../../middlewares/error.middleware';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash?: string;
  is_driver?: boolean;
}

export const signup = async (data: Partial<User>) => {
  const { first_name, last_name, email, password_hash } = data;

  if (!first_name || !last_name || !email || !password_hash) {
    throw new AppError('Missing required fields', 400);
  }

  // Check if user exists
  const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (userCheck.rows.length > 0) {
    throw new AppError('User already exists', 400);
  }

  // Hash password
  const hashed = await argon2.hash(password_hash);

  // Create user
  const newUser = await query(
    'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
    [first_name, last_name, email, hashed]
  );

  const user = newUser.rows[0];

  // Generate token
  const token = jwt.sign({ userId: user.id, role: 'user' }, env.JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
};

export const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  // Find user
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new AppError('Invalid credentials', 400);
  }

  const user = result.rows[0];

  // Verify password
  const validPassword = await argon2.verify(user.password_hash, password);
  if (!validPassword) {
    throw new AppError('Invalid credentials', 400);
  }

  // Check if user is a driver
  const driverCheck = await query('SELECT id FROM drivers WHERE user_id = $1', [user.id]);
  const isDriver = driverCheck.rows.length > 0;

  // Generate token
  const token = jwt.sign(
    { userId: user.id, role: isDriver ? 'driver' : 'user', isDriver }, 
    env.JWT_SECRET, 
    { expiresIn: '7d' }
  );

  // Remove password hash
  delete user.password_hash;
  
  // Add is_driver to user object
  user.is_driver = isDriver;

  return { user, token };
};

export const getProfile = async (userId: string) => {
  const result = await query('SELECT id, first_name, last_name, email FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  const user = result.rows[0];

  // Check if user is a driver
  const driverCheck = await query('SELECT * FROM drivers WHERE user_id = $1', [userId]);
  
  if (driverCheck.rows.length > 0) {
    user.driver_profile = driverCheck.rows[0];
    user.is_driver = true;
  } else {
    user.is_driver = false;
  }

  return user;
};
