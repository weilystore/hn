import { Heart, Shield, HelpCircle, PhoneCall, ArrowUp } from 'lucide-react';
import PandaLogo from './PandaLogo';
import WeilyWordmark from './WeilyWordmark';

interface FooterProps {
  onBackToTop: () => void;
  siteName: string;
}

export default function Footer({ onBackToTop, siteName }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800" id="weily-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <span className="flex items-center gap-1.5 text-2xl font-black text-white tracking-wider mb-5">
              <PandaLogo className="h-9 w-9" />
              <WeilyWordmark size="sm" className="pb-0.5" />
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tu tienda online premium de confianza. Inspirados en brindarte la mejor experiencia de compra, con envíos rápidos y atención personalizada directa por WhatsApp.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Categorías Populares</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Tecnología & Dispositivos</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Hogar & Decoración</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Cocina & Electrodomésticos</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Salud & Cuidado Personal</a></li>
            </ul>
          </div>

          {/* Client support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Información & Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/sitemap.xml" target="_blank" className="hover:text-amber-500 transition-colors">Sitemap XML (SEO)</a></li>
              <li><span className="text-slate-400">Envíos rápidos a toda Honduras</span></li>
              <li><span className="text-slate-400">Garantía de satisfacción del 100%</span></li>
              <li><span className="text-slate-400">Compras 100% seguras por WhatsApp</span></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Atención al Cliente</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-500" />
                <span className="text-slate-200 font-medium">+504 9765-0096</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Panel Admin Protegido</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <HelpCircle className="h-4 w-4 text-amber-500" />
                <span>Soporte 24/7 disponible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {siteName}. Todos los derechos reservados. Diseñado para un rendimiento premium y SEO optimizado.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer">Términos de Servicio</span>
            <span className="hover:text-slate-300 cursor-pointer">Política de Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
