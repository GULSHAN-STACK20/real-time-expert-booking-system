import { asyncHandler } from '../utils/asyncHandler.js';
import * as expertService from '../services/expertService.js';

export const listExperts = asyncHandler(async (req, res) => {
  const data = await expertService.getExperts(req.query);
  res.status(200).json({
    success: true,
    ...data,
  });
});

export const getExpertDetails = asyncHandler(async (req, res) => {
  const expert = await expertService.getExpertById(req.params.id);
  res.status(200).json({
    success: true,
    expert,
  });
});
