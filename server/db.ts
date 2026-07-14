import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Category, Product, SiteConfig, DashboardStats } from '../src/types.js';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'weily_db.json');

// Interface for DB Structure
interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  users: {
    id: string;
    username: string;
    passwordHash: string; // SHA-256
    role: string;
  }[];
  config: SiteConfig;
}

// SHA-256 Hashing helper
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial Data Setup
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-tec', name: 'Tecnología', slug: 'tecnologia', description: 'Dispositivos, gadgets y accesorios tecnológicos de última generación.' },
  { id: 'cat-hog', name: 'Hogar', slug: 'hogar', description: 'Todo lo necesario para decorar y equipar tu hogar.' },
  { id: 'cat-coc', name: 'Cocina', slug: 'cocina', description: 'Electrodomésticos y utensilios prácticos para tu cocina.' },
  { id: 'cat-sal', name: 'Salud', slug: 'salud', description: 'Productos para cuidar de tu salud y bienestar diario.' },
  { id: 'cat-bel', name: 'Belleza', slug: 'belleza', description: 'Artículos de cuidado personal, maquillaje y fragancias.' },
  { id: 'cat-dep', name: 'Deportes', slug: 'deportes', description: 'Equipamiento y ropa deportiva para mantenerte en forma.' },
  { id: 'cat-mas', name: 'Mascotas', slug: 'mascotas', description: 'Alimentos y accesorios para el consentido de la casa.' },
  { id: 'cat-her', name: 'Herramientas', slug: 'herramientas', description: 'Herramientas de alta calidad para tus proyectos.' },
  { id: 'cat-veh', name: 'Vehículos', slug: 'vehiculos', description: 'Accesorios y repuestos para tu auto o motocicleta.' },
  { id: 'cat-ofi', name: 'Oficina', slug: 'oficina', description: 'Suministros y muebles para optimizar tu espacio de trabajo.' }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max Titanium',
    slug: 'iphone-15-pro-max-titanium',
    price: 32000,
    oldPrice: 35000,
    discount: 9,
    description: 'El iPhone 15 Pro Max cuenta con un diseño de titanio de calidad aeroespacial, resistente y ligero. Chip A17 Pro revolucionario, sistema de cámaras ultra potente de 48 MP y puerto USB-C con velocidades USB 3.',
    categoryId: 'cat-tec',
    stockStatus: 'available',
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1565849511593-ed31378874fa?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: true,
    isNew: true,
    isDeal: true,
    isBestSeller: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Audífonos Inalámbricos Sony WH-1000XM4',
    slug: 'sony-wh-1000xm4-wireless',
    price: 7500,
    oldPrice: 9000,
    discount: 17,
    description: 'Audífonos de diadema con cancelación de ruido de primer nivel mundial. Hasta 30 horas de duración de batería, carga rápida, controles táctiles y sensor de proximidad para reproducción inteligente.',
    categoryId: 'cat-tec',
    stockStatus: 'available',
    stockCount: 8,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: true,
    isNew: true,
    isDeal: true,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Humidificador Ultrasónico Inteligente',
    slug: 'humidificador-ultrasonic-inteligente',
    price: 1200,
    oldPrice: 1600,
    discount: 25,
    description: 'Humidificador de niebla fría ultrasónico de 4L de capacidad con conexión Wi-Fi para control por aplicación móvil. Súper silencioso, apagado automático sin agua y difusor de aceites esenciales integrado.',
    categoryId: 'cat-hog',
    stockStatus: 'available',
    stockCount: 25,
    images: [
      'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: false,
    isDeal: true,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Lámpara de Escritorio LED Minimalista',
    slug: 'lampara-escritorio-led-minimalista',
    price: 850,
    description: 'Lámpara de diseño nórdico con puerto de carga USB. 5 modos de brillo ajustables, luz suave y sin parpadeo ideal para proteger la vista durante largas jornadas de lectura o trabajo en oficina.',
    categoryId: 'cat-hog',
    stockStatus: 'low_stock',
    stockCount: 4,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: true,
    isDeal: false,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Cafetera Espresso Automática Premium',
    slug: 'cafetera-espresso-automatica-premium',
    price: 4500,
    oldPrice: 5200,
    discount: 13,
    description: 'Prepara café espresso, cappuccino o latte macchiato con un solo toque. Bomba italiana de 15 bares que garantiza una extracción perfecta de crema y aroma. Espumador de leche de acero inoxidable ajustable.',
    categoryId: 'cat-coc',
    stockStatus: 'available',
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: true,
    isNew: false,
    isDeal: true,
    isBestSeller: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Freidora de Aire Digital XL 5.5L',
    slug: 'freidora-aire-digital-xl',
    price: 2800,
    oldPrice: 3500,
    discount: 20,
    description: 'Cocina tus platos favoritos con hasta un 85% menos de grasa. Panel digital táctil con 8 programas preestablecidos de cocción rápida. Canasta antiadherente libre de PFOA apta para lavavajillas.',
    categoryId: 'cat-coc',
    stockStatus: 'available',
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: false,
    isDeal: true,
    isBestSeller: true,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Termo Deportivo de Acero Inoxidable',
    slug: 'termo-deportivo-acero-inoxidable',
    price: 450,
    description: 'Botella de agua térmica con doble pared aislada al vacío. Mantiene las bebidas frías por 24 horas y calientes por 12 horas. Fabricado con acero inoxidable 18/8 libre de BPA. Incluye dos tapas diferentes.',
    categoryId: 'cat-dep',
    stockStatus: 'available',
    stockCount: 45,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: false,
    isDeal: false,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Tapete de Yoga Profesional Ecológico',
    slug: 'tapete-yoga-profesional-ecologico',
    price: 650,
    description: 'Tapete de yoga fabricado en material TPE ecológico biodegradable, antideslizante de doble cara, con líneas de alineación del cuerpo grabadas con láser para una práctica perfecta y segura.',
    categoryId: 'cat-dep',
    stockStatus: 'low_stock',
    stockCount: 2,
    images: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: true,
    isDeal: false,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Kit de Cuidado de la Piel Orgánico',
    slug: 'kit-cuidado-piel-organico',
    price: 1400,
    description: 'Set completo de cuidado facial que incluye limpiador botánico, tónico hidratante de rosas, serum de vitamina C y crema nutritiva de noche. Ingredientes 100% orgánicos cruelty-free.',
    categoryId: 'cat-bel',
    stockStatus: 'available',
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: true,
    isNew: true,
    isDeal: false,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Cepillo Alisador de Cabello Iónico',
    slug: 'cepillo-alisador-cabello-ionico',
    price: 950,
    oldPrice: 1250,
    discount: 24,
    description: 'Cepillo alisador con tecnología de calentamiento cerámico rápido MCH y generador de iones negativos doble para eliminar el encrespamiento y dejar tu cabello brillante y suave en minutos.',
    categoryId: 'cat-bel',
    stockStatus: 'out_of_stock',
    stockCount: 0,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    ],
    isFeatured: false,
    isNew: false,
    isDeal: true,
    isBestSeller: false,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'Weily',
  whatsappPhone: '+50497650096',
  currencySymbol: 'L'
};

