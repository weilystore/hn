import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  Trash2, 
  X, 
  Menu, 
  ChevronRight, 
  ArrowUp, 
  Smartphone, 
  Plus, 
  Minus, 
  LayoutDashboard, 
  Edit, 
  Trash, 
  Check, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  AlertTriangle, 
  Tags, 
  Sparkles, 
  Award, 
  Moon, 
  Sun,
  Lock,
  ArrowRight,
  SlidersHorizontal,
  ThumbsUp,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import PandaLogo from './components/PandaLogo';
import WeilyWordmark from './components/WeilyWordmark';
import { Product, Category, DashboardStats, SiteConfig } from './types';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_CONFIG } from './defaultData';

export default function App() {
  // Store Core State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('weily-products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('weily-categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_CATEGORIES;
  });
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('weily-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_CONFIG;
  });

  // Client Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentFilterTab, setCurrentFilterTab] = useState<'all' | 'deals' | 'new' | 'featured' | 'bestseller'>('all');
  
  // Shopping Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');

  // Selected Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailActiveImgIdx, setDetailActiveImgIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZooming, setIsZooming] = useState(false);

  // Theme & Layout Extra States
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('weily-theme') === 'dark';
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Administrative Panel State
  const [isAdmin, setIsAdmin] = useState(() => {
    return !!localStorage.getItem('weily-admin-token');
  });
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('weily-admin-token') || '';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<'products' | 'categories' | 'stats' | 'config'>('products');

  // Admin Forms / CRUD State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'category'; id: string; name: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchConfig();
  }, []);

  // Theme Toggler helper
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('weily-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('weily-theme', 'light');
    }
  }, [darkMode]);

  // Handle Scroll to display BackToTop button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Cart to session storage
  useEffect(() => {
    const savedCart = sessionStorage.getItem('weily-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: { product: Product; quantity: number }[]) => {
    setCart(updatedCart);
    sessionStorage.setItem('weily-cart', JSON.stringify(updatedCart));
  };

  // Helper APIs
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        localStorage.setItem('weily-products', JSON.stringify(data));
      } else {
        throw new Error('Response not OK');
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        localStorage.setItem('weily-categories', JSON.stringify(data));
      } else {
        throw new Error('Response not OK');
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        localStorage.setItem('weily-config', JSON.stringify(data));
      } else {
        throw new Error('Response not OK');
      }
    } catch (e) {
      console.error('Error fetching config:', e);
    }
  };

  const fetchStats = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      } else {
        throw new Error('Response not OK');
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
      const totalProds = products.length;
      const totalCats = categories.length;
      const lowStock = products.filter(p => p.stockStatus === 'low_stock' || (p.stockCount !== undefined && p.stockCount <= 5)).length;
      const outOfStock = products.filter(p => p.stockStatus === 'out_of_stock' || p.stockCount === 0).length;
      setAdminStats({
        totalProducts: totalProds,
        totalCategories: totalCats,
        lowStockAlerts: lowStock,
        outOfStockProducts: outOfStock
      });
    }
  };

  useEffect(() => {
    if (showAdminPanel && isAdmin) {
      fetchStats();
    }
  }, [showAdminPanel, isAdmin, products, categories]);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('weily-admin-token', data.token);
        setAdminToken(data.token);
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginUsername('');
        setLoginPassword('');
        setShowAdminPanel(true);
        showToast('¡Sesión de administrador iniciada!');
      } else {
        setLoginError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      if (loginUsername === 'admin' && loginPassword === 'PTOtela.26') {
        const fakeToken = 'YWRtaW46UFRPdGVsYS4yNg=='; // Base64 for admin:PTOtela.26
        localStorage.setItem('weily-admin-token', fakeToken);
        setAdminToken(fakeToken);
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginUsername('');
        setLoginPassword('');
        setShowAdminPanel(true);
        showToast('¡Sesión de administrador iniciada (modo offline)!');
      } else {
        setLoginError('Credenciales inválidas o error de conexión.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('weily-admin-token');
    setAdminToken('');
    setIsAdmin(false);
    setShowAdminPanel(false);
    showToast('Sesión de administrador cerrada');
  };

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Category CRUD
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ name: newCatName, description: newCatDesc })
      });
      if (res.ok) {
        setNewCatName('');
        setNewCatDesc('');
        fetchCategories();
        showToast('Categoría creada con éxito');
      } else {
        const data = await res.json();
        showToast(data.error || 'Error al crear categoría');
      }
    } catch (err) {
      const newCategory: Category = {
        id: 'cat-' + Date.now(),
        name: newCatName,
        slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newCatDesc
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('weily-categories', JSON.stringify(updated));
      setNewCatName('');
      setNewCatDesc('');
      showToast('Categoría creada con éxito (Guardado local)');
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    setDeleteTarget({ type: 'category', id, name: cat.name });
  };

  // Product CRUD Operations
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || editingProduct.price === undefined || !editingProduct.categoryId) {
      showToast('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
        showToast('Producto guardado correctamente');
      } else {
        const data = await res.json();
        showToast(data.error || 'Error al guardar producto');
      }
    } catch (err) {
      let updatedProducts = [...products];
      if (editingProduct.id) {
        updatedProducts = updatedProducts.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p);
      } else {
        const newProduct: Product = {
          ...editingProduct,
          id: 'prod-' + Date.now(),
          slug: (editingProduct.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          isActive: true,
          createdAt: new Date().toISOString()
        } as Product;
        updatedProducts.push(newProduct);
      }
      setProducts(updatedProducts);
      localStorage.setItem('weily-products', JSON.stringify(updatedProducts));
      setEditingProduct(null);
      showToast('Producto guardado correctamente (Guardado local)');
    }
  };

  const handleDeleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setDeleteTarget({ type: 'product', id, name: prod.name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null);
    try {
      if (type === 'product') {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          fetchProducts();
          showToast('Producto eliminado');
        } else {
          const data = await res.json();
          showToast(data.error || 'Error al eliminar producto');
        }
      } else if (type === 'category') {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (res.ok) {
          fetchCategories();
          fetchProducts();
          showToast('Categoría eliminada con éxito');
        } else {
          const data = await res.json();
          showToast(data.error || 'Error al eliminar categoría');
        }
      }
    } catch (err) {
      if (type === 'product') {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem('weily-products', JSON.stringify(updated));
        showToast('Producto eliminado (Local)');
      } else if (type === 'category') {
        const updatedCats = categories.filter(c => c.id !== id);
        setCategories(updatedCats);
        localStorage.setItem('weily-categories', JSON.stringify(updatedCats));
        const updatedProds = products.map(p => p.categoryId === id ? { ...p, categoryId: '' } : p);
        setProducts(updatedProds);
        localStorage.setItem('weily-products', JSON.stringify(updatedProds));
        showToast('Categoría eliminada con éxito (Local)');
      }
    }
  };

  // Multiple Image Base64 Uploader Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as any[];
    
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditingProduct(prev => {
            if (!prev) return prev;
            const existingImages = prev.images || [];
            return {
              ...prev,
              images: [...existingImages, reader.result as string]
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setEditingProduct(prev => {
      if (!prev || !prev.images) return prev;
      return {
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove)
      };
    });
  };

  // Settings update
  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        showToast('Configuración del sitio actualizada');
      } else {
        throw new Error('Response not OK');
      }
    } catch (err) {
      localStorage.setItem('weily-config', JSON.stringify(config));
      showToast('Configuración actualizada (Guardado local)');
    }
  };

  // Shopping Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockStatus === 'out_of_stock') {
      showToast('Lo sentimos, este producto está agotado');
      return;
    }
    const existingIdx = cart.findIndex(item => item.product.id === product.id);
    let updatedCart = [...cart];
    
    if (existingIdx !== -1) {
      updatedCart[existingIdx].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }
    saveCartToStorage(updatedCart);
    showToast(`"${product.name}" agregado al carrito`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCartToStorage(updated);
    showToast('Producto eliminado del carrito');
  };

  const clearCart = () => {
    saveCartToStorage([]);
    showToast('Carrito vaciado');
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartTotal = cartSubtotal;

  // Zooming Logic for Detailed Modal
  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleZoomMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({});
  };

  // WhatsApp Pedido / Checkout Trigger
  const handleCartCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName.trim() || !checkoutAddress.trim()) {
      showToast('Nombre y dirección son obligatorios para enviar el pedido');
      return;
    }

    // Prepare message
    let message = `Hola, quiero realizar el siguiente pedido:\n\n`;
    cart.forEach(item => {
      message += `* ${item.product.name}\n  Cantidad: ${item.quantity}\n  Precio: ${config.currencySymbol} ${item.product.price.toLocaleString()}\n\n`;
    });
    message += `Total: L ${cartTotal.toLocaleString()}\n\n`;
    message += `Mi nombre es: ${checkoutName}\n`;
    message += `Mi dirección es: ${checkoutAddress}\n\n`;
    message += `Gracias.`;

    const cleanPhone = config.whatsappPhone.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Reset states & order
    setShowCheckoutModal(false);
    clearCart();
    
    // Open in new tab securely
    window.open(whatsappUrl, '_blank');
  };

  // WhatsApp Quick Buy
  const handleQuickWhatsAppBuy = (product: Product) => {
    if (!product.isActive) {
      showToast('Lo sentimos, este producto no está disponible');
      return;
    }
    if (product.stockStatus === 'out_of_stock') {
      showToast('Lo sentimos, este producto está agotado');
      return;
    }
    const message = `Hola, estoy interesado en comprar este producto:\n\nNombre: ${product.name}\nPrecio: ${config.currencySymbol} ${product.price.toLocaleString()}\n\n¿Está disponible?`;
    const cleanPhone = config.whatsappPhone.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filtering products for listing
  const filteredProducts = products.filter(p => {
    // Admin sees all products; client only active ones
    if (!isAdmin && !p.isActive) return false;

    // Search query match
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category match
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;

    // Tab filter matches
    let matchesTab = true;
    if (currentFilterTab === 'deals') matchesTab = p.isDeal;
    else if (currentFilterTab === 'new') matchesTab = p.isNew;
    else if (currentFilterTab === 'featured') matchesTab = p.isFeatured;
    else if (currentFilterTab === 'bestseller') matchesTab = p.isBestSeller;

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Related products helper
  const getRelatedProducts = (product: Product) => {
    return products
      .filter(p => p.id !== product.id && p.categoryId === product.categoryId && p.isActive)
      .slice(0, 4);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      
      {/* 1. TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700"
          >
            <Check className="h-5 w-5 text-emerald-400 dark:text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TOP BANNER */}
      <div className="bg-emerald-500 text-slate-950 text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 animate-bounce" />
        <span>¡Envíos rápidos a toda Honduras! Pide directamente y paga al recibir.</span>
        <span className="hidden md:inline-block border-l border-slate-900/20 pl-2">Soporte WhatsApp: {config.whatsappPhone}</span>
      </div>

      {/* 3. PREMIUM HEADER */}
      <header className="sticky top-0 bg-slate-900 text-white shadow-xl z-40 transition-all border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-1.5 shrink-0 cursor-pointer" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); setCurrentFilterTab('all'); setShowAdminPanel(false); }}>
              <PandaLogo className="h-11 w-11 sm:h-13 sm:w-13" />
              <WeilyWordmark size="md" className="pb-0.5" />
            </div>

            {/* Comprehensive Search Bar */}
            <div className="flex-1 max-w-2xl relative hidden md:flex items-center bg-white rounded-xl overflow-hidden border border-slate-700 shadow-inner">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-100 text-slate-700 px-4 py-2.5 text-xs font-bold border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-200"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos en Weily..." 
                className="flex-1 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 transition-colors cursor-pointer">
                <Search className="h-4 w-4 font-bold" />
              </button>
            </div>

            {/* Right Header Navigation */}
            <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
              
              {/* Dark mode switcher */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all cursor-pointer"
                title="Cambiar Tema"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Admin Panel Trigger */}
              {isAdmin ? (
                <button 
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer border ${
                    showAdminPanel 
                      ? 'bg-amber-500 text-slate-950 border-amber-500' 
                      : 'bg-slate-800 text-amber-400 border-amber-500/20 hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ADMIN PANEL</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ACCEDER</span>
                </button>
              )}

              {/* Cart Summary Header Widget */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/10 transition-all cursor-pointer border border-emerald-400"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-black border-2 border-slate-900 shadow-md">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
                <span className="hidden sm:inline font-black text-xs">Carrito</span>
              </button>
            </div>

          </div>
        </div>

        {/* 4. CATEGORIES HORIZONTAL NAVIGATION BAR */}
        <nav className="bg-slate-800 text-slate-200 border-t border-slate-700 shrink-0 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 text-xs font-bold overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => { setSelectedCategory('all'); setShowAdminPanel(false); }}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${selectedCategory === 'all' ? 'text-emerald-400' : 'hover:text-white'}`}
                >
                  <Menu className="h-4 w-4" />
                  Todo
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => { setSelectedCategory(cat.id); setShowAdminPanel(false); }}
                    className={`cursor-pointer transition-colors ${selectedCategory === cat.id ? 'text-emerald-400 font-extrabold underline decoration-2 underline-offset-4' : 'hover:text-white text-slate-300'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-all ml-4 hidden md:block" onClick={() => setCurrentFilterTab('deals')}>
                🔥 Ofertas del Día
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="p-4 bg-slate-900 md:hidden flex gap-2">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en Weily..." 
          className="flex-1 px-4 py-2 rounded-xl text-sm text-slate-800 bg-white placeholder-slate-400 outline-none"
        />
        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 rounded-xl font-bold transition-all">
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* 5. MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-8">
        
        {/* If Admin view is enabled */}
        {isAdmin && showAdminPanel ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
          >
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <LayoutDashboard className="text-amber-500" />
                  Panel de Control Administrativo
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gestiona productos, inventarios, ofertas y categorías para Weily.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setAdminActiveTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveTab === 'products' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Productos
                </button>
                <button 
                  onClick={() => setAdminActiveTab('categories')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveTab === 'categories' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Categorías
                </button>
                <button 
                  onClick={() => setAdminActiveTab('stats')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveTab === 'stats' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Estadísticas
                </button>
                <button 
                  onClick={() => setAdminActiveTab('config')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveTab === 'config' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Ajustes
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* TAB CONTENT: PRODUCTS */}
            {adminActiveTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Catálogo de Productos</h3>
                  {!editingProduct && (
                    <button 
                      onClick={() => setEditingProduct({
                        name: '',
                        price: undefined,
                        description: '',
                        categoryId: categories[0]?.id || '',
                        images: [],
                        stockCount: 10,
                        isFeatured: false,
                        isNew: true,
                        isDeal: false,
                        isBestSeller: false,
                        isActive: true
                      })}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-600 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <Plus className="h-4 w-4" /> Agregar Producto
                    </button>
                  )}
                </div>

                {/* CREATE / EDIT PRODUCT FORM DIALOG BOX */}
                <AnimatePresence>
                  {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="relative bg-white dark:bg-slate-950 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
                      >
                        <button 
                          type="button" 
                          onClick={() => setEditingProduct(null)}
                          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>

                        <form onSubmit={handleSaveProduct} className="space-y-6">
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 uppercase tracking-wider">
                            {editingProduct.id ? 'Editar Producto' : 'Crear Nuevo Producto'}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nombre del Producto *</label>
                              <input 
                                type="text" 
                                required
                                value={editingProduct.name || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                placeholder="Ej: iPhone 15 Pro Max"
                                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Precio (Lempiras) *</label>
                              <input 
                                type="number" 
                                required
                                value={editingProduct.price !== undefined ? editingProduct.price : ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value === '' ? undefined : Number(e.target.value) })}
                                placeholder="Ej: 32000"
                                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Precio Anterior (Opcional)</label>
                              <input 
                                type="number" 
                                value={editingProduct.oldPrice !== undefined ? editingProduct.oldPrice : ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value === '' ? undefined : Number(e.target.value) })}
                                placeholder="Ej: 35000"
                                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Categoría *</label>
                              <select 
                                required
                                value={editingProduct.categoryId || ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                              >
                                <option value="" className="text-slate-500">Selecciona una categoría</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id} className="text-slate-800 dark:text-slate-100">{cat.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cantidad en Inventario</label>
                              <input 
                                type="number" 
                                value={editingProduct.stockCount !== undefined ? editingProduct.stockCount : ''}
                                onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: e.target.value === '' ? undefined : Number(e.target.value) })}
                                placeholder="Ej: 15"
                                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Imágenes del Producto (Subir desde PC)</label>
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">O agregar URL de Imagen de Internet (Ej: Unsplash)</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  id="imgUrlInput"
                                  placeholder="https://images.unsplash.com/photo-..."
                                  className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none placeholder-slate-400"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const val = (e.currentTarget as HTMLInputElement).value.trim();
                                      if (val) {
                                        setEditingProduct(prev => {
                                          if (!prev) return prev;
                                          return {
                                            ...prev,
                                            images: [...(prev.images || []), val]
                                          };
                                        });
                                        (e.currentTarget as HTMLInputElement).value = '';
                                        showToast('Imagen de URL agregada');
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById('imgUrlInput') as HTMLInputElement;
                                    const val = input?.value.trim();
                                    if (val) {
                                      setEditingProduct(prev => {
                                        if (!prev) return prev;
                                        return {
                                          ...prev,
                                          images: [...(prev.images || []), val]
                                        };
                                      });
                                      input.value = '';
                                      showToast('Imagen de URL agregada');
                                    }
                                  }}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all"
                                >
                                  Agregar URL
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Previews of uploaded images */}
                          {editingProduct.images && editingProduct.images.length > 0 && (
                            <div>
                              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Imágenes Cargadas:</span>
                              <div className="flex flex-wrap gap-3">
                                {editingProduct.images.map((img, idx) => (
                                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => removeUploadedImage(idx)}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Descripción del Producto</label>
                            <textarea 
                              value={editingProduct.description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              placeholder="Descripción detallada de características, especificaciones y beneficios. Soporta saltos de línea y viñetas para crear listas..."
                              rows={7}
                              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none resize-y min-h-[150px]"
                            />
                          </div>

                          {/* Checkbox Options */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-150 dark:border-slate-800/60">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={editingProduct.isFeatured || false} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                                className="rounded text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Destacado</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={editingProduct.isNew || false} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                                className="rounded text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nuevo</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={editingProduct.isDeal || false} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, isDeal: e.target.checked })}
                                className="rounded text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Oferta</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={editingProduct.isBestSeller || false} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                                className="rounded text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Más Vendido</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={editingProduct.isActive ?? true} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                                className="rounded text-emerald-500 focus:ring-emerald-500"
                              />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Activo / Visible</span>
                            </label>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button 
                              type="button" 
                              onClick={() => setEditingProduct(null)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button 
                              type="submit"
                              className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-600 cursor-pointer shadow-lg shadow-emerald-500/10 transition-colors"
                            >
                              Guardar Producto
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* PRODUCT LIST (ADMIN VIEW) */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3">Miniatura</th>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Precio</th>
                        <th className="px-4 py-3">Categoría</th>
                        <th className="px-4 py-3">Stock (Cant)</th>
                        <th className="px-4 py-3">Tags</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.map(p => {
                        const cat = categories.find(c => c.id === p.categoryId);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <img 
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=80&q=80'} 
                                alt={p.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">L {p.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{cat ? cat.name : 'Sin categoría'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                                p.stockStatus === 'available' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' :
                                p.stockStatus === 'low_stock' ? 'bg-amber-100 dark:bg-amber-950 text-amber-600' :
                                'bg-rose-100 dark:bg-rose-950 text-rose-600'
                              }`}>
                                {p.stockStatus === 'available' ? 'Disponible' : p.stockStatus === 'low_stock' ? 'Pocas unid.' : 'Agotado'} ({p.stockCount})
                              </span>
                            </td>
                            <td className="px-4 py-3 space-x-1">
                              {p.isFeatured && <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1 py-0.5 rounded">F</span>}
                              {p.isNew && <span className="text-[9px] font-bold bg-blue-500 text-white px-1 py-0.5 rounded">N</span>}
                              {p.isDeal && <span className="text-[9px] font-bold bg-rose-500 text-white px-1 py-0.5 rounded">O</span>}
                              {p.isBestSeller && <span className="text-[9px] font-bold bg-emerald-500 text-white px-1 py-0.5 rounded">B</span>}
                            </td>
                            <td className="px-4 py-3">
                              {p.isActive ? (
                                <span className="text-emerald-500 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Activo</span>
                              ) : (
                                <span className="text-slate-400 flex items-center gap-1"><EyeOff className="h-3.5 w-3.5" /> Oculto</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right space-x-1">
                              <button 
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CATEGORIES */}
            {adminActiveTab === 'categories' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Creation Form */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-150 dark:border-slate-800 pb-2 mb-4">Nueva Categoría</h4>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nombre *</label>
                        <input 
                          type="text" 
                          required
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="Ej: Calzado, Fitness..."
                          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
                        <textarea 
                          value={newCatDesc}
                          onChange={(e) => setNewCatDesc(e.target.value)}
                          placeholder="Breve descripción del departamento..."
                          rows={3}
                          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none resize-none"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Crear Categoría
                      </button>
                    </form>
                  </div>

                  {/* List of existing Categories */}
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Lista de Categorías</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map(cat => (
                        <div key={cat.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-4">
                          <div>
                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                            <span className="block text-[11px] text-slate-400 mb-2">Slug: {cat.slug}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description || 'Sin descripción'}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STATS */}
            {adminActiveTab === 'stats' && adminStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-center">
                  <Package className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <span className="block text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalProducts}</span>
                  <span className="text-xs text-slate-400">Total de Productos</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-center">
                  <Tags className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <span className="block text-2xl font-black text-slate-800 dark:text-white">{adminStats.totalCategories}</span>
                  <span className="text-xs text-slate-400">Total de Categorías</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-center">
                  <Sparkles className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <span className="block text-2xl font-black text-slate-800 dark:text-white">{adminStats.featuredProductsCount}</span>
                  <span className="text-xs text-slate-400">Productos Destacados</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-center">
                  <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                  <span className="block text-2xl font-black text-slate-800 dark:text-white">{adminStats.outOfStockCount}</span>
                  <span className="text-xs text-slate-400">Productos Agotados</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-center">
                  <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <span className="block text-2xl font-black text-slate-800 dark:text-white">{adminStats.newProductsCount}</span>
                  <span className="text-xs text-slate-400">Nuevos Ingresos</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SITE CONFIG */}
            {adminActiveTab === 'config' && (
              <form onSubmit={handleUpdateConfig} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-150 dark:border-slate-800 pb-2 mb-4">Ajustes Generales de la Tienda</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nombre del Sitio</label>
                    <input 
                      type="text" 
                      required
                      value={config.siteName}
                      onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Número de WhatsApp del Negocio (con código país)</label>
                    <input 
                      type="text" 
                      required
                      value={config.whatsappPhone}
                      onChange={(e) => setConfig({ ...config, whatsappPhone: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                      placeholder="Ej: +50497650096"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Símbolo de Moneda</label>
                    <input 
                      type="text" 
                      required
                      value={config.currencySymbol}
                      onChange={(e) => setConfig({ ...config, currencySymbol: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : null}

        {/* 6. HERO CAROUSEL BANNER & DEALS (CLIENT EXPERIENCE) */}
        {!showAdminPanel && (
          <HeroBanner 
            onExploreDeals={() => { setCurrentFilterTab('deals'); setSelectedCategory('all'); }}
            onExploreTech={() => { setSelectedCategory('cat-tec'); setCurrentFilterTab('all'); }}
            onExploreHome={() => { setSelectedCategory('cat-hog'); setCurrentFilterTab('all'); }}
          />
        )}

        {/* 7. QUICK ACCESS FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setCurrentFilterTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                currentFilterTab === 'all' 
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-lg' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Todos los Productos
            </button>
            <button 
              onClick={() => setCurrentFilterTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                currentFilterTab === 'deals' 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              🔥 Ofertas Increíbles
            </button>
            <button 
              onClick={() => setCurrentFilterTab('new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                currentFilterTab === 'new' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              ✨ Recién Llegados
            </button>
            <button 
              onClick={() => setCurrentFilterTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                currentFilterTab === 'featured' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              ⭐ Destacados Weily
            </button>
            <button 
              onClick={() => setCurrentFilterTab('bestseller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                currentFilterTab === 'bestseller' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              🏆 Los Más Vendidos
            </button>
          </div>

          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
          </div>
        </div>

        {/* 8. PRODUCTS RESPONSIVE BENTO GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(p => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-400/20 flex flex-col group transition-all duration-300 relative"
                >
                  {/* Badge overlays */}
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5">
                    {p.isDeal && p.discount && p.discount > 0 ? (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        OFERTA -{p.discount}%
                      </span>
                    ) : null}
                    {p.isNew ? (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        NUEVO
                      </span>
                    ) : null}
                    {p.isBestSeller ? (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                        🏆 TOP
                      </span>
                    ) : null}
                  </div>

                  {/* Thumbnail Container */}
                  <div 
                    onClick={() => { setSelectedProduct(p); setDetailActiveImgIdx(0); }}
                    className="relative aspect-square bg-slate-100 dark:bg-slate-950 rounded-xl mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="h-4 w-4" /> Ver Detalles
                      </span>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <span className="block text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest mb-1">
                    {categories.find(c => c.id === p.categoryId)?.name || 'Catálogo General'}
                  </span>
                  
                  <h3 
                    onClick={() => { setSelectedProduct(p); setDetailActiveImgIdx(0); }}
                    className="text-base font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2 hover:text-emerald-500 cursor-pointer min-h-[3rem]"
                  >
                    {p.name}
                  </h3>

                  {/* Stock Level representation */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-block text-[10px] font-black italic ${
                      p.stockStatus === 'available' ? 'text-emerald-500' :
                      p.stockStatus === 'low_stock' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {p.stockStatus === 'available' ? '● Disponible' : p.stockStatus === 'low_stock' ? '⚠️ Pocas unidades' : '✕ Agotado'}
                    </span>
                    {!p.isActive && (
                      <span className="inline-block text-[10px] font-black italic text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Not available.
                      </span>
                    )}
                  </div>

                  {/* Prices Layout */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      L {p.price.toLocaleString()}
                    </span>
                    {p.oldPrice && p.oldPrice > p.price ? (
                      <span className="text-xs text-slate-400 line-through">
                        L {p.oldPrice.toLocaleString()}
                      </span>
                    ) : null}
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    {!p.isActive ? (
                      <>
                        <button 
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                        >
                          <svg className="w-4 h-4 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR DESACTIVADO
                        </button>
                        <button 
                          disabled
                          className="w-full bg-slate-50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 text-[11px] font-bold py-2 rounded-xl border border-slate-200/30 dark:border-slate-800/20 cursor-not-allowed uppercase"
                        >
                          No disponible
                        </button>
                      </>
                    ) : p.stockStatus === 'out_of_stock' ? (
                      <>
                        <button 
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                        >
                          <svg className="w-4 h-4 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR DESACTIVADO
                        </button>
                        <button 
                          disabled
                          className="w-full bg-slate-50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 text-[11px] font-bold py-2 rounded-xl border border-slate-200/30 dark:border-slate-800/20 cursor-not-allowed uppercase"
                        >
                          Agotado
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleQuickWhatsAppBuy(p)}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                        >
                          {/* Brand SVG WhatsApp for crisp visual asset */}
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR POR WHATSAPP
                        </button>
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold py-2 rounded-xl text-slate-700 dark:text-slate-300 transition-all cursor-pointer uppercase"
                        >
                          Agregar al Carrito
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
            <SlidersHorizontal className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">No se encontraron productos</p>
            <p className="text-xs text-slate-500">Prueba ajustando tus filtros de categorías o modificando la búsqueda.</p>
          </div>
        )}

        {/* 9. CART FLOATING SUMMARY BOTTOM ACCORDION */}
        {cart.length > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl z-30 flex items-center justify-between gap-4 border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-black">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <div>
                <p className="text-xs font-black">Tu pedido está listo</p>
                <p className="text-[11px] text-slate-400">Subtotal: L {cartSubtotal.toLocaleString()}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs tracking-wide flex items-center gap-1 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              Completar Pedido <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </main>

      {/* 10. SPARKLE FLOATING WHATSAPP CUSTOMER HELPER */}
      <div className={`fixed right-6 flex flex-col items-end gap-3 z-30 transition-all duration-300 ${
        cart.length > 0 && !isCartOpen 
          ? 'bottom-[7.5rem]' 
          : 'bottom-6'
      }`}>
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 hidden sm:block">
          ¿Necesitas asesoría?
        </div>
        <a 
          href={`https://wa.me/${config.whatsappPhone.replace(/[^0-9+]/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-2xl hover:scale-115 hover:rotate-6 transition-all duration-300 ring-4 ring-white dark:ring-slate-950"
        >
          {/* Direct clean crisp vector launch icon */}
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>

      {/* 11. BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className={`fixed right-6 p-3 bg-slate-900/80 dark:bg-slate-800/80 border border-slate-700 backdrop-blur-md rounded-full text-white shadow-xl hover:bg-slate-800 transition-all duration-300 cursor-pointer z-35 ${
            cart.length > 0 && !isCartOpen
              ? 'bottom-56'
              : 'bottom-24'
          }`}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* 12. CART OVERLAY / SIDEBAR PANEL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-500" />
                    Tu Carrito de Compra
                  </h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length > 0 ? (
                    cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800/80">
                        <img 
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=80&q=80'} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.product.name}</h4>
                          <span className="block text-[10px] text-slate-400 mb-2">Precio: L {item.product.price.toLocaleString()}</span>
                          
                          {/* Modifier */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1">
                              <button 
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-xs font-black px-2">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-500">Tu carrito está completamente vacío.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs"
                      >
                        Comenzar a Comprar
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart Drawer Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-500">Subtotal</span>
                      <span className="text-lg font-black text-slate-800 dark:text-white">L {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 mb-6">
                      <span className="text-sm font-black">Total Estimado</span>
                      <span className="text-xl font-black text-emerald-500">L {cartTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowCheckoutModal(true)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide shadow-lg shadow-emerald-500/10 cursor-pointer"
                      >
                        REALIZAR PEDIDO POR WHATSAPP
                      </button>
                      <button 
                        onClick={clearCart}
                        className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all"
                      >
                        Vaciar Todo el Carrito
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. CLIENT CHECKOUT FORM MODAL (BEFORE WHATSAPP DISPATCH) */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">Completar Información de Entrega</h3>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCartCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Dirección de Envío Completa *</label>
                  <textarea 
                    required
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="Ej: Barrio Los Andes, 5 Calle, San Pedro Sula, Honduras..."
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none resize-none"
                  />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Al confirmar, se generará el mensaje del pedido con el listado de productos, total, tu nombre y dirección, para que lo envíes a nuestra línea oficial de soporte de Weily.
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Enviar Pedido vía WhatsApp Web / Móvil
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 14. ADMIN LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="text-amber-500" />
                  Acceso Administrativo
                </h3>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Ej: admin"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Contraseña del administrador"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Verificar Credenciales
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15. DETAILED PRODUCT MODAL WITH ACTIVE GALLERY, INTERACTIVE ZOOM AND RELATED PRODUCTS */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-start justify-center z-50 p-4 md:p-8 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto relative flex flex-col gap-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Images Gallery section */}
                <div className="space-y-4">
                  
                  {/* Big Image Viewer Container with Hover Zoom effect */}
                  <div 
                    onMouseMove={handleZoomMouseMove}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={handleZoomMouseLeave}
                    className="relative aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-850 cursor-zoom-in"
                  >
                    <img 
                      src={selectedProduct.images?.[detailActiveImgIdx] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-contain transition-transform duration-200 ease-out"
                      style={isZooming ? zoomStyle : {}}
                    />
                    
                    {/* Badge Overlay */}
                    {selectedProduct.isDeal && selectedProduct.discount && (
                      <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-md">
                        {selectedProduct.discount}% Descuento
                      </span>
                    )}
                  </div>

                  {/* Image Thumbnails Row */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {selectedProduct.images.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setDetailActiveImgIdx(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                            detailActiveImgIdx === idx ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 text-center italic">Pasa el cursor sobre la imagen para hacer zoom</p>
                </div>

                {/* Product Detail Info Section */}
                <div className="flex flex-col justify-between">
                  <div>
                    {/* Category */}
                    <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest block mb-2">
                      {categories.find(c => c.id === selectedProduct.categoryId)?.name || 'Catálogo'}
                    </span>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                      {selectedProduct.name}
                    </h2>

                    {/* Stock Status Badge */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                        selectedProduct.stockStatus === 'available' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500' :
                        selectedProduct.stockStatus === 'low_stock' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-500' :
                        'bg-rose-100 dark:bg-rose-950/50 text-rose-500'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {selectedProduct.stockStatus === 'available' ? 'Disponible en tienda' : selectedProduct.stockStatus === 'low_stock' ? 'Pocas unidades en bodega' : 'Temporalmente agotado'}
                      </span>
                      {!selectedProduct.isActive && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950/50 text-rose-500 uppercase tracking-wider">
                          ✕ Not available.
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        L {selectedProduct.price.toLocaleString()}
                      </span>
                      {selectedProduct.oldPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          L {selectedProduct.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Top Actions Buttons */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      {!selectedProduct.isActive ? (
                        <>
                          <button 
                            disabled
                            className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                          >
                            <svg className="w-5 h-5 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            COMPRAR DESACTIVADO
                          </button>
                          <button 
                            disabled
                            className="w-full border-2 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm bg-slate-50/50 dark:bg-slate-900/30"
                          >
                            <ShoppingCart className="h-4 w-4 opacity-40" /> No disponible
                          </button>
                        </>
                      ) : selectedProduct.stockStatus === 'out_of_stock' ? (
                        <>
                          <button 
                            disabled
                            className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                          >
                            <svg className="w-5 h-5 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            COMPRAR DESACTIVADO
                          </button>
                          <button 
                            disabled
                            className="w-full border-2 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm bg-slate-50/50 dark:bg-slate-900/30"
                          >
                            <ShoppingCart className="h-4 w-4 opacity-40" /> Agotado
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => { handleQuickWhatsAppBuy(selectedProduct); }}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 cursor-pointer"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            COMPRAR POR WHATSAPP AHORA
                          </button>
                          <button 
                            onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                            className="w-full border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
                          >
                            <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
                          </button>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <div className="prose dark:prose-invert max-w-none mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Detalles del Producto</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedProduct.description || 'Este grandioso producto no cuenta con descripción detallada en este momento.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {!selectedProduct.isActive ? (
                      <>
                        <button 
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                        >
                          <svg className="w-5 h-5 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR DESACTIVADO
                        </button>
                        <button 
                          disabled
                          className="w-full border-2 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm bg-slate-50/50 dark:bg-slate-900/30"
                        >
                          <ShoppingCart className="h-4 w-4 opacity-40" /> No disponible
                        </button>
                      </>
                    ) : selectedProduct.stockStatus === 'out_of_stock' ? (
                      <>
                        <button 
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed border border-slate-200/40 dark:border-slate-800/20"
                        >
                          <svg className="w-5 h-5 fill-current opacity-40" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR DESACTIVADO
                        </button>
                        <button 
                          disabled
                          className="w-full border-2 border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-600 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed text-sm bg-slate-50/50 dark:bg-slate-900/30"
                        >
                          <ShoppingCart className="h-4 w-4 opacity-40" /> Agotado
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { handleQuickWhatsAppBuy(selectedProduct); }}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          COMPRAR POR WHATSAPP AHORA
                        </button>
                        <button 
                          onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                          className="w-full border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
                        >
                          <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Related Products Section */}
              {getRelatedProducts(selectedProduct).length > 0 && (
                <div className="border-t border-slate-150 dark:border-slate-800 pt-6 mt-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Productos Relacionados</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {getRelatedProducts(selectedProduct).map(rp => (
                      <div 
                        key={rp.id} 
                        onClick={() => { setSelectedProduct(rp); setDetailActiveImgIdx(0); }}
                        className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 cursor-pointer hover:shadow-md hover:border-emerald-500/20 transition-all text-center group"
                      >
                        <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg overflow-hidden mb-2">
                          <img src={rp.images?.[0]} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-emerald-500">{rp.name}</span>
                        <span className="block text-xs font-black text-emerald-500 mt-1">L {rp.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15. CUSTOM DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                ¿Confirmar Eliminación?
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {deleteTarget.type === 'product' ? (
                  <>¿Estás seguro de que deseas eliminar permanentemente el producto <strong className="text-slate-800 dark:text-slate-200">"{deleteTarget.name}"</strong>? Esta acción no se puede deshacer.</>
                ) : (
                  <>¿Estás seguro de que deseas eliminar la categoría <strong className="text-slate-800 dark:text-slate-200">"{deleteTarget.name}"</strong>? Se desvincularán todos los productos asociados.</>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-lg shadow-rose-500/10"
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 16. ELEGANT FOOTER */}
      <Footer onBackToTop={scrollToTop} siteName={config.siteName} />

    </div>
  );
}
