import Joi from 'joi';
import { AppError } from '../utils/appError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

export const bookingCreateSchema = Joi.object({
  expertId: Joi.string().required(),
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  date: Joi.string().isoDate().required(),
  timeSlot: Joi.string().required(),
  notes: Joi.string().allow('').required(),
});

export const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Confirmed', 'Completed').required(),
});

export const validateBody = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return next(new AppError(error.details.map((item) => item.message).join(', '), 400));
  }

  req.body = value;
  return next();
};
