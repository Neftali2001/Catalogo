import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import type { Producto } from '../types';
import ProductoModal from '../components/ProductoModal';

const formatMXN = (monto: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(monto);
};

const Productos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [productoActual, setProductoActual] = useState<Producto | null>(null);

    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>('todos');

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const response = await api.get('productos/');
            const data = response.data.results ? response.data.results : response.data;
            setProductos(data);
            setError('');
        } catch (err) {
            setError('Error al cargar los productos. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleOpenModal = (producto?: Producto) => {
        setProductoActual(producto || null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProductoActual(null);
    };

    const handleSaveProducto = async (productoData: Partial<Producto>) => {
        if (productoActual) {
            const response = await api.put(`productos/${productoActual.id}/`, productoData);
            setProductos(productos.map(p => p.id === productoActual.id ? response.data : p));
        } else {
            const response = await api.post('productos/', productoData);
            setProductos([response.data, ...productos]);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await api.delete(`productos/${id}/`);
                setProductos(productos.filter(p => p.id !== id));
            } catch (err) {
                alert('Error al eliminar el producto');
            }
        }
    };

    const productosFiltrados = useMemo(() => {
        return productos.filter(prod => {
            const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                  prod.categoria.toLowerCase().includes(busqueda.toLowerCase());
            const coincideEstado = filtroEstado === 'todos' || prod.estado === filtroEstado;
            return coincideTexto && coincideEstado;
        });
    }, [productos, busqueda, filtroEstado]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mt-3">{error}</div>;

    const sinResultados = productosFiltrados.length === 0;

    return (
        <div className="container-fluid px-2 px-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <h2 className="mb-0">Gestión de Productos</h2>
                <div className="d-grid d-md-block">
                    <button className="btn btn-success" onClick={() => handleOpenModal()}>
                        + Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="row mb-3 g-2">
                <div className="col-12 col-md-8">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Buscar por nombre o categoría..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <select 
                        className="form-select" 
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* ========== VISTA MÓVIL: tarjetas (visible solo en pantallas < md) ========== */}
            <div className="d-md-none">
                {sinResultados ? (
                    <div className="text-center py-4 text-muted bg-white rounded shadow-sm">
                        No se encontraron productos coincidentes.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {productosFiltrados.map((prod) => (
                            <div key={prod.id} className="card shadow-sm">
                                <div className="card-body">
                                    {/* Nombre, categoría y estado */}
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                            <h6 className="fw-bold mb-1 text-break">{prod.nombre}</h6>
                                            <div className="text-muted small text-break">{prod.categoria}</div>
                                        </div>
                                        <span className={`badge flex-shrink-0 ${prod.estado === 'activo' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {prod.estado}
                                        </span>
                                    </div>

                                    {/* Precio y stock */}
                                    <div className="d-flex justify-content-between align-items-end border-top pt-3 mb-3">
                                        <div>
                                            <div className="text-muted small">Precio</div>
                                            <div className="fs-5 fw-semibold text-nowrap">{formatMXN(prod.precio)}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-muted small">Stock</div>
                                            <span className={`badge fs-6 ${prod.stock < 10 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                {prod.stock}
                                            </span>
                                            {prod.stock < 10 && (
                                                <div className="small text-warning-emphasis mt-1">Stock bajo</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => handleOpenModal(prod)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                className="btn btn-outline-danger w-100"
                                                onClick={() => handleDelete(prod.id)}
                                            >
                                                Borrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ========== VISTA ESCRITORIO / TABLET: tabla (visible desde md) ========== */}
            <div className="table-responsive shadow-sm rounded bg-white d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sinResultados ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
                                    No se encontraron productos coincidentes.
                                </td>
                            </tr>
                        ) : (
                            productosFiltrados.map((prod) => (
                                <tr key={prod.id}>
                                    <td>{prod.id}</td>
                                    <td className="fw-bold text-truncate" style={{ maxWidth: '220px' }}>{prod.nombre}</td>
                                    <td>{prod.categoria}</td>
                                    <td className="text-nowrap">{formatMXN(prod.precio)}</td>
                                    <td>
                                        <span className={`badge ${prod.stock < 10 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {prod.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${prod.estado === 'activo' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {prod.estado}
                                        </span>
                                    </td>
                                    <td className="text-center text-nowrap">
                                        <button 
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleOpenModal(prod)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(prod.id)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductoModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                onSave={handleSaveProducto} 
                productoEditar={productoActual} 
            />
        </div>
    );
};

export default Productos;
