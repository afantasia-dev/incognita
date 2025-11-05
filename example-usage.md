# Ejemplos de Uso

## Uso Básico con el Formulario Web

1. Inicia el servidor:
```bash
npm install
npm start
```

2. Abre tu navegador en: `http://localhost:3000`

3. Llena el formulario y haz clic en "Enviar"

Los datos se guardarán en `csv_data/contactos.csv`

## Usando diferentes endpoints

### Ejemplo 1: Guardar contactos
```bash
curl -X POST http://localhost:3000/submit/contactos \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "nombre=Juan Perez&email=juan@example.com&telefono=555-1234&mensaje=Hola"
```
**Resultado:** Crea/actualiza `csv_data/contactos.csv`

### Ejemplo 2: Guardar clientes
```bash
curl -X POST http://localhost:3000/submit/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Maria Garcia","email":"maria@example.com","empresa":"Tech Corp","telefono":"555-5678"}'
```
**Resultado:** Crea/actualiza `csv_data/clientes.csv`

### Ejemplo 3: Guardar ventas
```bash
curl -X POST http://localhost:3000/submit/ventas \
  -H "Content-Type: application/json" \
  -d '{"producto":"Laptop","cantidad":2,"precio":1200,"cliente":"ABC Inc"}'
```
**Resultado:** Crea/actualiza `csv_data/ventas.csv`

## Usando desde JavaScript

### Usando Fetch API

```javascript
async function enviarFormulario(endpoint, datos) {
  try {
    const response = await fetch(`http://localhost:3000/submit/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    });
    
    const html = await response.text();
    console.log('Datos guardados exitosamente');
    return html;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejemplo de uso
enviarFormulario('registros', {
  nombre: 'Ana Rodriguez',
  email: 'ana@example.com',
  fecha: new Date().toISOString()
});
```

### Usando jQuery

```javascript
$.ajax({
  url: 'http://localhost:3000/submit/eventos',
  method: 'POST',
  data: {
    evento: 'Conferencia Tech 2025',
    fecha: '2025-05-20',
    asistentes: 150
  },
  success: function(response) {
    console.log('Evento guardado exitosamente');
  },
  error: function(error) {
    console.error('Error al guardar:', error);
  }
});
```

## Formulario HTML Personalizado

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registro de Eventos</title>
</head>
<body>
  <form action="http://localhost:3000/submit/eventos" method="POST">
    <label>Nombre del Evento:
      <input type="text" name="evento" required>
    </label>
    <br>
    <label>Fecha:
      <input type="date" name="fecha" required>
    </label>
    <br>
    <label>Número de Asistentes:
      <input type="number" name="asistentes" required>
    </label>
    <br>
    <label>Descripción:
      <textarea name="descripcion"></textarea>
    </label>
    <br>
    <button type="submit">Guardar Evento</button>
  </form>
</body>
</html>
```

## Casos de Uso Comunes

### 1. Sistema de Registro de Usuarios
```bash
curl -X POST http://localhost:3000/submit/usuarios \
  -d "nombre=Carlos&email=carlos@example.com&rol=admin"
```

### 2. Registro de Encuestas
```bash
curl -X POST http://localhost:3000/submit/encuesta_satisfaccion \
  -d "calificacion=5&comentarios=Excelente servicio&fecha=2025-11-05"
```

### 3. Log de Actividades
```bash
curl -X POST http://localhost:3000/submit/actividades \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","accion":"login","ip":"192.168.1.1"}'
```

### 4. Registro de Pedidos
```bash
curl -X POST http://localhost:3000/submit/pedidos \
  -d "cliente=Ana Garcia&producto=Laptop&cantidad=2&total=2400"
```

## Ver los Datos Guardados

Los archivos CSV se guardan en el directorio `csv_data/`. Puedes abrirlos con:

- Excel o LibreOffice Calc
- Cualquier editor de texto
- `cat csv_data/contactos.csv` en la terminal

Ejemplo de estructura del CSV:
```csv
Timestamp,nombre,email,telefono,mensaje
2025-11-05T17:00:23.956Z,Juan Perez,juan@example.com,555-1234,Hola
2025-11-05T17:01:15.123Z,Maria Garcia,maria@example.com,555-5678,Saludos
```

## Tips

- Usa nombres de endpoint descriptivos: `clientes`, `ventas`, `registros`, etc.
- Los nombres de archivo se sanitizan automáticamente (solo letras, números, guiones y guiones bajos)
- Cada registro incluye un timestamp automático
- Los archivos CSV crecen con cada nuevo registro (modo append)
- El rate limit es de 100 solicitudes por 15 minutos por IP
