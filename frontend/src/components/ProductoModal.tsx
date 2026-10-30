import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import type { Producto } from '../types';

interface ProductoModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: (producto: Partial<Producto>) => Promise<void>;
    productoEditar?: Producto | null;
}

const ProductoModal: React.FC<ProductoModalProps> = ({ show, handleClose, onSave, productoEditar }) => {
    const estadoInicial = {
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        stock: 0,
        estado: 'activo' as 'activo' | 'inactivo'
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productoEditar) {
            setFormData({
                nombre: productoEditar.nombre,
                descripcion: productoEditar.descripcion || '',
                precio: productoEditar.precio,
                categoria: productoEditar.categoria,
                stock: productoEditar.stock,
                estado: productoEditar.estado
            });
        } else {
            setFormData(estadoInicial);
        }
        setError('');
    }, [productoEditar, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.precio <= 0) {
            setError('El precio debe ser mayor a 0.');
            return;
        }
        if (formData.stock < 0) {
            setError('El stock no puede ser negativo.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onSave(formData);
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al guardar el producto. Verifica los datos.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del producto <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text" 
                                name="categoria" 
                                value={formData.categoria} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="row">
                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Precio (MXN) <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.01" 
                                name="precio" 
                                value={formData.precio} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-6">
                            <Form.Label>Stock <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="number" 
                                name="stock" 
                                value={formData.stock} 
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ProductoModal;