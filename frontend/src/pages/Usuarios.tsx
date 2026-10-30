import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Usuario } from '../types';
import UsuarioModal from '../components/UsuarioModal';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('usuarios/');
            const data = response.data.results ? response.data.results : response.data;
            setUsuarios(data);
            setError('');
        } catch (err) {
            setError('Error al cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleOpenModal = (usuario?: Usuario) => {
        setUsuarioActual(usuario || null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUsuarioActual(null);
    };

    const handleSaveUsuario = async (usuarioData: Partial<Usuario> & { password?: string }) => {
        if (usuarioActual) {
            const response = await api.patch(`usuarios/${usuarioActual.id}/`, usuarioData);
            setUsuarios(usuarios.map(u => u.id === usuarioActual.id ? response.data : u));
        } else {
            const response = await api.post('usuarios/', usuarioData);
            setUsuarios([response.data, ...usuarios]);
        }
    };

    const handleDesactivar = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar este usuario? No podrá iniciar sesión.')) {
            try {
                await api.delete(`usuarios/${id}/`);
                setUsuarios(usuarios.map(u => u.id === id ? { ...u, is_active: false } : u));
            } catch (err) {
                alert('Error al desactivar el usuario');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    const sinResultados = usuarios.length === 0;

    return (
        <div className="container-fluid px-2 px-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h2 className="mb-0">Gestión de Usuarios</h2>
                <div className="d-grid d-md-block">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        + Nuevo Usuario
                    </button>
                </div>
            </div>

         
            <div className="d-md-none">
                {sinResultados ? (
                    <div className="text-center py-4 text-muted bg-white rounded shadow-sm">
                        No hay usuarios registrados.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {usuarios.map((user) => (
                            <div key={user.id} className="card shadow-sm">
                                <div className="card-body">
                                   
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                            <h6 className="fw-bold mb-1 text-break">{user.username}</h6>
                                            <div className="text-muted small text-break">{user.email}</div>
                                        </div>
                                        <span className={`badge flex-shrink-0 ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                   
                                    <div className="border-top pt-3 mb-3 small text-muted">
                                        ID de usuario: <span className="fw-semibold text-body">{user.id}</span>
                                    </div>

                               
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => handleOpenModal(user)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                className="btn btn-outline-danger w-100"
                                                onClick={() => handleDesactivar(user.id)}
                                                disabled={!user.is_active} 
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="table-responsive shadow-sm rounded bg-white d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Correo Electrónico</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sinResultados ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="fw-bold">{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="text-center text-nowrap">
                                        <button 
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleOpenModal(user)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDesactivar(user.id)}
                                            disabled={!user.is_active} 
                                        >
                                            Desactivar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <UsuarioModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                onSave={handleSaveUsuario} 
                usuarioEditar={usuarioActual} 
            />
        </div>
    );
};

export default Usuarios;
