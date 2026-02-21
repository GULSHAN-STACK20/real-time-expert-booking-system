import { useState } from 'react';
import { apiGet } from '../api/client';

const formatDateLabel = (isoDate) => new Date(isoDate).toLocaleDateString();

export const MyBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      const data = await apiGet(`/api/bookings?email=${encodeURIComponent(email)}`);
      setBookings(data.bookings);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>My Bookings</h1>
      <div className="toolbar">
        <input value={email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        <button onClick={loadBookings}>Search</button>
      </div>

      {error && <p>{error}</p>}
      <div className="grid">
        {bookings.map((booking) => (
          <article key={booking._id} className="panel">
            <h3>{booking.expert?.name || 'Unknown Expert'}</h3>
            <p>{formatDateLabel(booking.date)}</p>
            <p>{booking.timeSlot}</p>
            <span className={`badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
};
