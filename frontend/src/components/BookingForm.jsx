import { useMemo, useState } from 'react';
import { apiSend } from '../api/client';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  timeSlot: '',
  notes: '',
};

const formatDateLabel = (isoDate) => new Date(isoDate).toLocaleDateString();

export const BookingForm = ({ expertId, availableSlots, onBooked }) => {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const selectableDates = useMemo(
    () => availableSlots.filter((entry) => entry.slots.length > 0).map((entry) => entry.date),
    [availableSlots]
  );

  const selectedDateSlots = availableSlots.find((entry) => entry.date === form.date)?.slots || [];

  const onChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      if (name === 'date') {
        return { ...prev, date: value, timeSlot: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.date || !form.timeSlot) {
      setMessage('All required fields must be completed.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setMessage('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      await apiSend('/api/bookings', 'POST', { ...form, expertId });
      setMessage('Booking created successfully.');
      setForm(initialForm);
      onBooked();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="panel">
      <h3>Book Session</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
      <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={onChange} />
      <select name="date" value={form.date} onChange={onChange}>
        <option value="">Select date</option>
        {selectableDates.map((isoDate) => (
          <option key={isoDate} value={isoDate}>
            {formatDateLabel(isoDate)}
          </option>
        ))}
      </select>
      <select name="timeSlot" value={form.timeSlot} onChange={onChange} disabled={!form.date}>
        <option value="">Select slot</option>
        {selectedDateSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={onChange} />
      <button type="submit">Submit Booking</button>
      {message && <p>{message}</p>}
    </form>
  );
};
