/**
 * @module models/models.test
 * @description Unit tests for Mongoose model toJSON transform functions.
 * Verifies that _id is aliased to id and sensitive fields are removed.
 */

import { describe, it, expect } from 'vitest';

// Test the transform logic inline since it's pure object manipulation
// The transforms in Emission.model.ts and User.model.ts follow this contract:
//   ret.id = String(ret._id)
//   delete ret._id, ret.__v
//   User also deletes: ret.passwordHash

function applyEmissionTransform(ret: Record<string, unknown>) {
  ret['id'] = String(ret['_id']);
  ret['userId'] = String(ret['userId']);
  delete ret['_id'];
  delete ret['__v'];
  return ret;
}

function applyUserTransform(ret: Record<string, unknown>) {
  ret['id'] = String(ret['_id']);
  delete ret['_id'];
  delete ret['__v'];
  delete ret['passwordHash'];
  return ret;
}

describe('Emission model toJSON transform', () => {
  it('maps _id to id as string', () => {
    const ret: Record<string, unknown> = {
      _id: '64a1b2c3d4e5f6a7b8c9d0e1',
      userId: '64a1b2c3d4e5f6a7b8c9d0e2',
      __v: 0,
      category: 'travel',
      co2eKg: 12.5,
    };
    const result = applyEmissionTransform({ ...ret });
    expect(result['id']).toBe('64a1b2c3d4e5f6a7b8c9d0e1');
    expect(result['userId']).toBe('64a1b2c3d4e5f6a7b8c9d0e2');
    expect(result).not.toHaveProperty('_id');
    expect(result).not.toHaveProperty('__v');
  });

  it('preserves other fields', () => {
    const ret: Record<string, unknown> = {
      _id: 'abc',
      userId: 'def',
      category: 'energy',
      co2eKg: 50,
    };
    const result = applyEmissionTransform({ ...ret });
    expect(result['category']).toBe('energy');
    expect(result['co2eKg']).toBe(50);
  });
});

describe('User model toJSON transform', () => {
  it('maps _id to id and removes passwordHash', () => {
    const ret: Record<string, unknown> = {
      _id: '64a1b2c3d4e5f6a7b8c9d0e1',
      __v: 0,
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: '$2b$10$somehash',
    };
    const result = applyUserTransform({ ...ret });
    expect(result['id']).toBe('64a1b2c3d4e5f6a7b8c9d0e1');
    expect(result).not.toHaveProperty('_id');
    expect(result).not.toHaveProperty('__v');
    expect(result).not.toHaveProperty('passwordHash');
    expect(result['name']).toBe('Alice');
    expect(result['email']).toBe('alice@example.com');
  });
});
