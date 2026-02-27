import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as apiLogin } from '../../api';
import './Auth.scss';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await apiLogin(form);
      loginUser(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h2 className="auth__title">Welcome Back</h2>
        <p className="auth__sub">Log in to continue practising SQL</p>

        {error && <div className="auth__error">{error}</div>}

        <label className="auth__label">
          Email
          <input className="auth__input" name="email" type="email"
            value={form.email} onChange={handleChange} required />
        </label>
        <label className="auth__label">
          Password
          <input className="auth__input" name="password" type="password"
            value={form.password} onChange={handleChange} required />
        </label>

        <button className="auth__submit" type="submit">Log In</button>
        <p className="auth__switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
