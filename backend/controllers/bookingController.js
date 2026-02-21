import { asyncHandler } from '../utils/asyncHandler.js';
import * as bookingService from '../services/bookingService.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: 'Booking status updated',
    booking,
  });
});

export const getBookingsByEmail = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getBookingsByEmail(req.query.email);
  res.status(200).json({
    success: true,
    bookings,
  });
});
