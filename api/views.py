from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, F
from .models import Producto, Usuario
from .serializers import ProductoSerializer, UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        usuario = self.get_object()
        usuario.is_active = False
        usuario.save()
        return Response(status=204)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def reportes(self, request):
        total_productos = Producto.objects.count()
        total_stock = Producto.objects.aggregate(Sum('stock'))['stock__sum'] or 0
        total_usuarios = Usuario.objects.count()
        
        valor_inventario = Producto.objects.aggregate(
            total=Sum(F('precio') * F('stock'))
        )['total'] or 0

        por_categoria = Producto.objects.values('categoria').annotate(
            cantidad=Count('id'),
            stock_total=Sum('stock')
        ).order_by('-cantidad')

        return Response({
            'resumen': {
                'total_productos': total_productos,
                'total_stock': total_stock,
                'valor_inventario': valor_inventario,
                'total_usuarios': total_usuarios
            },
            'graficas': {
                'por_categoria': list(por_categoria)
            }
        })