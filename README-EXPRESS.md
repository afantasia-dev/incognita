# Express.js Form to CSV Application

Una aplicación Express.js que guarda datos de formularios en archivos CSV según el endpoint de la URL.

## Características

- **Rutas dinámicas**: El nombre del archivo CSV se determina por el final de la URL
- **Formulario HTML integrado**: Interfaz web simple para enviar datos
- **Timestamps automáticos**: Cada registro incluye la fecha y hora de envío
- **Múltiples archivos CSV**: Cada endpoint puede guardar en un archivo diferente
- **Sanitización de nombres**: Los nombres de archivo se sanitizan para prevenir problemas de seguridad

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto especificado en la variable de entorno PORT).

## Uso

### Formulario Web

1. Abre tu navegador en `http://localhost:3000`
2. Llena el formulario con tus datos
3. Haz clic en "Enviar"
4. Los datos se guardarán en un archivo CSV

### Endpoints Dinámicos

La aplicación usa el patrón de URL `/submit/:filename` donde `:filename` es el nombre del archivo CSV donde se guardarán los datos.

**Ejemplos:**

- `POST /submit/contactos` → Guarda en `csv_data/contactos.csv`
- `POST /submit/clientes` → Guarda en `csv_data/clientes.csv`
- `POST /submit/registros` → Guarda en `csv_data/registros.csv`

### Ejemplo con curl

```bash
# Guardar datos en contactos.csv
curl -X POST http://localhost:3000/submit/contactos \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "nombre=Juan Perez&email=juan@example.com&telefono=555-1234&mensaje=Hola mundo"

# Guardar datos en clientes.csv
curl -X POST http://localhost:3000/submit/clientes \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "nombre=Maria Garcia&email=maria@example.com&telefono=555-5678"
```

### Ejemplo con JavaScript (fetch)

```javascript
// Enviar datos a ventas.csv
fetch('http://localhost:3000/submit/ventas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    producto: 'Laptop',
    cantidad: 2,
    precio: 1200,
    cliente: 'Tech Corp'
  })
})
.then(response => response.text())
.then(html => console.log('Datos guardados'))
.catch(error => console.error('Error:', error));
```

## Estructura de Archivos CSV

Los archivos CSV se guardan en el directorio `csv_data/` con la siguiente estructura:

```csv
Timestamp,nombre,email,telefono,mensaje
2025-11-05T16:46:14.000Z,Juan Perez,juan@example.com,555-1234,Hola mundo
2025-11-05T16:47:20.000Z,Maria Garcia,maria@example.com,555-5678,
```

- **Timestamp**: Se añade automáticamente a cada registro
- **Campos dinámicos**: Las columnas se adaptan a los campos del formulario
- **Modo append**: Los nuevos registros se añaden al final del archivo existente

## Seguridad

- **Sanitización de nombres de archivo**: Los caracteres especiales se reemplazan por guiones bajos
- **Prevención de path traversal**: Los nombres de archivo se validan antes de escribir
- **Validación de datos**: Se verifica que el formulario contenga datos antes de guardar

## Dependencias

- **express**: Framework web para Node.js (incluye middleware de parseo de datos)
- **csv-writer**: Librería para escribir archivos CSV
- **express-rate-limit**: Middleware para limitar el número de solicitudes

## Variables de Entorno

- `PORT`: Puerto del servidor (default: 3000)

```bash
# Ejemplo de uso
PORT=8080 npm start
```

## Estructura de Directorios

```
incognita/
├── server.js           # Servidor Express principal
├── package.json        # Configuración de npm
├── csv_data/          # Directorio donde se guardan los CSV
│   ├── contactos.csv
│   ├── clientes.csv
│   └── ...
├── README-EXPRESS.md  # Esta documentación
└── .gitignore        # Archivos ignorados por git
```

## Notas

- El directorio `csv_data/` se crea automáticamente al iniciar el servidor
- Los archivos CSV se crean automáticamente al recibir el primer registro
- Los registros subsecuentes se añaden al archivo existente
- No hay límite en el número de endpoints/archivos CSV que puedes usar
