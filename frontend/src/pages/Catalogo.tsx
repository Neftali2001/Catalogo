import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ReporteResumen {
    total_productos: number;
    total_stock: number;
    valor_inventario: number;
    total_usuarios: number;
}

interface CategoriaGrafica {
    categoria: string;
    cantidad: number;
    stock_total: number;
}

const formatMXN = (monto: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    }).format(monto);
};

const Dashboard = () => {
    const [resumen, setResumen] = useState<ReporteResumen | null>(null);
    const [datosGrafica, setDatosGrafica] = useState<CategoriaGrafica[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                setLoading(true);
                const response = await api.get('productos/reportes/');
                setResumen(response.data.resumen);
                setDatosGrafica(response.data.graficas?.por_categoria || []);
                setError('');
            } catch (err) {
                setError('No pudimos cargar los datos del dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);

    if (loading) {
        return (
            <div className="w-100 min-vh-100 p-3 p-md-4 p-lg-5 bg-light">
                <div className="placeholder-glow mb-4">
                    <span className="placeholder col-4 col-md-2 bg-secondary rounded" style={{ height: '32px' }}></span>
                </div>
                <div className="row g-3 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="col-12 col-sm-6 col-xl-3">
                            <div className="card border-0 shadow-sm p-4 bg-white" style={{ height: '100px' }}>
                                <div className="placeholder-glow h-100 d-flex flex-column justify-content-between">
                                    <span className="placeholder col-6 bg-secondary opacity-25 rounded"></span>
                                    <span className="placeholder col-4 bg-secondary opacity-25 rounded" style={{ height: '20px' }}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card border-0 shadow-sm p-4 bg-white" style={{ height: '400px' }}>
                    <div className="placeholder-glow h-100 d-flex align-items-center justify-content-center text-secondary opacity-50">
                        Cargando información...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-100 p-4">
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center p-3 p-md-4" role="alert">
                    <div>
                        <h5 className="alert-heading mb-1 fw-bold">Error de conexión</h5>
                        <p className="mb-0 text-muted">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-100 min-vh-100 bg-light p-3 p-md-4 p-xl-5">
            {/* Header adaptable */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Dashboard Administrativo</h1>
                    <p className="text-muted small mb-0">Resumen del inventario y métricas en tiempo real.</p>
                </div>
                <div className="align-self-start align-self-sm-center">
                    <span className="badge bg-white text-dark border shadow-sm px-3 py-2 fw-normal rounded-pill d-inline-flex align-items-center gap-2">
                        <span className="bg-success rounded-circle" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                        Sincronizado
                    </span>
                </div>
            </div>
            
            {/* Grid de KPIs - 1 Col en Móvil, 2 Col en Tablet, 4 Col en Desktop */}
            <div className="row g-3 g-xl-4 mb-4">
                {/* Total Productos */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 p-md-4 d-flex align-items-center">
                            <div className="rounded-3 p-3 bg-primary bg-opacity-10 text-primary me-3 flex-shrink-0">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            </div>
                            <div className="overflow-hidden">
                                <span className="d-block text-muted text-uppercase fw-bold text-truncate mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                                    Productos Registrados
                                </span>
                                <h3 className="mb-0 fw-bold text-dark">{resumen?.total_productos?.toLocaleString() || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unidades en Stock */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 p-md-4 d-flex align-items-center">
                            <div className="rounded-3 p-3 bg-success bg-opacity-10 text-success me-3 flex-shrink-0">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                            </div>
                            <div className="overflow-hidden">
                                <span className="d-block text-muted text-uppercase fw-bold text-truncate mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                                    Unidades en Stock
                                </span>
                                <h3 className="mb-0 fw-bold text-dark">{resumen?.total_stock?.toLocaleString() || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Valor Inventario */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 p-md-4 d-flex align-items-center">
                            <div className="rounded-3 p-3 bg-warning bg-opacity-10 text-warning me-3 flex-shrink-0">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div className="overflow-hidden">
                                <span className="d-block text-muted text-uppercase fw-bold text-truncate mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                                    Valor Inventario
                                </span>
                                <h3 className="mb-0 fw-bold text-dark fs-4">{formatMXN(resumen?.valor_inventario || 0)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100 bg-white">
                        <div className="card-body p-3 p-md-4 d-flex align-items-center">
                            <div className="rounded-3 p-3 bg-info bg-opacity-10 text-info me-3 flex-shrink-0">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            </div>
                            <div className="overflow-hidden">
                                <span className="d-block text-muted text-uppercase fw-bold text-truncate mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                                    Usuarios Activos
                                </span>
                                <h3 className="mb-0 fw-bold text-dark">{resumen?.total_usuarios?.toLocaleString() || 0}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm bg-white">
                <div className="card-header bg-white border-0 pt-4 px-3 px-md-4 pb-0">
                    <h5 className="card-title fw-bold text-dark mb-1">Distribución de Inventario por Categoría</h5>
                    <p className="text-muted small mb-0">Comparativa directa entre variedad de productos y unidades en stock.</p>
                </div>
                <div className="card-body px-2 px-md-4 pb-4" style={{ height: '380px', minHeight: '320px' }}>
                    {datosGrafica.length === 0 ? (
                        <div className="d-flex h-100 flex-column justify-content-center align-items-center text-muted p-4 text-center">
                            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-2 text-secondary opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span className="small">No hay datos de inventario para graficar.</span>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={datosGrafica}
                                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
                                <XAxis 
                                    dataKey="categoria" 
                                    tick={{ fill: '#5f6368', fontSize: 11 }} 
                                    axisLine={{ stroke: '#dadce0' }}
                                    tickLine={false}
                                />
                                <YAxis 
                                    yAxisId="left" 
                                    orientation="left" 
                                    stroke="#1a73e8" 
                                    tick={{ fill: '#1a73e8', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    stroke="#34a853" 
                                    tick={{ fill: '#34a853', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: '#202124', 
                                        borderRadius: '8px', 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                                        border: 'none',
                                        padding: '8px 12px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: any, name: any) => [
                                        value?.toLocaleString() ?? 0,
                                        name === 'cantidad' ? 'Variedad de Productos' : 'Unidades en Stock'
                                    ]}
                                    labelStyle={{ fontWeight: 'bold', color: '#8ab4f8', marginBottom: '2px' }}
                                />
                                <Legend 
                                    wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
                                    formatter={(value) => <span className="text-secondary fw-medium me-2">{value}</span>}
                                />
                                <Bar 
                                    yAxisId="left" 
                                    dataKey="cantidad" 
                                    name="Variedad de Productos" 
                                    fill="#1a73e8" 
                                    radius={[4, 4, 0, 0]} 
                                    maxBarSize={30}
                                />
                                <Bar 
                                    yAxisId="right" 
                                    dataKey="stock_total" 
                                    name="Unidades en Stock" 
                                    fill="#34a853" 
                                    radius={[4, 4, 0, 0]} 
                                    maxBarSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;