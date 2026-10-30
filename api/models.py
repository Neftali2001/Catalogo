from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    
    is_active = models.BooleanField(default=True) 
class Producto(models.Model):
    ESTADO_CHOICES = (
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
    )
    
    nombre = models.CharField(max_length=255) 
    descripcion = models.TextField(blank=True, null=True) 
    precio = models.DecimalField(max_digits=12, decimal_places=2) 
    categoria = models.CharField(max_length=100) 
    stock = models.IntegerField() 
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')
    fecha_registro = models.DateTimeField(auto_now_add=True) 