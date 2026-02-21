import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../api/client';
import { BookingForm } from '../components/BookingForm';
import { useSocket } from '../context/SocketContext';

const formatDateLabel = (isoDate) => new Date(isoDate).toLocaleDateString();

export const ExpertDetailPage = () => {
  const { id } = useParams();
  const socket = useSocket();
  const [expert, setExpert] = useState(null);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const loadExpert = async () => {
    try {
      const data = await apiGet(`/api/experts/${id}`);
      setExpert(data.expert);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadExpert();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handler = ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;
      setBookedSlots((prev) => [...prev, `${date}|${timeSlot}`]);
    };

    socket.on('slotBooked', handler);
    return () => socket.off('slotBooked', handler);
  }, [socket, id]);

  const availableSlots = useMemo(() => {
    if (!expert) return [];
    return expert.availableSlots.map((entry) => ({
      ...entry,
      slots: entry.slots.filter((slot) => !bookedSlots.includes(`${entry.date}|${slot}`)),
    }));
  }, [expert, bookedSlots]);

  if (error) return <p>{error}</p>;
  if (!expert) return <p>Loading expert...</p>;

  return (
    <div>
      <h1>{expert.name}</h1>
      <p>{expert.category}</p>
      <p>{expert.experience} years experience</p>
      <p>Rating: {expert.rating}</p>

      <section className="panel">
        <h3>Available Slots</h3>
        {availableSlots.map((entry) => (
          <div key={entry.date}>
            <h4>{formatDateLabel(entry.date)}</h4>
            <div className="slot-wrap">
              {entry.slots.map((slot) => (
                <span key={slot} className="slot">
                  {slot}
                </span>
              ))}
              {!entry.slots.length && <span>All slots booked</span>}
            </div>
          </div>
        ))}
      </section>

      <BookingForm expertId={id} availableSlots={availableSlots} onBooked={loadExpert} />
    </div>
  );
};
