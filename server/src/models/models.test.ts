/**
 * @module models/models.test
 * @description Unit tests for Mongoose model toJSON transform functions.
 * Tests actual Mongoose Document instances to execute the schema options.
 */

import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { Emission } from './Emission.model';
import { User } from './User.model';

describe('Emission model toJSON transform', () => {
  it('maps _id to id and stringifies ObjectIds', () => {
    const doc = new Emission({
      _id: new mongoose.Types.ObjectId('64a1b2c3d4e5f6a7b8c9d0e1'),
      userId: new mongoose.Types.ObjectId('64a1b2c3d4e5f6a7b8c9d0e2'),
      category: 'travel',
      subcategory: 'car (petrol)',
      inputValue: 10,
      inputUnit: 'km',
      co2eKg: 12.5,
    });

    const json = doc.toJSON();

    expect(json.id).toBe('64a1b2c3d4e5f6a7b8c9d0e1');
    expect(json.userId).toBe('64a1b2c3d4e5f6a7b8c9d0e2');
    expect(json).not.toHaveProperty('_id');
    expect(json).not.toHaveProperty('__v');
    expect(json.category).toBe('travel');
    expect(json.co2eKg).toBe(12.5);
  });
});

describe('User model toJSON transform', () => {
  it('maps _id to id and removes passwordHash', () => {
    const doc = new User({
      _id: new mongoose.Types.ObjectId('64a1b2c3d4e5f6a7b8c9d0e1'),
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: '$2b$10$somehash',
    });

    const json = doc.toJSON();

    expect(json.id).toBe('64a1b2c3d4e5f6a7b8c9d0e1');
    expect(json).not.toHaveProperty('_id');
    expect(json).not.toHaveProperty('__v');
    expect(json).not.toHaveProperty('passwordHash');
    expect(json.name).toBe('Alice');
    expect(json.email).toBe('alice@example.com');
  });
});
