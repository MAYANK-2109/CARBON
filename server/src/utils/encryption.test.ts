/**
 * @module utils/encryption.test
 * @description Unit tests for AES-256-GCM encryption/decryption utility.
 * Verifies encrypt-decrypt roundtrip, format, and tamper detection.
 */

import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './encryption';

describe('encryption', () => {
  it('encrypts and decrypts a string correctly (roundtrip)', () => {
    const plaintext = 'john.doe@example.com';
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plaintext);
  });

  it('produces different ciphertexts for the same plaintext (random IV)', () => {
    const plaintext = 'test@example.com';
    const encrypted1 = encrypt(plaintext);
    const encrypted2 = encrypt(plaintext);

    // Due to random IV, same plaintext should produce different ciphertexts
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('outputs ciphertext in iv:authTag:ciphertext format', () => {
    const encrypted = encrypt('hello world');
    const parts = encrypted.split(':');

    expect(parts).toHaveLength(3);
    // IV = 16 bytes = 32 hex chars
    expect(parts[0]).toHaveLength(32);
    // Auth tag = 16 bytes = 32 hex chars
    expect(parts[1]).toHaveLength(32);
    // Ciphertext should be non-empty hex
    expect(parts[2]!.length).toBeGreaterThan(0);
    // All parts should be valid hex
    parts.forEach((part) => {
      expect(part).toMatch(/^[0-9a-f]+$/i);
    });
  });

  it('handles empty string', () => {
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe('');
  });

  it('handles unicode characters', () => {
    const plaintext = '🌍 CO₂ emissions — 日本語テスト';
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('handles long strings', () => {
    const plaintext = 'a'.repeat(10_000);
    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('throws on tampered ciphertext', () => {
    const encrypted = encrypt('sensitive data');
    const parts = encrypted.split(':');
    // Tamper with the ciphertext portion
    const tampered = `${parts[0]}:${parts[1]}:${'ff'.repeat(parts[2]!.length / 2)}`;

    expect(() => decrypt(tampered)).toThrow();
  });

  it('throws on invalid format (missing parts)', () => {
    expect(() => decrypt('invalidformat')).toThrow('Invalid encrypted text format');
    expect(() => decrypt('part1:part2')).toThrow('Invalid encrypted text format');
  });

  it('throws on tampered auth tag', () => {
    const encrypted = encrypt('test data');
    const parts = encrypted.split(':');
    // Flip bits in the auth tag
    const tamperedTag = parts[1]!.split('').reverse().join('');
    const tampered = `${parts[0]}:${tamperedTag}:${parts[2]}`;

    expect(() => decrypt(tampered)).toThrow();
  });
});
