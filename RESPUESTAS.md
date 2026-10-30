Respuestas a la Prueba Técnica - Parte 1

1. ¿Cuál es la diferencia entre props y state?
Las props son los datos que un componente padre le pasa a su hijo, y el hijo no las puede modificar. El state es la información propia del componente, que sí cambia, y cuando cambia React lo vuelve a renderizar.

2. ¿Para qué sirve el hook useEffect y qué es su arreglo de dependencias?
Sirve para hacer cosas “extra” en un componente, como pedir datos a una API o suscribirse a algo. El arreglo de dependencias dice cuándo se vuelve a ejecutar el efecto; con [] solo corre una vez, cuando el componente se carga.

3. En una lista renderizada con .map(), ¿por qué es importante la prop key?
Le ayuda a React a saber qué elemento cambió, se agregó o se eliminó. Así no reconstruye toda la lista y evita errores visuales.

4. Diferencia entre componente controlado y no controlado
En el controlado, React maneja el valor del input con useState. En el no controlado, el valor vive en el DOM y se lee con useRef solo cuando se necesita.

5. En DRF, qué hace un Serializer y qué hace un ViewSet
El Serializer convierte los modelos a JSON (y al revés) y valida los datos que llegan. El ViewSet junta en una sola clase las operaciones (GET, POST, PUT, DELETE) de un modelo, para no escribir una ruta por cada una.

6. ¿Qué es una migración en Django y por qué no editamos la base de datos a mano?
Son archivos de Python que guardan el historial de cambios de la estructura de la base de datos. No se edita la BD a mano para que el código y las tablas siempre coincidan y todo funcione igual en cualquier entorno.

7. Diferencia entre métodos HTTP PUT y PATCH
PUT reemplaza el recurso completo; PATCH solo modifica los campos que se envían.

8. Cómo funciona JWT y por qué no guardar información sensible
Al iniciar sesión, el servidor devuelve un token firmado. El cliente lo guarda y lo manda en el header Authorization en cada petición. No se debe meter información sensible porque el contenido solo está en Base64, no encriptado, y cualquiera con el token puede leerlo.

9. Consulta SQL por categoría (productos activos, cantidad y stock, ordenado)

SELECT 
    categoria, 
    COUNT(id) AS cantidad_productos, 
    SUM(stock) AS suma_stock 
FROM producto 
WHERE estado = 'activo' 
GROUP BY categoria 
ORDER BY cantidad_productos DESC;

10. Qué es un índice en BD y por qué no indexar todas las columnas
Un índice hace más rápidas las consultas de lectura sobre una columna. No se ponen en todas porque ocupan espacio y hacen más lentos los INSERT, UPDATE y DELETE.

11. Comunicación Frontend (React) / API REST (Django) y CORS
React le pide datos a Django por HTTP (con fetch o Axios) y se comunican en JSON. CORS es una protección del navegador que bloquea peticiones a otro dominio o puerto. Aparece porque React corre en el puerto 5173 y Django en el 8000, así que en Django hay que configurar django-cors-headers para permitir el origen del frontend.

