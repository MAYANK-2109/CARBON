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
  getCacheKey: vi.fn().mockReturnValue('mock-key')
}));

describe('Calculator Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: any;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    mockRes = {
      json: jsonMock,
    };
    statusMock = vi.fn().mockReturnValue(mockRes);
    mockRes.status = statusMock;
    mockNext = vi.fn();
    vi.clearAllMocks();
    vi.spyOn(Emission, 'insertMany').mockResolvedValue([] as any);
  });

  describe('handleCalculateTravel', () => {
    it('calculates travel emissions successfully', async () => {
      mockReq = { body: { distanceKm: 100, vehicleType: 'car' }, user: { userId: '1' } as any };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateTravel').mockReturnValue({ totalCo2eKg: 10, category: 'travel', breakdown: [{subcategory: 'car', co2eKg: 10}] } as any);

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: expect.any(Object) });
    });

    it('handles errors', async () => {
      mockReq = { body: {}, user: { userId: '1' } as any };
      const error = new Error('Test');
      vi.spyOn(calculatorService, 'calculateTravel').mockImplementation(() => { throw error; });

      await handleCalculateTravel(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('handleCalculateEnergy', () => {
    it('calculates energy emissions successfully', async () => {
      mockReq = { body: { electricityKwh: 100 }, user: { userId: '1' } as any };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateEnergy').mockReturnValue({ totalCo2eKg: 20, category: 'energy', breakdown: [] } as any);

      await handleCalculateEnergy(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: expect.any(Object) });
    });
  });

  describe('handleCalculateDiet', () => {
    it('calculates diet emissions successfully', async () => {
      mockReq = { body: { beefServings: 2 }, user: { userId: '1' } as any };
      vi.spyOn(cache, 'get').mockReturnValue(null);
      vi.spyOn(calculatorService, 'calculateDiet').mockReturnValue({ totalCo2eKg: 30, category: 'diet', breakdown: [] } as any);

      await handleCalculateDiet(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: expect.any(Object) });
    });
  });
});
