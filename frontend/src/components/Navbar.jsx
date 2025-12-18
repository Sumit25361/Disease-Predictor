import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username') || localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Disease Predictor</Link>
            </div>
            <div className="navbar-menu">
                {token ? (
                    <>
                        <span className="navbar-item">Hello, {user}</span>
                        <Link to="/history" className="navbar-item" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>History</Link>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    isAuthPage ? (
                        <span className="navbar-tagline">AI Powered Diagnosis</span>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-item">Login</Link>
                            <Link to="/register" className="navbar-item">Register</Link>
                        </>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;