const DEFAULT_USERS = [
  {
    id: 'admin-user',
    username: 'admin',
    // Password 'PTOtela.26'
    passwordHash: hashPassword('PTOtela.26'),
    role: 'admin'
  }
];

// Helper to ensure database file exists
function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      users: DEFAULT_USERS,
      config: DEFAULT_CONFIG
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('Database initialized successfully at:', DB_FILE);
  } else {
    // Read and merge any missing fields (robust self-healing schema migration)
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as DatabaseSchema;
      let modified = false;
      if (!data.categories || data.categories.length === 0) {
        data.categories = DEFAULT_CATEGORIES;
        modified = true;
      }
      if (!data.products) {
        data.products = [];
        modified = true;
      }
      if (!data.users || data.users.length === 0) {
        data.users = DEFAULT_USERS;
        modified = true;
      }
      if (!data.config) {
        data.config = DEFAULT_CONFIG;
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error healing database schema:', e);
    }
  }
}

// Read database
function readDB(): DatabaseSchema {
  initDatabase();
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write database
function writeDB(data: DatabaseSchema) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbService = {
  // CONFIG SERVICES
  getConfig(): SiteConfig {
    return readDB().config;
  },

  updateConfig(newConfig: Partial<SiteConfig>): SiteConfig {
    const data = readDB();
    data.config = { ...data.config, ...newConfig };
    writeDB(data);
    return data.config;
  },

  // USERS SERVICES
  validateUser(username: string, passwordPlain: string): boolean {
    const data = readDB();
    const hash = hashPassword(passwordPlain);
    return data.users.some(u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === hash);
  },

  // CATEGORY SERVICES
  getCategories(): Category[] {
    return readDB().categories;
  },

  saveCategory(category: Partial<Category> & { name: string }): Category {
    const data = readDB();
    const slug = category.name.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    if (category.id) {
      // Edit
      const index = data.categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        data.categories[index] = {
          ...data.categories[index],
          ...category,
          slug: category.slug || slug
        };
        writeDB(data);
        return data.categories[index];
      }
    }

    // Create
    const newCat: Category = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name,
      slug: category.slug || slug,
      description: category.description || ''
    };
    data.categories.push(newCat);
    writeDB(data);
    return newCat;
  },

  deleteCategory(id: string): boolean {
    const data = readDB();
    const initialLen = data.categories.length;
    data.categories = data.categories.filter(c => c.id !== id);
    
    // Deleting category should deactivate or reset product categories
    data.products = data.products.map(p => {
      if (p.categoryId === id) {
        return { ...p, categoryId: '' };
      }
      return p;
    });

    writeDB(data);
    return data.categories.length < initialLen;
  },

  // PRODUCT SERVICES
  getProducts(): Product[] {
    return readDB().products;
  },

  saveProduct(product: Partial<Product> & { name: string; price: number; categoryId: string }): Product {
    const data = readDB();
    const slug = product.name.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    // Automatic calculation of stockStatus based on stockCount
    let stockStatus: Product['stockStatus'] = 'available';
    const stockCount = product.stockCount !== undefined ? Number(product.stockCount) : 0;
    if (stockCount === 0) {
      stockStatus = 'out_of_stock';
    } else if (stockCount <= 5) {
      stockStatus = 'low_stock';
    }

    // Automatic calculation of discount if oldPrice is present and greater than price
    let discount = product.discount || 0;
    if (product.oldPrice && product.oldPrice > product.price) {
      discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    } else {
      discount = 0;
    }

    if (product.id) {
      // Edit
      const index = data.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        data.products[index] = {
          ...data.products[index],
          ...product,
          slug: product.slug || slug,
          stockStatus,
          stockCount,
          discount,
          images: product.images || data.products[index].images,
          isFeatured: !!product.isFeatured,
          isNew: !!product.isNew,
          isDeal: !!product.isDeal,
          isBestSeller: !!product.isBestSeller,
          isActive: product.isActive !== undefined ? !!product.isActive : data.products[index].isActive
        };
        writeDB(data);
        return data.products[index];
      }
    }

    // Create
    const newProd: Product = {
      id: product.id || `prod-${Date.now()}`,
      name: product.name,
      slug: product.slug || slug,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
      discount,
      description: product.description || '',
      categoryId: product.categoryId,
      stockStatus,
      stockCount,
      images: product.images || [],
      isFeatured: !!product.isFeatured,
      isNew: !!product.isNew,
      isDeal: !!product.isDeal,
      isBestSeller: !!product.isBestSeller,
      isActive: product.isActive !== undefined ? !!product.isActive : true,
      createdAt: new Date().toISOString()
    };
    data.products.push(newProd);
    writeDB(data);
    return newProd;
  },

  deleteProduct(id: string): boolean {
    const data = readDB();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    writeDB(data);
    return data.products.length < initialLen;
  },

  // DASHBOARD STATS
  getStats(): DashboardStats {
    const products = this.getProducts();
    const categories = this.getCategories();

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      featuredProductsCount: products.filter(p => p.isFeatured).length,
      outOfStockCount: products.filter(p => p.stockStatus === 'out_of_stock').length,
      newProductsCount: products.filter(p => p.isNew).length
    };
  }
};
