import { useEffect, useState } from 'react';
import { fetchAssignments } from '../../api';
import AssignmentCard from '../../components/AssignmentCard/AssignmentCard';
import { FiSearch } from 'react-icons/fi';
import './Home.scss';

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments()
      .then((res) => setAssignments(res.data))
      .catch(() => setError('Failed to load assignments. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) => {
    const matchDiff = filter === 'all' || a.difficulty === filter;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  return (
    <main className="home container">
      <header className="home__hero">
        <h1 className="home__title">SQL Assignments</h1>
        <p className="home__sub">Practice real SQL queries against live databases</p>
      </header>

      {/* Filters */}
      <div className="home__controls">
        <div className="home__search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="home__filters">
          {['all', 'easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              className={`home__filter ${filter === d ? 'home__filter--active' : ''}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="home__loading">Loading assignments…</p>
      ) : error ? (
        <p className="home__empty home__empty--error">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="home__empty">No assignments found.</p>
      ) : (
        <div className="home__grid">
          {filtered.map((a) => (
            <AssignmentCard key={a._id} assignment={a} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
