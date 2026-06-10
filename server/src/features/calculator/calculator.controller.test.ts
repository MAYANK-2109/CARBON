/**
 * @module features/calculator/calculator.controller.test
 * @description Unit tests for carbon calculation request handlers.
 * Covers cache hits, cache misses, authenticated persistence, unauthenticated access, and error paths.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handleCalculateTravel, handleCalculateEnergy, handleCalculateDiet } from './calculator.controller';
import * as calculatorService from './calculator.service';
import { Emission } from '../../models/Emission.model';
import { cache } from '../../config/cache';

vi.mock('./calculator.service');
vi.mock('../../models/Emission.model');
vi.mock('../../config/cache', () => ({
  cache: { get: vi.fn(), set: vi.fn() },
  getCacheKey: vi.fn().mockReturnValue('mock-key'),
}));

const mockTravelResult = {
  totalCo2eKg: 10,
  annualizedCo2eKg: 3650,
  category: 'travel' as const,
  breakdown: [{ subcategory: 'car (petrol)', co2eKg: 10, percentage: 100 }],
  equivalents: { treesNeeded: 1, drivingKm: 100, flightsLondon2NY: 0.01 },
  calculatedAt: new Date().toISOString(),
};

const mockEnergyResult = {
  totalCo2eKg: 20,
  annualizedCo2eKg: 240,
  category: 'energy' as const,
  breakdown: [{ subcategory: 'electricity', co2eKg: 20, percentage: 100 }],
  equivalents: { treesNeeded: 2, drivingKm: 200, flightsLondon2NY: 0.02 },
  calculatedAt: new Date().toISOString(),
};

const mockDietResult = {
  totalCo2eKg: 30,
  annualizedCo2eKg: 1560,
  category: 'diet' as const,
  breakdown: [{ subcategory: 'beef', co2eKg: 30, percentage: 100 }],
  equivalents: { treesNeeded: 3, drivingKm: 300, flightsLondon2NY: 0.03 },
  calculatedAt: new Date().toISOString(),
};

describe('Calculator Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = { status: statusMock, json: jsonMock };
    mockNext = vi.fn();
    vi.clearAllMocks();
    vi.spyOn(Emission, 'insertMany').mockResolvedValue([] as any);
  });

  // ─── handleCalculateTravel ────────────────────────────────

  describe('handleCalculateTravel', () => {
    it('calculates travel and returns result (cache miss, authenticated)', async () => {
      mockReq = { body: { distanceKm: 100, vehicleType: 'car' }, user: { userId: 'user-1', email: 'u@test.com' } };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateTravel').mockReturnValue(mockTravelResult);

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);

      expect(calculatorService.calculateTravel).toHaveBeenCalledWith(mockReq.body);
      expect(cache.set).toHaveBeenCalledWith('mock-key', mockTravelResult);
      expect(Emission.insertMany).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockTravelResult });
    });

    it('returns cached result without calling service (cache hit)', async () => {
      mockReq = { body: { distanceKm: 100, vehicleType: 'car' }, user: { userId: 'user-1', email: 'u@test.com' } };
      vi.spyOn(cache, 'get').mockReturnValue(mockTravelResult);

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);

      // Service should NOT be called when cache hit
      expect(calculatorService.calculateTravel).not.toHaveBeenCalled();
      expect(cache.set).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockTravelResult });
    });

    it('skips history persistence when user is not authenticated', async () => {
      mockReq = { body: { distanceKm: 100, vehicleType: 'bicycle' } }; // no user
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateTravel').mockReturnValue(mockTravelResult);

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);

      expect(Emission.insertMany).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('passes error to next on service failure', async () => {
      mockReq = { body: {}, user: { userId: 'user-1', email: 'u@test.com' } };
      const error = new Error('Service error');
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateTravel').mockImplementation(() => { throw error; });

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ─── handleCalculateEnergy ───────────────────────────────

  describe('handleCalculateEnergy', () => {
    it('calculates energy and returns result (cache miss, authenticated)', async () => {
      mockReq = { body: { electricityKwh: 100 }, user: { userId: 'user-1', email: 'u@test.com' } };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateEnergy').mockReturnValue(mockEnergyResult);

      await handleCalculateEnergy(mockReq as Request, mockRes as Response, mockNext);

      expect(calculatorService.calculateEnergy).toHaveBeenCalledWith(mockReq.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockEnergyResult });
    });

    it('returns cached energy result without calling service', async () => {
      mockReq = { body: { electricityKwh: 100 } };
      vi.spyOn(cache, 'get').mockReturnValue(mockEnergyResult);

      await handleCalculateEnergy(mockReq as Request, mockRes as Response, mockNext);

      expect(calculatorService.calculateEnergy).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('skips history persistence when unauthenticated', async () => {
      mockReq = { body: { electricityKwh: 50 } }; // no user
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateEnergy').mockReturnValue(mockEnergyResult);

      await handleCalculateEnergy(mockReq as Request, mockRes as Response, mockNext);

      expect(Emission.insertMany).not.toHaveBeenCalled();
    });

    it('passes error to next on service failure', async () => {
      mockReq = { body: {} };
      const error = new Error('Energy service error');
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateEnergy').mockImplementation(() => { throw error; });

      await handleCalculateEnergy(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ─── handleCalculateDiet ─────────────────────────────────

  describe('handleCalculateDiet', () => {
    it('calculates diet and returns result (cache miss, authenticated)', async () => {
      mockReq = { body: { items: [{ category: 'beef', kgPerWeek: 1 }] }, user: { userId: 'user-1', email: 'u@test.com' } };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateDiet').mockReturnValue(mockDietResult);

      await handleCalculateDiet(mockReq as Request, mockRes as Response, mockNext);

      expect(calculatorService.calculateDiet).toHaveBeenCalledWith(mockReq.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockDietResult });
    });

    it('returns cached diet result without calling service', async () => {
      mockReq = { body: { items: [] } };
      vi.spyOn(cache, 'get').mockReturnValue(mockDietResult);

      await handleCalculateDiet(mockReq as Request, mockRes as Response, mockNext);

      expect(calculatorService.calculateDiet).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('skips history persistence when unauthenticated', async () => {
      mockReq = { body: { items: [] } }; // no user
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateDiet').mockReturnValue(mockDietResult);

      await handleCalculateDiet(mockReq as Request, mockRes as Response, mockNext);

      expect(Emission.insertMany).not.toHaveBeenCalled();
    });

    it('passes error to next on service failure', async () => {
      mockReq = { body: {} };
      const error = new Error('Diet service error');
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateDiet').mockImplementation(() => { throw error; });

      await handleCalculateDiet(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
