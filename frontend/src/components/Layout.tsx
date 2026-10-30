import { Outlet, Link, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Mi Catálogo</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/productos">Productos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/usuarios">Usuarios</Link>
                            </li>
                        </ul>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
            <main className="container mt-4">
                
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;