import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService, hashPassword } from './server/db.js';

const app = express();
const PORT = 3000;

// Increase payload limit for uploading computer images (Base64)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Simple Bearer Auth Middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Se requiere token de administrador.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  // Simple token format: base64(admin:admin123) or sha256 of admin:date-hash
  const expectedToken = Buffer.from('admin:weily-admin-token-secret').toString('base64');
  if (token !== expectedToken) {
    res.status(403).json({ error: 'Sesión inválida o expirada. Inicie sesión de nuevo.' });
    return;
  }
  next();
}

// ==========================================
// API ROUTES
// ==========================================

// Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
    return;
  }

  const isValid = dbService.validateUser(username, password);
  if (isValid) {
    const token = Buffer.from('admin:weily-admin-token-secret').toString('base64');
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
});

// Config Endpoint
app.get('/api/config', (req, res) => {
  res.json(dbService.getConfig());
});

app.post('/api/config', requireAdmin, (req, res) => {
  const updated = dbService.updateConfig(req.body);
  res.json(updated);
});

// Categories Endpoints
app.get('/api/categories', (req, res) => {
  res.json(dbService.getCategories());
});

app.post('/api/categories', requireAdmin, (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'El nombre de la categoría es requerido.' });
      return;
    }
    const cat = dbService.saveCategory(req.body);
    res.json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const success = dbService.deleteCategory(req.params.id);
  res.json({ success });
});

// Products Endpoints
app.get('/api/products', (req, res) => {
  let products = dbService.getProducts();
  const { category, search, activeOnly } = req.query;

  // Filter inactive in client view by default
  if (activeOnly === 'true') {
    products = products.filter(p => p.isActive);
  }

  if (category) {
    products = products.filter(p => p.categoryId === category);
  }

  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  }

  res.json(products);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const products = dbService.getProducts();
  const product = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!name || price === undefined || !categoryId) {
      res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios.' });
      return;
    }
    const prod = dbService.saveProduct(req.body);
    res.json(prod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const success = dbService.deleteProduct(req.params.id);
  res.json({ success });
});

// Stats Endpoint
app.get('/api/stats', requireAdmin, (req, res) => {
  res.json(dbService.getStats());
});

// XML Sitemap Endpoint for SEO
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://weily-store.com';
  const products = dbService.getProducts().filter(p => p.isActive);
  const categories = dbService.getCategories();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Home Page
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;

  // Categories
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
  });

  // Products
  products.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/product/${p.slug}</loc>\n    <priority>0.7</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

// ==========================================
// VITE AND STATIC ASSETS SERVING MIDDLEWARE
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Weily Server] running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
