const express = require('express');
const bodyParser = require('body-parser');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/submit', limiter);

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Ensure CSV directory exists
const csvDir = path.join(__dirname, 'csv_data');
if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir, { recursive: true });
}

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Formulario a CSV</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        h1 {
          color: #333;
        }
        form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
          font-weight: bold;
        }
        input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #45a049;
        }
        .info {
          background-color: #e7f3fe;
          padding: 10px;
          border-left: 4px solid #2196F3;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Formulario de Datos</h1>
      <div class="info">
        <strong>Información:</strong> Los datos se guardarán en un archivo CSV según el nombre que especifiques.
      </div>
      <form action="/submit/contactos" method="POST">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input type="tel" id="telefono" name="telefono">
        </div>
        <div class="form-group">
          <label for="mensaje">Mensaje:</label>
          <textarea id="mensaje" name="mensaje"></textarea>
        </div>
        <button type="submit">Enviar</button>
      </form>
      <hr>
      <h3>Prueba con diferentes endpoints:</h3>
      <ul>
        <li>Este formulario guarda en: <code>/submit/contactos</code> → <code>csv_data/contactos.csv</code></li>
        <li>Puedes cambiar la acción del formulario a <code>/submit/clientes</code> para guardar en <code>csv_data/clientes.csv</code></li>
        <li>O cualquier otro nombre: <code>/submit/[nombre]</code> → <code>csv_data/[nombre].csv</code></li>
      </ul>
    </body>
    </html>
  `);
});

// Dynamic route to handle form submissions based on URL endpoint
app.post('/submit/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const formData = req.body;
    
    // Sanitize filename to prevent path traversal - only allow alphanumeric, underscore, and hyphen
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Additional validation: ensure the filename is not empty and doesn't start with a dot
    if (!sanitizedFilename || sanitizedFilename.startsWith('.')) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Error</title>
        </head>
        <body>
          <h1>Error</h1>
          <p>Nombre de archivo inválido.</p>
          <a href="/">Volver al formulario</a>
        </body>
        </html>
      `);
    }
    
    const csvFilePath = path.join(csvDir, `${sanitizedFilename}.csv`);
    
    // Ensure the resolved path is still within csvDir to prevent path traversal
    const resolvedPath = path.resolve(csvFilePath);
    const resolvedCsvDir = path.resolve(csvDir);
    if (!resolvedPath.startsWith(resolvedCsvDir)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Error</title>
        </head>
        <body>
          <h1>Error</h1>
          <p>Ruta de archivo inválida.</p>
          <a href="/">Volver al formulario</a>
        </body>
        </html>
      `);
    }
    
    // Get all form field names
    const fieldNames = Object.keys(formData);
    
    if (fieldNames.length === 0) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Error</title>
        </head>
        <body>
          <h1>Error</h1>
          <p>No se recibieron datos en el formulario.</p>
          <a href="/">Volver al formulario</a>
        </body>
        </html>
      `);
    }
    
    // Add timestamp to the data
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = {
      timestamp,
      ...formData
    };
    
    // Check if file exists to determine headers
    const fileExists = fs.existsSync(csvFilePath);
    
    // Prepare CSV writer configuration
    const headers = [
      { id: 'timestamp', title: 'Timestamp' },
      ...fieldNames.map(name => ({ id: name, title: name }))
    ];
    
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: headers,
      append: fileExists
    });
    
    // Write data to CSV
    await csvWriter.writeRecords([dataWithTimestamp]);
    
    console.log(`Datos guardados en: ${csvFilePath}`);
    
    // Send success response with escaped HTML
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Éxito</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .success {
            background-color: #d4edda;
            color: #155724;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .data {
            background-color: white;
            padding: 15px;
            border-radius: 4px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="success">
          <h1>✓ Datos Guardados Exitosamente</h1>
          <p>Los datos se han guardado en: <strong>${escapeHtml(sanitizedFilename)}.csv</strong></p>
          <div class="data">
            <h3>Datos recibidos:</h3>
            <pre>${escapeHtml(JSON.stringify(formData, null, 2))}</pre>
          </div>
        </div>
        <a href="/">← Volver al formulario</a>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Error</title>
      </head>
      <body>
        <h1>Error al guardar datos</h1>
        <p>${escapeHtml(error.message)}</p>
        <a href="/">Volver al formulario</a>
      </body>
      </html>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
  console.log(`Los archivos CSV se guardarán en: ${csvDir}`);
});
