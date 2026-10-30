
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import type { Usuario } from '../types';

// Datos que se envían al guardar
type UsuarioPayload = {
    username: string;
    email: string;
    password?: string;
    is_active: boolean;
};

// Datos internos del formulario: la contraseña siempre es string
type UsuarioFormData = {
    username: string;
    email: string;
    password: string;
    is_active: boolean;
};

interface UsuarioModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: (usuario: Partial<Usuario> & { password?: string }) => Promise<void>;
    usuarioEditar?: Usuario | null;
}

// Estado inicial del formulario
const ESTADO_INICIAL: UsuarioFormData = {
    username: '',
    email: '',
    password: '',
    is_active: true
};

const UsuarioModal: React.FC<UsuarioModalProps> = ({
    show,
    handleClose,
    onSave,
    usuarioEditar
}) => {
    const [formData, setFormData] = useState<UsuarioFormData>({
        ...ESTADO_INICIAL
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar datos cuando se edita un usuario
    useEffect(() => {
        if (usuarioEditar) {
            setFormData({
                username: usuarioEditar.username,
                email: usuarioEditar.email,
                password: '',
                is_active: usuarioEditar.is_active
            });
        } else {
            setFormData({ ...ESTADO_INICIAL });
        }

        setError('');
    }, [usuarioEditar, show]);

    // Manejar cambios en los campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;

        setFormData((prev) => {
            switch (name) {
                case 'username':
                    return { ...prev, username: value };

                case 'email':
                    return { ...prev, email: value };

                case 'password':
                    return { ...prev, password: value };

                case 'is_active':
                    return { ...prev, is_active: checked };

                default:
                    return prev;
            }
        });
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError('');

            // Crear payload con contraseña opcional
            const payload: UsuarioPayload = {
                ...formData
            };

            // Si estamos editando y la contraseña está vacía,
            // eliminamos la propiedad del objeto.
            if (usuarioEditar && !payload.password) {
                delete payload.password;
            }

            await onSave(payload);

            handleClose();

        } catch (err: unknown) {
            const errorMessage =
                typeof err === 'object' && err !== null && 'response' in err
                    ? (
                        err as {
                            response?: {
                                data?: {
                                    detail?: string;
                                };
                            };
                        }
                    ).response?.data?.detail
                    : undefined;

            setError(
                errorMessage ||
                'Error al guardar el usuario. Verifica que el nombre de usuario no esté repetido.'
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>

                    {error && (
                        <Alert variant="danger">
                            {error}
                        </Alert>
                    )}

                    {/* Nombre de usuario */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Nombre de Usuario (Username)
                            <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Correo electrónico */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Correo Electrónico
                            <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Contraseña */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Contraseña

                            {usuarioEditar ? (
                                <small className="text-muted ms-1">
                                </small>
                            ) : (
                                <span className="text-danger">*</span>
                            )}
                        </Form.Label>

                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!usuarioEditar}
                        />
                    </Form.Group>

                    {/* Estado del usuario */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="usuario-activo-switch"
                            name="is_active"
                            label={
                                formData.is_active
                                    ? 'Usuario Activo'
                                    : 'Usuario Inactivo'
                            }
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UsuarioModal;
