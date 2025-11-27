// src/tests/mocks/db.ts
export const query = jest.fn();
export const pool = {
  query,
  connect: jest.fn(),
  end: jest.fn(),
};
