import argon2 from 'argon2';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import { env } from '../src/config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Read schema file
    const schemaPath = path.join(__dirname, '../src/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Drop existing tables
    await pool.query(`
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS conversations CASCADE;
      DROP TABLE IF EXISTS rides CASCADE;
      DROP TABLE IF EXISTS drivers CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ Tables dropped');

    // Run schema
    await pool.query(schemaSql);
    console.log('✅ Schema applied');

    // Seed Users and Drivers
    const passwordHash = await argon2.hash('password123');

    const driversData = [
      {
        first_name: 'James',
        last_name: 'Wilson',
        email: 'james.wilson@example.com',
        profile_image_url: 'https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/',
        car_image_url: 'https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/',
        car_seats: 4,
        rating: 4.80
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        email: 'david.brown@example.com',
        profile_image_url: 'https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/',
        car_image_url: 'https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/',
        car_seats: 5,
        rating: 4.60
      },
      {
        first_name: 'Michael',
        last_name: 'Johnson',
        email: 'michael.johnson@example.com',
        profile_image_url: 'https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/',
        car_image_url: 'https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/',
        car_seats: 4,
        rating: 4.70
      },
      {
        first_name: 'Robert',
        last_name: 'Green',
        email: 'robert.green@example.com',
        profile_image_url: 'https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/',
        car_image_url: 'https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/',
        car_seats: 4,
        rating: 4.90
      }
    ];

    for (const data of driversData) {
      // Create User
      const userRes = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, profile_image_url) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [data.first_name, data.last_name, data.email, passwordHash, data.profile_image_url]
      );
      const userId = userRes.rows[0].id;

      // Create Driver
      await pool.query(
        `INSERT INTO drivers (user_id, car_image_url, car_seats, rating) 
         VALUES ($1, $2, $3, $4)`,
        [userId, data.car_image_url, data.car_seats, data.rating]
      );
    }
    console.log('✅ Drivers seeded');

    // Create a regular user
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash) 
       VALUES ($1, $2, $3, $4)`,
      ['Regular', 'User', 'user@example.com', passwordHash]
    );
    console.log('✅ Regular user seeded');

    console.log('🚀 Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seed();
