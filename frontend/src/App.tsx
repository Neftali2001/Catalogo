import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Productos from './pages/Productos'; 
import Usuarios from './pages/Usuarios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'; 


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Rutas Privadas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Catalogo />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/usuarios" element={<Usuarios />} /> 
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;