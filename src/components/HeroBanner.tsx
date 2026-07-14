import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Percent, Zap } from 'lucide-react';

interface HeroBannerProps {
  onExploreDeals: () => void;
  onExploreTech: () => void;
  onExploreHome: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: 'Tecnología Premium a Tu Alcance',
    subtitle: 'Descubre los últimos dispositivos móviles, audífonos inteligentes y gadgets de alta gama con envíos rápidos.',
    badge: 'Nueva Colección',
    buttonText: 'Explorar Tecnología',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    color: 'from-blue-600/90 to-slate-900/90',
    tag: 'tech'
  },
  {
    id: 2,
    title: 'Renueva Tu Hogar y Cocina',
    subtitle: 'Electrodomésticos inteligentes y accesorios elegantes diseñados para simplificar tu vida y embellecer tu entorno.',
    badge: 'Hasta 25% OFF',
    buttonText: 'Ver Artículos del Hogar',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    color: 'from-amber-600/90 to-slate-900/90',
    tag: 'home'
  },
  {
    id: 3,
    title: 'Super Ofertas de la Semana',
    subtitle: 'Descuentos increíbles en productos seleccionados. No te pierdas la oportunidad de comprar al mejor precio de Honduras.',
    badge: 'Descuentos de Locura',
    buttonText: 'Ver Ofertas',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    color: 'from-rose-600/90 to-slate-900/90',
    tag: 'deals'
  }
];

export default function HeroBanner({ onExploreDeals, onExploreTech, onExploreHome }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleAction = (tag: string) => {
    if (tag === 'tech') onExploreTech();
    else if (tag === 'home') onExploreHome();
    else onExploreDeals();
  };

  return (
    <div className="relative bg-slate-950 h-[380px] sm:h-[450px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl border border-slate-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with lazy load fallback */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform"
            style={{ backgroundImage: `url('${SLIDES[current].image}')` }}
          />

          {/* Color Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].color} mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-3xl z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/20 backdrop-blur-md mb-4 self-start"
            >
              <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
              {SLIDES[current].badge}
            </motion.div>

            <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4"
            >
              {SLIDES[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-200 text-sm sm:text-base md:text-lg mb-6 leading-relaxed max-w-xl"
            >
              {SLIDES[current].subtitle}
            </motion.p>

            <motion.button
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(SLIDES[current].tag)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 transition-all self-start cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              {SLIDES[current].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/10 backdrop-blur-sm z-20 transition-all cursor-pointer hidden sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/10 backdrop-blur-sm z-20 transition-all cursor-pointer hidden sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
