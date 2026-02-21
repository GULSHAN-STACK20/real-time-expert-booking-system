import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiGet } from '../api/client';

export const ExpertListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: '', experts: [], pagination: {} });

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchExperts = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: '' }));
      const data = await apiGet(
        `/api/experts?page=${page}&limit=6&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );
      setState({ loading: false, error: '', experts: data.experts, pagination: data.pagination });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, search, category]);

  const updateParams = (next) => {
    setSearchParams({
      page: String(next.page ?? 1),
      search: next.search ?? search,
      category: next.category ?? category,
    });
  };

  if (state.loading) return <p>Loading experts...</p>;
  if (state.error) return <p>{state.error}</p>;

  return (
    <div>
      <h1>Experts</h1>
      <div className="toolbar">
        <input value={search} placeholder="Search by name" onChange={(e) => updateParams({ search: e.target.value })} />
        <select value={category} onChange={(e) => updateParams({ category: e.target.value })}>
          <option value="">All categories</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Health">Health</option>
        </select>
      </div>
      <div className="grid">
        {state.experts.map((expert) => (
          <article key={expert._id} className="panel">
            <h3>{expert.name}</h3>
            <p>{expert.category}</p>
            <p>{expert.experience} years</p>
            <p>⭐ {expert.rating}</p>
            <Link to={`/experts/${expert._id}`}>View details</Link>
          </article>
        ))}
      </div>
      <div className="toolbar">
        <button disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })}>Prev</button>
        <span>
          Page {state.pagination.page} / {state.pagination.pages || 1}
        </span>
        <button disabled={page >= (state.pagination.pages || 1)} onClick={() => updateParams({ page: page + 1 })}>
          Next
        </button>
      </div>
    </div>
  );
};
