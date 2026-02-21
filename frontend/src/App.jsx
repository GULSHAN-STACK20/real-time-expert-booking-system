import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { ExpertDetailPage } from './pages/ExpertDetailPage';
import { ExpertListPage } from './pages/ExpertListPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

const App = () => {
  return (
    <main className="container">
      <nav className="toolbar">
        <Link to="/experts">Experts</Link>
        <Link to="/my-bookings">My Bookings</Link>
      </nav>

      <footer style={{ textAlign: "center", marginTop: "40px", padding: "20px" }}>
  Developed by <strong>Gulshan Kotiya</strong> © 2026
</footer>

      <Routes>
        <Route path="/" element={<Navigate to="/experts" />} />
        <Route path="/experts" element={<ExpertListPage />} />
        <Route path="/experts/:id" element={<ExpertDetailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </main>
  );
};

export default App;
