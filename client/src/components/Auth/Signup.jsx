import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signup as apiSignup } from '../../api';
import './Auth.scss';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await apiSignup(form);
      loginUser(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h2 className="auth__title">Create Account</h2>
        <p className="auth__sub">Start your SQL learning journey</p>

        {error && <div className="auth__error">{error}</div>}

        <label className="auth__label">
          Name
          <input className="auth__input" name="name" type="text"
            value={form.name} onChange={handleChange} required />
        </label>
        <label className="auth__label">
          Email
          <input className="auth__input" name="email" type="email"
            value={form.email} onChange={handleChange} required />
        </label>
        <label className="auth__label">
          Password
          <input className="auth__input" name="password" type="password" minLength={6}
            value={form.password} onChange={handleChange} required />
        </label>

        <button className="auth__submit" type="submit">Sign Up</button>
        <p className="auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
