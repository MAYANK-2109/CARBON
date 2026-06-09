/**
 * @module features/history/history.service
 * @description Historical emission data queries and aggregation pipelines.
 */

import mongoose from 'mongoose';
import { Emission } from '../../models/Emission.model';
import type { EmissionCategory, EmissionSummary, MonthlyTrend, PaginatedHistory } from '@carbon/shared';

/**
 * Get paginated emission history for a user.
 * @param userId - User ID
 * @param page - Page number (1-indexed)
 * @param limit - Records per page
 * @param category - Optional category filter
 */
export async function getHistory(
  userId: string,
  page: number = 1,
  limit: number = 20,
  category?: EmissionCategory
): Promise<PaginatedHistory> {
  const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
  if (category) {
    filter['category'] = category;
  }

  const [records, total] = await Promise.all([
    Emission.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Emission.countDocuments(filter),
  ]);

  return {
    records: records.map((r) => ({
      id: r._id.toString(),
      userId: r.userId.toString(),
      category: r.category,
      subcategory: r.subcategory,
      inputValue: r.inputValue,
      inputUnit: r.inputUnit,
      co2eKg: r.co2eKg,
      createdAt: r.createdAt.toISOString(),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get aggregated emission summary for a time period.
 * @param userId - User ID
 * @param startDate - Period start
 * @param endDate - Period end
 */
export async function getSummary(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<EmissionSummary> {
  const objectId = new mongoose.Types.ObjectId(userId);

  const pipeline = [
    {
      $match: {
        userId: objectId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$co2eKg' },
        count: { $sum: 1 },
      },
    },
  ];

  const results = await Emission.aggregate(pipeline);

  const byCategory: Record<EmissionCategory, number> = { travel: 0, energy: 0, diet: 0 };
  let totalCo2eKg = 0;
  let recordCount = 0;

  for (const r of results) {
    const cat = r._id as EmissionCategory;
    byCategory[cat] = Math.round(r.total * 100) / 100;
    totalCo2eKg += r.total;
    recordCount += r.count;
  }

  return {
    totalCo2eKg: Math.round(totalCo2eKg * 100) / 100,
    byCategory,
    recordCount,
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
  };
}

/**
 * Get monthly emission trends for the last N months.
 * @param userId - User ID
 * @param months - Number of months to look back (default 6)
 */
export async function getMonthlyTrends(
  userId: string,
  months: number = 6
): Promise<MonthlyTrend[]> {
  const objectId = new mongoose.Types.ObjectId(userId);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        userId: objectId,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          category: '$category',
        },
        total: { $sum: '$co2eKg' },
      },
    },
    {
      $sort: { '_id.year': 1 as const, '_id.month': 1 as const },
    },
  ];

  const results = await Emission.aggregate(pipeline);

  // Group by year-month
  const trendMap = new Map<string, MonthlyTrend>();

  for (const r of results) {
    const key = `${r._id.year}-${String(r._id.month).padStart(2, '0')}`;
    if (!trendMap.has(key)) {
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      trendMap.set(key, {
        month: monthNames[r._id.month] || '',
        year: r._id.year,
        totalCo2eKg: 0,
        byCategory: { travel: 0, energy: 0, diet: 0 },
      });
    }

    const trend = trendMap.get(key)!;
    const cat = r._id.category as EmissionCategory;
    trend.byCategory[cat] = Math.round(r.total * 100) / 100;
    trend.totalCo2eKg += r.total;
  }

  // Round totals
  for (const trend of trendMap.values()) {
    trend.totalCo2eKg = Math.round(trend.totalCo2eKg * 100) / 100;
  }

  return Array.from(trendMap.values());
}
