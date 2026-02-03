import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ScanLine,
  Clock,
  User,
  ShoppingBag,
  Star,
  X,
  ChevronRight,
  Bell,
  ShoppingBasket,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  Plus,
  QrCode,
  Store,
  Truck,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './App.css';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Installment {
  id: string;
  dueDate: string;
  amount: number;
  penaltyFee: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface Order {
  id: string;
  orderNumber: string;
  store: string;
  totalAmount: number;
  initialPaid: number;
  date: string;
  status: 'in_progress' | 'paid';
  installments: Installment[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface Store {
  id: string;
  name: string;
  category: 'viveres' | 'comida_rapida' | 'frutas_verduras' | 'farmacia' | 'otros';
  color: string;
  products: Product[];
}

// --- Data ---
const STORES_DATA: Store[] = [
  {
    id: '1',
    name: 'Pizzería Margarita',
    category: 'comida_rapida',
    color: 'from-orange-500 to-red-600',
    products: [
      { id: 'm1', name: 'Pizza Margarita', price: 12.00, category: 'Clásicas' },
      { id: 'm2', name: 'Pizza Pepperoni', price: 14.50, category: 'Clásicas' },
      { id: 'm3', name: 'Pizza 4 Quesos', price: 15.00, category: 'Especiales' },
      { id: 'm4', name: 'Pizza Champiñones', price: 13.50, category: 'Vegetarianas' },
      { id: 'm5', name: 'Refresco 1.5L', price: 3.00, category: 'Bebidas' },
      { id: 'm6', name: 'Pan de Ajo', price: 4.50, category: 'Entradas' },
    ]
  },
  {
    id: '2',
    name: 'Mar y Tierra',
    category: 'comida_rapida',
    color: 'from-blue-600 to-teal-500',
    products: [
      { id: 'mt1', name: 'Parrilla Mixta', price: 25.00, category: 'Parrillas' },
      { id: 'mt2', name: 'Pescado Frito', price: 18.00, category: 'Mar' },
      { id: 'mt3', name: 'Solomo a la Parrilla', price: 22.00, category: 'Parrillas' },
      { id: 'mt4', name: 'Ceviche Clásico', price: 15.00, category: 'Entradas' },
      { id: 'mt5', name: 'Churrasco de Pollo', price: 16.00, category: 'Aves' },
      { id: 'mt6', name: 'Tostones Playeros', price: 6.00, category: 'Entradas' },
      { id: 'mt7', name: 'Jugo Natural', price: 3.50, category: 'Bebidas' },
    ]
  },
  {
    id: '3',
    name: 'Hamburguesas Pocho',
    category: 'comida_rapida',
    color: 'from-yellow-500 to-orange-600',
    products: [
      { id: 'p1', name: 'Pocho Burger', price: 8.50, category: 'Hamburguesas' },
      { id: 'p2', name: 'Doble Carne', price: 10.50, category: 'Hamburguesas' },
      { id: 'p3', name: 'Pollo Crispy', price: 9.00, category: 'Hamburguesas' },
      { id: 'p4', name: 'Perro Caliente', price: 4.50, category: 'Hot Dogs' },
      { id: 'p5', name: 'Papas con Cheddar', price: 5.00, category: 'Acompañantes' },
      { id: 'p6', name: 'Aros de Cebolla', price: 4.50, category: 'Acompañantes' },
      { id: 'p7', name: 'Malteada', price: 4.00, category: 'Bebidas' },
    ]
  },
  {
    id: '4',
    name: 'Bodega El Amigo',
    category: 'viveres',
    color: 'from-purple-500 to-indigo-600',
    products: [
      { id: 'b1', name: 'Harina de Maíz', price: 1.50, category: 'Despensa' },
      { id: 'b2', name: 'Arroz Premium', price: 2.20, category: 'Despensa' },
      { id: 'b3', name: 'Aceite Vegetal', price: 4.50, category: 'Despensa' },
      { id: 'b4', name: 'Pasta Corta', price: 1.80, category: 'Despensa' },
      { id: 'b5', name: 'Salsa de Tomate', price: 2.00, category: 'Salsas' },
    ]
  },
  {
    id: '5',
    name: 'Frutas Don José',
    category: 'frutas_verduras',
    color: 'from-green-500 to-emerald-600',
    products: [
      { id: 'f1', name: 'Manzanas Importadas', price: 3.50, category: 'Frutas' },
      { id: 'f2', name: 'Cambur (Kg)', price: 1.20, category: 'Frutas' },
      { id: 'f3', name: 'Aguacate', price: 4.00, category: 'Verduras' },
      { id: 'f4', name: 'Tomate de Árbol', price: 2.50, category: 'Frutas' },
    ]
  },
  {
    id: '6',
    name: 'Farmacia Salud',
    category: 'farmacia',
    color: 'from-cyan-500 to-blue-500',
    products: [
      { id: 'fa1', name: 'Vitamina C', price: 8.00, category: 'Vitaminas' },
      { id: 'fa2', name: 'Analgésico', price: 5.50, category: 'Medicinas' },
      { id: 'fa3', name: 'Alcohol', price: 2.50, category: 'Primeros Auxilios' },
    ]
  }
];



// --- VISTAS ---

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: ShoppingBasket, label: 'Tiendas', path: '/stores' },
    { icon: ScanLine, label: 'Pagar', path: '/scan', isMain: true },
    { icon: Clock, label: 'Compras', path: '/history' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];
  return (
    <div className="fixed bottom-6 left-6 right-6 bg-white shadow-2xl rounded-[2.5rem] py-3 px-8 z-[100] border border-gray-100 flex justify-between items-center">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/history' && location.pathname.startsWith('/order'));
        const Icon = item.icon;
        if (item.isMain) return (
          <button key={item.path} onClick={() => navigate(item.path)} className="relative -top-1 bg-brand-primary text-white p-4 rounded-full shadow-lg border-4 border-white active:scale-90 transition-all">
            <Icon strokeWidth={3} />
          </button>
        );
        return (
          <button key={item.path} onClick={() => navigate(item.path)} className={cn("flex flex-col items-center gap-1", isActive ? "text-brand-primary" : "text-gray-400")}>
            <Icon className="w-6 h-6" />
            <span className="text-[9px] font-bold uppercase">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const HomeView = ({ totalCredit, usedCredit }: { totalCredit: number; usedCredit: number }) => {
  const navigate = useNavigate();
  const availableCredit = totalCredit - usedCredit;
  return (
    <div className="min-h-screen pb-32 bg-[#FDFCF8] overflow-x-hidden">
      <div className="p-6 pt-8 flex flex-col bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-yellow text-white rounded-b-[4rem] pb-24 shadow-2xl relative overflow-hidden border-b-4 border-brand-yellow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

        {/* Logo PayPo Grande */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-6">
          <div className="bg-white rounded-[2rem] shadow-xl border-4 border-brand-yellow mb-2 w-28 h-28 overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img
              src="/paypo_logo.png"
              alt="PayPo Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black tracking-tight drop-shadow-md">
            Pay<span className="text-brand-yellow">Po</span>
          </h1>
        </div>

        {/* User Info */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 p-0.5 border-2 border-brand-yellow"><img src="https://ui-avatars.com/api/?name=Juan+Luis&background=fff&color=FF4700" className="w-full h-full rounded-[14px]" alt="Profile" /></div>
            <div><p className="text-brand-yellow text-[10px] font-black uppercase tracking-widest leading-none mb-1">Hola</p><h2 className="text-xl font-black">Juan Luis</h2></div>
          </div>
          <div className="relative">
            <Bell className="relative z-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-yellow rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-20">
        <div className="balance-circle layered-shadow !border-4 !border-brand-yellow shadow-[0_0_0_8px_rgba(255,193,7,0.1)]">
          <span className="text-gray-400 font-bold text-[10px] uppercase mb-1">Disponible</span>
          <span className="text-5xl font-black text-brand-primary tabular-nums tracking-tighter">${availableCredit.toFixed(0)}</span>
          <div className="flex items-center gap-1 mt-2 bg-gradient-to-r from-brand-yellow to-brand-secondary px-4 py-1.5 rounded-full border-2 border-brand-yellow/30"><Star className="w-3 h-3 text-white fill-white" /><span className="text-[9px] font-black text-white uppercase">Nivel 1</span></div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/history')}
          className="bg-white p-6 rounded-[2rem] shadow-lg border-4 border-red-100 flex flex-col items-center cursor-pointer active:scale-95 transition-all hover:border-red-200"
        >
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Deuda</p>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-black text-[#EE5253]">${usedCredit.toFixed(2)}</p>
            <ChevronRight className="w-4 h-4 text-[#EE5253]" strokeWidth={3} />
          </div>
          <p className="text-[9px] text-[#EE5253] font-bold mt-1">Pagar Cuotas</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-lg border-4 border-brand-yellow/30 flex flex-col items-center">
          <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Límite</p>
          <p className="text-2xl font-black text-brand-primary">${totalCredit.toFixed(0)}</p>
        </div>
      </div>

      {/* Banner Promocional */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-brand-yellow via-brand-secondary to-brand-primary rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl border-4 border-brand-yellow/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 bg-white/20 px-3 py-1 rounded-full inline-block">⚡ Promoción Especial</p>
            <h3 className="text-2xl font-black mb-4 leading-tight">Compra ahora y<br />paga en cuotas</h3>
            <button onClick={() => navigate('/scan')} className="bg-white text-brand-primary px-8 py-3 rounded-full text-xs font-black uppercase shadow-xl active:scale-95 transition-all border-4 border-brand-yellow">
              Empezar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="px-6 mb-6">
        <h3 className="text-xl font-black text-brand-black mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/stores')} className="bg-white p-5 rounded-[1.5rem] shadow-lg border-4 border-blue-100 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBasket className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase">Tiendas</span>
          </button>
          <button onClick={() => navigate('/scan')} className="bg-white p-5 rounded-[1.5rem] shadow-lg border-4 border-brand-yellow/50 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-yellow to-brand-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <ScanLine className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase">Pagar</span>
          </button>
          <button onClick={() => navigate('/history')} className="bg-white p-5 rounded-[1.5rem] shadow-lg border-4 border-purple-100 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase">Compras</span>
          </button>
        </div>
      </div>

      {/* Carrusel de Tiendas Destacadas */}
      <div className="px-6 mb-6">
        <h3 className="text-xl font-black text-brand-black mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
          Tiendas Destacadas
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {STORES_DATA.slice(0, 4).map((store) => (
            <div key={store.id} onClick={() => navigate(`/store/${store.id}`)} className="min-w-[160px] bg-white p-4 rounded-[2rem] shadow-lg border-4 border-gray-100 active:scale-95 transition-all hover:border-brand-yellow/50">
              <div className={`w-20 h-20 mx-auto mb-3 bg-gradient-to-br ${store.color} rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl border-2 border-brand-yellow/30`}>
                {store.name[0]}
              </div>
              <h4 className="font-black text-brand-black text-sm text-center leading-tight">{store.name}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase text-center mt-1">{store.products.length} productos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comercios Aliados */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-brand-black flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
            Todos los Comercios
          </h3>
          <button onClick={() => navigate('/stores')} className="text-brand-primary text-xs font-black uppercase bg-brand-yellow/10 px-4 py-2 rounded-full border-2 border-brand-yellow/30">Ver todos</button>
        </div>
        <div className="space-y-4">
          {STORES_DATA.slice(0, 3).map((store) => (
            <div key={store.id} onClick={() => navigate(`/store/${store.id}`)} className="bg-white p-5 rounded-[2rem] shadow-lg border-4 border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all hover:border-brand-yellow/50">
              <div className={`w-16 h-16 bg-gradient-to-br ${store.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl border-2 border-brand-yellow/30`}>
                {store.name[0]}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-brand-black text-base">{store.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-brand-yellow/20 px-2 py-0.5 rounded-full">
                    <p className="text-[9px] text-brand-primary font-black uppercase">Acepta PayPo</p>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-brand-yellow w-6 h-6" strokeWidth={3} />
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

const StoresView = () => {
  const stores = [
    { name: 'Bodega El Amigo', category: 'Abarrotes', color: 'from-orange-500 to-red-500' },
    { name: 'Farmacia Salud', category: 'Salud', color: 'from-blue-500 to-cyan-500' },
    { name: 'Zapatería Real', category: 'Calzado', color: 'from-purple-500 to-pink-500' },
    { name: 'Abarrotes Don Pepe', category: 'Abarrotes', color: 'from-green-500 to-emerald-500' },
    { name: 'Librería Escolar', category: 'Papelería', color: 'from-yellow-500 to-orange-500' },
    { name: 'Ferretería Central', category: 'Herramientas', color: 'from-gray-600 to-gray-800' },
  ];

  return (
    <div className="p-6 pb-32 bg-[#FDFCF8] min-h-screen">
      <h2 className="text-4xl font-black text-brand-primary pt-12 mb-2">Comercios</h2>
      <p className="text-gray-400 font-bold text-sm mb-8">Aliados PayPo</p>

      <div className="space-y-4">
        {stores.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg`}>{s.name[0]}</div>
              <div>
                <h4 className="font-black text-brand-black">{s.name}</h4>
                <p className="text-[9px] text-gray-400 uppercase font-black">{s.category}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-black text-gray-600">4.{Math.floor(Math.random() * 3) + 7}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

const StoreDetailView = ({ onPurchase }: { onPurchase: (s: string, t: number) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = STORES_DATA.find(s => s.id === id);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'method' | 'scan' | 'transfer' | 'success'>('method');
  const [isScanning, setIsScanning] = useState(false);

  if (!store) return null;

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProcessOrder = () => {
    setCheckoutStep('method'); // Reset step
    setIsCheckoutOpen(true);
  };

  const handleFinalize = () => {
    onPurchase(store.name, cartTotal);
    setCheckoutStep('success');
    setTimeout(() => {
      navigate('/history');
    }, 2000);
  };

  const startScan = () => {
    setCheckoutStep('scan');
    setIsScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      setIsScanning(false);
      handleFinalize();
    }, 3000);
  };

  // Agrupar productos por categoría
  const productsByCategory = store.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-40">
      {/* Header */}
      <div className={`bg-gradient-to-br ${store.color} p-6 pt-12 flex items-center gap-4 text-white rounded-b-[3rem] border-b-4 border-brand-yellow shadow-lg`}>
        <ArrowLeft onClick={() => navigate('/stores')} className="cursor-pointer" />
        <div className="flex-1">
          <h2 className="text-2xl font-black">{store.name}</h2>
          <p className="text-white/80 text-xs font-bold uppercase mt-1">{store.products.length} Productos Disponibles</p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black border-2 border-brand-yellow">
          {store.name[0]}
        </div>
      </div>

      {/* Productos por Categoría */}
      <div className="p-6 space-y-8">
        {Object.entries(productsByCategory).map(([category, products]) => (
          <div key={category}>
            <h3 className="text-xl font-black text-brand-black mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-[1.5rem] shadow-lg border-4 border-gray-100 active:scale-95 transition-all hover:border-brand-yellow/50 relative overflow-hidden group">
                  <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="font-black text-brand-black text-sm leading-tight mb-2 h-10">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-brand-primary">${product.price.toFixed(2)}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-110"
                    >
                      <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                    </button>
                  </div>
                  {/* Badge cantidad en carrito */}
                  {cart.filter(item => item.id === product.id).length > 0 && (
                    <div className="absolute top-2 right-2 bg-brand-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {cart.filter(item => item.id === product.id).length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar - Solo visible si hay items */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-6 right-6 z-[90]">
          <button
            onClick={handleProcessOrder}
            className="w-full bg-brand-primary text-white py-4 px-6 rounded-[2rem] shadow-2xl border-4 border-brand-yellow flex items-center justify-between active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-black">
                {cart.length}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black opacity-80">Total a Pagar</p>
                <p className="text-xl font-black">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <span className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
              Procesar <ChevronRight />
            </span>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl animate-float-up">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-brand-black">Finalizar Compra</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="bg-gray-100 p-2 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* STEP 1: Method Selection */}
            {checkoutStep === 'method' && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 mb-4 font-bold">¿Cómo deseas validar tu compra?</p>

                <button
                  onClick={startScan}
                  className="w-full bg-white border-4 border-brand-yellow/30 p-6 rounded-[2rem] flex items-center gap-4 active:scale-95 transition-all hover:bg-brand-yellow/5"
                >
                  <div className="w-16 h-16 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-brand-primary">
                    <QrCode className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-black text-xl text-brand-black">En Tienda</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">Escaneando código QR (Presencial)</p>
                  </div>
                </button>

                <button
                  onClick={() => setCheckoutStep('transfer')}
                  className="w-full bg-white border-4 border-blue-100 p-6 rounded-[2rem] flex items-center gap-4 active:scale-95 transition-all hover:bg-blue-50"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                    <Truck className="w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-black text-xl text-brand-black">Delivery / Online</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">Requiere abono inicial del 40%</p>
                  </div>
                </button>
              </div>
            )}

            {/* STEP 2: Scanning Logic (Presencial) */}
            {checkoutStep === 'scan' && (
              <div className="text-center py-8">
                <div className="relative w-48 h-48 mx-auto mb-6 bg-black rounded-[2rem] overflow-hidden border-4 border-brand-primary flex items-center justify-center">
                  {isScanning ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent animate-scan-line h-full w-full"></div>
                      <p className="text-white font-black animate-pulse">Buscando QR...</p>
                    </>
                  ) : (
                    <CheckCircle2 className="w-20 h-20 text-green-500" />
                  )}
                </div>
                <p className="font-black text-xl mb-2">{isScanning ? 'Escaneando Comercio...' : '¡Código Detectado!'}</p>
                <p className="text-gray-400 text-sm font-bold">Por favor espere la validación</p>
              </div>
            )}

            {/* STEP 3: Transfer Logic (Online) */}
            {checkoutStep === 'transfer' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100 text-center">
                  <p className="text-blue-600 font-black text-xs uppercase mb-2">Pago Inicial Requerido (40%)</p>
                  <p className="text-4xl font-black text-brand-primary mb-1">${(cartTotal * 0.40).toFixed(2)}</p>
                  <p className="text-gray-400 font-bold text-xs">Monto restante a financiar: ${(cartTotal * 0.60).toFixed(2)}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm space-y-2">
                  <p className="font-bold text-gray-500">Datos Bancarios:</p>
                  <p className="font-mono bg-gray-50 p-2 rounded">0102-0123-45-0000000000</p>
                  <p className="font-bold text-gray-800">Banco de Venezuela - J-123456789</p>
                </div>

                <button
                  onClick={handleFinalize}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-black shadow-lg active:scale-95 transition-all mt-4"
                >
                  Ya realicé la transferencia
                </button>
              </div>
            )}

            {/* STEP 4: Success */}
            {checkoutStep === 'success' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-brand-black mb-2">¡Compra Exitosa!</h3>
                <p className="text-gray-500 font-bold">Tu pedido ha sido procesado correctamente.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

const ScanFlow = ({ onPurchase, availableCredit }: { onPurchase: (s: string, t: number) => void, availableCredit: number }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);

  if (step === 0) return (
    <div className="fixed inset-0 bg-brand-primary z-50 flex flex-col items-center justify-center p-8">
      <div className="w-72 h-72 border-8 border-white/20 rounded-[4rem] relative flex items-center justify-center overflow-hidden">
        <ScanLine className="w-32 h-32 text-white/50 animate-pulse" />
        <motion.div animate={{ y: [-150, 150, -150] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute w-full h-1 bg-white shadow-[0_0_20px_white]" />
      </div>
      <p className="text-white font-black mt-12 text-center uppercase text-xs tracking-widest opacity-60">Escanea el QR de la tienda</p>
      <button onClick={() => setStep(1)} className="mt-12 w-full bg-white text-brand-primary font-black py-6 rounded-[2.5rem] shadow-2xl">Simular Escaneo</button>
      <X onClick={() => navigate(-1)} className="absolute top-12 left-8 text-white w-8 h-8" />
    </div>
  );

  if (step === 1) return (
    <div className="fixed inset-0 bg-[#FDFCF8] z-50 flex flex-col p-8 pt-20">
      <X onClick={() => setStep(0)} className="text-gray-300 mb-8" />
      <h2 className="text-4xl font-black text-brand-primary mb-2">Monto Real</h2>
      <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-10">Tienda: Bodega El Amigo</p>
      <div className="drop-zone flex flex-col items-center justify-center py-12 mb-12">
        <span className="text-7xl font-black text-brand-primary">${amount}</span>
        <p className="text-[10px] font-black text-gray-400 uppercase mt-4">Disponible: ${availableCredit.toFixed(0)}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 5, 10, 20, 50].map(val => (
          <button key={val} onClick={() => amount + val <= availableCredit && setAmount(prev => prev + val)} className="banknote !h-16 !w-full !m-0 !rounded-2xl denom-5">${val}</button>
        ))}
        <button onClick={() => setAmount(0)} className="col-span-3 text-gray-400 font-bold text-xs uppercase underline mt-4">Limpiar</button>
      </div>
      <button disabled={amount <= 0} onClick={() => setStep(2)} className="btn-confirm">Generar Cuotas</button>
    </div>
  );

  if (step === 2) {
    const initial = amount * 0.40;
    const cuota = (amount - initial) / 3;
    return (
      <div className="fixed inset-0 bg-[#FDFCF8] z-50 flex flex-col p-8 pt-20 overflow-y-auto pb-32">
        <h2 className="text-3xl font-black mb-8">Tu Plan de Pago</h2>
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex justify-between items-center mb-10">
          <div className="text-left"><p className="text-[10px] font-black text-gray-400 mb-1">TOTAL COMPRA</p><p className="text-4xl font-black text-brand-primary">${amount.toFixed(2)}</p></div>
          <ShoppingBag className="text-gray-100 w-12 h-12" />
        </div>
        <div className="space-y-8 pl-4 border-l-4 border-dashed border-gray-100 ml-4">
          <div className="relative flex items-center gap-6"><div className="w-6 h-6 rounded-full bg-brand-primary -ml-[26px] ring-8 ring-[#FDFCF8]"></div><div className="flex-1 bg-white p-5 rounded-3xl border border-gray-50 flex justify-between items-center"><p className="text-xs font-black">Inicial (40%)</p><p className="font-extrabold">${initial.toFixed(2)}</p></div></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="relative flex items-center gap-6"><div className="w-3 h-3 rounded-full bg-gray-200 -ml-[19px] ring-8 ring-[#FDFCF8]"></div><div className="flex-1 opacity-50 bg-white p-4 rounded-2xl flex justify-between items-center"><p className="text-xs font-bold text-gray-400">Cuota {i}</p><p className="font-bold text-gray-400">${cuota.toFixed(2)}</p></div></div>
          ))}
        </div>
        <div className="flex-1 py-10" />
        <button onClick={() => { onPurchase("Bodega El Amigo", amount); navigate('/history'); }} className="btn-confirm uppercase">Confirmar y Pagar</button>
        <button onClick={() => setStep(1)} className="mt-4 text-gray-400 font-bold text-xs uppercase mx-auto">Atrás</button>
      </div>
    );
  }
  return null;
};

const HistoryView = ({ orders }: { orders: Order[] }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 pt-16 min-h-screen pb-32 bg-[#FDFCF8]">
      <h2 className="text-2xl font-black mb-8">Mis compras</h2>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-400 font-bold">No tienes compras aún</p>
          <button onClick={() => navigate('/scan')} className="mt-6 bg-brand-primary text-white px-8 py-3 rounded-full font-black text-sm">
            Hacer primera compra
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} onClick={() => navigate(`/order/${o.id}`)} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex justify-between items-center active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-brand-primary">{o.store[0]}</div>
                <div><h4 className="font-black text-black">{o.store}</h4><p className="text-[10px] font-bold text-gray-400">{o.date}</p></div>
              </div>
              <div className="text-right"><p className="text-xl font-black text-black">${o.totalAmount.toFixed(2)}</p><p className="text-[9px] font-black text-brand-primary uppercase">{o.status === 'in_progress' ? 'En Progreso' : 'Pagado'}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetailView = ({ orders, onPay }: { orders: Order[], onPay: (oid: string, iid: string) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);
  if (!order) return null;

  const pending = order.installments.filter(i => i.status !== 'paid');
  const next = pending[0];

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-40">
      <div className="bg-brand-primary p-6 pt-12 flex items-center gap-4 text-white rounded-b-[3rem]">
        <ArrowLeft onClick={() => navigate('/history')} />
        <h2 className="flex-1 text-center font-black text-lg pr-8">Orden #{order.orderNumber}</h2>
      </div>
      <div className="p-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 text-center mb-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pendiente</p>
          <h3 className="text-5xl font-black text-brand-primary">${pending.reduce((a, b) => a + b.amount, 0).toFixed(2)}</h3>
          <div className="mt-4 bg-gray-50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-primary h-full transition-all" style={{ width: `${(1 - pending.length / 3) * 100}%` }} />
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex gap-6 items-start opacity-70">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-lg"><CheckCircle2 className="w-4 h-4" /></div>
            <div className="flex-1 border-b border-gray-50 pb-4 flex justify-between"><div><p className="font-black text-black">Inicial (40%)</p><p className="text-[10px] text-green-500 font-black uppercase">PAGADO</p></div><p className="font-black text-black">${order.initialPaid.toFixed(2)}</p></div>
          </div>
          {order.installments.map((inst, i) => (
            <div key={inst.id} className={cn("flex gap-6 items-start", inst.status === 'paid' ? 'opacity-70' : '')}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg", inst.status === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400')}>
                {inst.status === 'paid' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
              </div>
              <div className="flex-1 border-b border-gray-50 pb-4 flex justify-between"><div><p className="font-black text-black">Cuota {i + 1}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{inst.dueDate}</p></div><p className="font-black text-black">${inst.amount.toFixed(2)}</p></div>
            </div>
          ))}
        </div>
      </div>
      {next && (
        <div className="fixed bottom-32 left-8 right-8 z-50">
          <button onClick={() => { onPay(order.id, next.id); alert("Cuota pagada con éxito"); }} className="btn-confirm !py-5 !text-lg !shadow-orange-500/40">PAGAR SIGUIENTE CUOTA: ${next.amount.toFixed(2)}</button>
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ availableCredit }: { availableCredit: number }) => (
  <div className="p-6 pt-20 flex flex-col items-center pb-32 bg-[#FDFCF8] min-h-screen">
    <div className="w-32 h-32 rounded-[3rem] bg-brand-primary/10 p-2 mb-6 ring-4 ring-white shadow-xl"><img src="https://ui-avatars.com/api/?name=Juan+Luis&background=FF4700&color=fff" className="w-full h-full rounded-[2.5rem]" alt="Profile" /></div>
    <h2 className="text-3xl font-black mb-1">Juan Luis</h2>
    <div className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-12 flex items-center gap-2"><Star className="w-3 h-3 fill-current" /> Socio Nivel 1</div>
    <div className="w-full bg-white p-8 rounded-[3rem] shadow-sm flex flex-col gap-6 mb-6">
      <div className="flex justify-between items-center"><p className="font-black text-gray-400 text-xs uppercase">Crédito Disponible</p><p className="text-2xl font-black text-brand-primary">${availableCredit.toFixed(0)}</p></div>
      <div className="h-px bg-gray-50" />
      <div className="flex justify-between items-center"><p className="font-black text-gray-400 text-xs uppercase">Compras Totales</p><p className="text-2xl font-black text-gray-600">0</p></div>
    </div>
    <button className="w-full bg-red-50 text-red-500 p-6 rounded-[3rem] flex items-center justify-center gap-4 font-black border border-red-100">
      <LogOut className="w-5 h-5" /> Cerrar Sesión
    </button>
  </div>
);

// --- APP PRINCIPAL ---

function App() {
  const [totalCredit] = useState(300.00);
  const [usedCredit, setUsedCredit] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);

  const availableCredit = totalCredit - usedCredit;

  const handleNewPurchase = (store: string, total: number) => {
    const initial = total * 0.40;
    const debt = total - initial;
    if (debt > availableCredit) {
      alert("No tienes cupo suficiente.");
      return;
    }
    setUsedCredit(prev => prev + debt);
    const today = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: Math.floor(10000000 + Math.random() * 90000000).toString(),
      store,
      totalAmount: total,
      initialPaid: initial,
      date: `Hoy, ${formatDate(today)}`,
      status: 'in_progress',
      installments: [14, 28, 42].map((days, i) => ({
        id: `inst_${Date.now()}_${i}`,
        dueDate: formatDate(new Date(today.getTime() + days * 24 * 60 * 60 * 1000)),
        amount: debt / 3,
        penaltyFee: 0,
        status: 'pending' as const
      }))
    };
    setOrders([newOrder, ...orders]);
  };

  const handlePayInstallment = (orderId: string, instId: string) => {
    let amountReleased = 0;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newInstallments = o.installments.map(inst => {
          if (inst.id === instId && inst.status !== 'paid') {
            amountReleased = inst.amount;
            return { ...inst, status: 'paid' as const };
          }
          return inst;
        });
        const isFullyPaid = newInstallments.every(i => i.status === 'paid');
        return { ...o, installments: newInstallments, status: isFullyPaid ? 'paid' : 'in_progress' };
      }
      return o;
    }));
    if (amountReleased > 0) setUsedCredit(prev => Math.max(0, prev - amountReleased));
  };

  return (
    <Router>
      <div className="font-sans antialiased text-brand-text bg-[#FDFCF8] min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomeView totalCredit={totalCredit} usedCredit={usedCredit} />} />
          <Route path="/stores" element={<StoresView />} />
          <Route path="/store/:id" element={<StoreDetailView onPurchase={handleNewPurchase} />} />
          <Route path="/scan" element={<ScanFlow onPurchase={handleNewPurchase} availableCredit={availableCredit} />} />
          <Route path="/history" element={<HistoryView orders={orders} />} />
          <Route path="/order/:id" element={<OrderDetailView orders={orders} onPay={handlePayInstallment} />} />
          <Route path="/profile" element={<ProfileView availableCredit={availableCredit} />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
