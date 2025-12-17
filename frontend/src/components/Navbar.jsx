import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username') || localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Disease Predictor</Link>
            </div>
            <div className="navbar-menu">
                {token ? (
                    <>
                        <span className="navbar-item">Hello, {user}</span>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-item">Login</Link>
                        <Link to="/register" className="navbar-item">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
