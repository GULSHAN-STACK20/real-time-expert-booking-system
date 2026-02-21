import mongoose from 'mongoose';
import { Expert } from '../models/Expert.js';
import { AppError } from '../utils/appError.js';

export const getExperts = async ({ page = 1, limit = 10, search = '', category = '' }) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }

  const [experts, total] = await Promise.all([
    Expert.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Expert.countDocuments(filter),
  ]);

  return {
    experts,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  };
};

export const getExpertById = async (expertId) => {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new AppError('Invalid expert ID', 400);
  }

  const expert = await Expert.findById(expertId).lean();
  if (!expert) {
    throw new AppError('Expert not found', 404);
  }
  return expert;
};
