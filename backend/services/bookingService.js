import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Expert } from '../models/Expert.js';
import { getSocket } from '../config/socket.js';
import { AppError } from '../utils/appError.js';

const validTransitions = {
  Pending: 'Confirmed',
  Confirmed: 'Completed',
  Completed: null,
};

export const createBooking = async (payload) => {
  const { expertId, date, timeSlot } = payload;

  if (!mongoose.isValidObjectId(expertId)) {
    throw new AppError('Invalid expert ID', 400);
  }

  const expert = await Expert.findById(expertId).lean();
  if (!expert) {
    throw new AppError('Expert not found', 404);
  }

  const daySlots = expert.availableSlots.find((slotSet) => slotSet.date === date);
  const isSlotAvailable = daySlots?.slots?.includes(timeSlot);

  if (!isSlotAvailable) {
    throw new AppError('Selected slot is not available', 400);
  }

  try {
    const booking = await Booking.create({
      expert: expertId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      date,
      timeSlot,
      notes: payload.notes,
    });

    console.info(`✅ Booking created: ${booking._id}`);

    const io = getSocket();
    io.emit('slotBooked', {
      expertId,
      date,
      timeSlot,
    });

    console.info(`📡 Emitted slotBooked for expert ${expertId}, ${date} ${timeSlot}`);

    return booking;
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError('Slot already booked', 409);
    }
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new AppError('Invalid booking ID', 400);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  const nextAllowedStatus = validTransitions[booking.status];

  if (booking.status === status || nextAllowedStatus !== status) {
    throw new AppError(`Invalid status transition from ${booking.status} to ${status}`, 400);
  }

  booking.status = status;
  await booking.save();

  return booking;
};

export const getBookingsByEmail = async (email) => {
  if (!email) {
    throw new AppError('Email query parameter is required', 400);
  }

  return Booking.find({ email: email.toLowerCase() })
    .populate('expert', 'name category')
    .sort({ createdAt: -1 })
    .lean();
};
