import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiDatabase, FiLogOut, FiUser } from 'react-icons/fi';
import './Navbar.scss';

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <FiDatabase className="navbar__icon" />
          <span>CipherSQL<strong>Studio</strong></span>
        </Link>

        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__user">
                <FiUser /> {user.name}
              </span>
              <button className="navbar__btn navbar__btn--logout" onClick={logoutUser}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__btn">Login</Link>
              <Link to="/signup" className="navbar__btn navbar__btn--primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
