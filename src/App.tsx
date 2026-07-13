import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronDown, MapPin, Search, Menu, ChevronLeft,
  Home, Database, FileText, Briefcase, Activity, BarChart2, MessageSquare, Settings,
  Newspaper, Phone, Globe, User, BookOpen, LayoutGrid, Cpu, Network, Zap, ShieldCheck,
  Instagram, Twitter, Facebook, Send, Youtube
} from 'lucide-react';

import { InteractiveMap } from './components/InteractiveMap';
import { MinistryLogo } from './components/Logo';
import { ProjectsModule } from './components/ProjectsModule';
import geoData from './kazakhstan.json';

// --- DATA ---
interface Region {
  id: string;
  name: string;
  coordinates: [number, number];
  sez: number;
  iz: number;
  zones: { name: string; type: 'СЭЗ' | 'ИЗ' }[];
}

const REGIONS: Region[] = [
  { id: 'astana', name: 'г. Астана', coordinates: [71.4304, 51.1271], sez: 2, iz: 0, zones: [{name: 'Астана – новый город', type: 'СЭЗ'}, {name: 'Астана-Технополис', type: 'СЭЗ'}] },
  { id: 'almaty', name: 'г. Алматы', coordinates: [76.8512, 43.2220], sez: 1, iz: 1, zones: [{name: 'ПИТ', type: 'СЭЗ'}, {name: 'Индустриальная зона Алматы', type: 'ИЗ'}] },
  { id: 'shymkent', name: 'г. Шымкент', coordinates: [69.5901, 42.3417], sez: 1, iz: 3, zones: [{name: 'Оңтүстік', type: 'СЭЗ'}, {name: 'Тассай', type: 'ИЗ'}, {name: 'Жулдыз', type: 'ИЗ'}, {name: 'Бозарык', type: 'ИЗ'}] },
  { id: 'mangystau', name: 'Мангистауская обл.', coordinates: [53.5, 44.5], sez: 1, iz: 0, zones: [{name: 'Морпорт Актау', type: 'СЭЗ'}] },
  { id: 'karaganda', name: 'Карагандинская обл.', coordinates: [73.4, 48.8], sez: 1, iz: 1, zones: [{name: 'Сарыарка', type: 'СЭЗ'}, {name: 'Саран', type: 'ИЗ'}] },
  { id: 'zhetysu', name: 'Жетысуская обл.', coordinates: [78.5, 45.0], sez: 1, iz: 0, zones: [{name: 'Хоргос', type: 'СЭЗ'}] },
  { id: 'aktobe', name: 'Актюбинская обл.', coordinates: [58.0, 48.5], sez: 1, iz: 0, zones: [{name: 'Актобе', type: 'СЭЗ'}] },
  { id: 'pavlodar', name: 'Павлодарская обл.', coordinates: [76.9, 52.3], sez: 1, iz: 0, zones: [{name: 'Павлодар', type: 'СЭЗ'}] },
  { id: 'sko', name: 'СКО', coordinates: [69.1, 53.9], sez: 1, iz: 0, zones: [{name: 'Qyzyljar', type: 'СЭЗ'}] },
  { id: 'kostanay', name: 'Костанайская обл.', coordinates: [64.5, 51.5], sez: 0, iz: 1, zones: [{name: 'Костанай', type: 'ИЗ'}] },
  { id: 'almatinskaya', name: 'Алматинская обл.', coordinates: [76.9, 44.5], sez: 1, iz: 1, zones: [{name: 'Alatau', type: 'СЭЗ'}, {name: 'Береке', type: 'ИЗ'}] },
  { id: 'turkestan', name: 'Туркестанская обл.', coordinates: [68.2, 43.3], sez: 1, iz: 4, zones: [{name: 'Turkistan', type: 'СЭЗ'}, {name: 'Кентау', type: 'ИЗ'}, {name: 'Туркестан', type: 'ИЗ'}, {name: 'Бадам', type: 'ИЗ'}, {name: 'Махтаарал', type: 'ИЗ'}] },
  { id: 'atyrau', name: 'Атырауская обл.', coordinates: [52.3, 47.1], sez: 1, iz: 0, zones: [{name: 'НИНТ', type: 'СЭЗ'}] },
  { id: 'zhambyl', name: 'Жамбылская обл.', coordinates: [71.3, 44.2], sez: 1, iz: 0, zones: [{name: 'Тараз', type: 'СЭЗ'}] },
  { id: 'kyzylorda', name: 'Кызылординская обл.', coordinates: [63.5, 45.2], sez: 1, iz: 0, zones: [{name: 'Байконур', type: 'СЭЗ'}] },
  { id: 'zko', name: 'ЗКО', coordinates: [50.8, 50.2], sez: 0, iz: 1, zones: [{name: 'Орал', type: 'ИЗ'}] },
  { id: 'abai', name: 'Абай обл.', coordinates: [80.2, 48.5], sez: 0, iz: 1, zones: [{name: 'Өндіріс', type: 'ИЗ'}] },
  { id: 'vko', name: 'ВКО', coordinates: [82.6, 48.5], sez: 0, iz: 1, zones: [{name: 'Өскемен', type: 'ИЗ'}] },
  { id: 'ulytau', name: 'Улытауская обл.', coordinates: [67.5, 48.0], sez: 0, iz: 0, zones: [] },
  { id: 'akmola', name: 'Акмолинская обл.', coordinates: [69.4, 51.5], sez: 0, iz: 1, zones: [{name: 'Aqmola', type: 'ИЗ'}] },
];

// --- COMPONENTS ---

const StatCard = ({ title, value, subtitle, delay, icon: Icon, imageUrl }: { title: string, value: string, subtitle: string, delay: number, icon: any, imageUrl: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-white to-blue-50/10 hover:to-blue-50/30 rounded-xl border border-blue-200 hover:border-blue-400/80 flex relative overflow-hidden group hover:shadow-[0_12px_28px_rgba(37,99,235,0.08)] transition-all duration-300 h-[120px] shadow-[0_4px_16px_rgba(37,99,235,0.03)]"
    >
      {/* Sleek side color indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 group-hover:bg-amber-400 transition-colors z-20"></div>

      {/* Left side content (62% width) */}
      <div className="w-[62%] p-3.5 flex items-center justify-between relative z-10 min-w-0 h-full">
        {/* Left part of this block: Logo on top, description below */}
        <div className="flex flex-col justify-between h-full min-w-0 flex-1">
          {/* Logo/Icon at the top */}
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 flex items-center justify-center border border-blue-100/30 transition-colors duration-300 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          
          {/* Description under the logo */}
          <div className="min-w-0 mt-1.5">
            <div className="text-[12px] font-extrabold text-slate-800 leading-tight truncate" title={title}>{title}</div>
            <div className="text-[9.5px] text-slate-400 font-sans font-bold uppercase tracking-[0.05em] truncate">{subtitle}</div>
          </div>
        </div>

        {/* Right part of this block: Big indicator number */}
        <div className="shrink-0 flex items-center justify-center pl-2 pr-1 h-full">
          <div className="text-[38px] sm:text-[42px] font-sans font-black text-blue-950 tracking-tighter leading-none group-hover:scale-105 transition-transform duration-300">
            {value}
          </div>
        </div>
      </div>

      {/* Right side Image (38% width), full solid non-transparent image with a sharp diagonal clip */}
      <div 
        className="w-[38%] relative h-full overflow-hidden shrink-0 bg-white"
        style={{ clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
};

// --- NEWS SECTION (BLUE THEMED) ---
const NewsSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-[#0f2b5c] via-[#164082] to-[#205cb3] -mx-6 px-8 py-12 border-y border-blue-800/40 shadow-lg flex flex-col gap-6 w-auto"
    id="news-and-events-section"
  >
    <div className="flex items-center justify-between border-b border-blue-950/30 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-blue-950/50 flex items-center justify-center text-blue-300 border border-blue-800/20">
          <Newspaper className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-white tracking-tight">Новости и события</h3>
          <p className="text-[10px] font-sans font-bold text-blue-200 uppercase tracking-wider">Информационная лента СЭЗ/ИЗ</p>
        </div>
      </div>
      <button className="text-[11px] font-bold text-white hover:bg-blue-800/80 bg-blue-900/60 px-4 py-2 rounded-[10px] transition-all border border-blue-700/40 shadow-sm">
        Все новости
      </button>
    </div>

    {/* List layout in 3 columns for full-width presentation */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* News 1 - FEATURED */}
      <div className="group flex flex-col gap-3.5 p-4 rounded-xl bg-white hover:bg-slate-50/95 border border-slate-200/60 hover:border-blue-300/80 hover:shadow-[0_12px_28px_rgba(15,43,92,0.15)] transition-all duration-300 cursor-pointer h-full">
        <div className="w-full h-40 rounded-lg overflow-hidden relative shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80" 
            alt="Обновлен реестр инвестиционных проектов СЭЗ" 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Важное событие
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Инфраструктура</span>
              <span className="text-[10px] text-slate-400 font-semibold">Сегодня, 10:32</span>
            </div>
            <h4 className="text-[14px] font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">Обновлен реестр инвестиционных проектов СЭЗ "Астана – новый город"</h4>
            <p className="text-[11px] text-slate-500/90 mt-2 leading-relaxed line-clamp-3">Новый пакет расширения территории предусматривает выделение дополнительных земельных площадей для инновационных стартап-площадок, экологически чистых производств и международных логистических центров.</p>
          </div>
        </div>
      </div>

      {/* News 2 */}
      <div className="group flex flex-col gap-3.5 p-4 rounded-xl bg-white hover:bg-slate-50/95 border border-slate-200/60 hover:border-blue-300/80 hover:shadow-[0_12px_28px_rgba(15,43,92,0.15)] transition-all duration-300 cursor-pointer h-full">
        <div className="w-full h-40 rounded-lg overflow-hidden relative shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80" 
            alt="Казахстан увеличил объем внешних инвестиций" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Аналитика
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">Инвестиции</span>
              <span className="text-[10px] text-slate-400 font-semibold">Вчера, 16:45</span>
            </div>
            <h4 className="text-[14px] font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">Казахстан увеличил объем внешних инвестиций в СЭЗ на 14.2%</h4>
            <p className="text-[11px] text-slate-500/90 mt-2 leading-relaxed line-clamp-3">Ключевыми секторами для привлечения зарубежного капитала стали зеленая энергетика, тяжелое машиностроение и микроэлектроника в рамках СЭЗ.</p>
          </div>
        </div>
      </div>

      {/* News 3 */}
      <div className="group flex flex-col gap-3.5 p-4 rounded-xl bg-white hover:bg-slate-50/95 border border-slate-200/60 hover:border-blue-300/80 hover:shadow-[0_12px_28px_rgba(15,43,92,0.15)] transition-all duration-300 cursor-pointer h-full">
        <div className="w-full h-40 rounded-lg overflow-hidden relative shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" 
            alt="Цифровизация процедур получения статуса резидента" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 bg-fuchsia-600 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Платформа
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[9px] font-mono font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 px-2 py-0.5 rounded uppercase tracking-wider">Цифровизация</span>
              <span className="text-[10px] text-slate-400 font-semibold">08 июля 2026</span>
            </div>
            <h4 className="text-[14px] font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">Цифровизация процедур получения статуса резидента</h4>
            <p className="text-[11px] text-slate-500/90 mt-2 leading-relaxed line-clamp-3">Время рассмотрения электронных заявок на регистрацию в специальных экономических зонах сокращено до 3 рабочих дней благодаря интеграции систем.</p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- REGULATORY ACTS SECTION ---
const NpaSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-gradient-to-r from-slate-100 via-white to-slate-50 -mx-6 px-8 py-12 border-y border-slate-200/80 shadow-md flex flex-col gap-6 w-auto"
    id="npa-regulatory-acts-section"
  >
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300/30">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight">Нормативно-правовые акты</h3>
          <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Регламенты, приказы и законы</p>
        </div>
      </div>
      <button className="text-[11px] font-bold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-[10px] transition-colors border border-slate-200 shadow-sm">
        База НПА
      </button>
    </div>

    {/* Docs laid out in responsive 3-column grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Doc 1 - Законы */}
      <div className="group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-amber-50/10 border-l-4 border-l-amber-500 border-y border-r border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/30 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-slate-700 group-hover:text-amber-950 transition-colors leading-snug line-clamp-2">О внесении изменений в Закон о СЭЗ и ИЗ</h4>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[9px] font-sans font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">Закон • №482-VI</span>
              <span className="text-[10px] text-slate-400 font-semibold">14.07.2026</span>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-200/50 group-hover:bg-amber-100 group-hover:border-amber-300 transition-colors shrink-0 ml-2 shadow-sm">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </div>
      </div>

      {/* Doc 2 - Постановления */}
      <div className="group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-blue-50/10 border-l-4 border-l-blue-500 border-y border-r border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/30 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-slate-700 group-hover:text-blue-950 transition-colors leading-snug line-clamp-2">Регламент взаимодействия УК с госорганами</h4>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[9px] font-sans font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">Постановление №1102</span>
              <span className="text-[10px] text-slate-400 font-semibold">03.07.2026</span>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-200/50 group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors shrink-0 ml-2 shadow-sm">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
        </div>
      </div>

      {/* Doc 3 - Приказы */}
      <div className="group flex items-center justify-between p-4 rounded-xl bg-white hover:bg-teal-50/10 border-l-4 border-l-teal-500 border-y border-r border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/30 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-slate-700 group-hover:text-teal-950 transition-colors leading-snug line-clamp-2">Перечень приоритетных видов деятельности резидентов</h4>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[9px] font-sans font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">Приказ • №94/ОД</span>
              <span className="text-[10px] text-slate-400 font-semibold">25.06.2026</span>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-200/50 group-hover:bg-teal-100 group-hover:border-teal-300 transition-colors shrink-0 ml-2 shadow-sm">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
        </div>
      </div>
    </div>
  </motion.div>
);

const NavItem = ({ icon, text, active = false, isCollapsed = false, onClick }: { icon: React.ReactElement<{ className?: string }>, text: string, active?: boolean, isCollapsed?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    title={isCollapsed ? text : undefined}
    className={`w-full flex items-center rounded-[12px] transition-all duration-300 text-[13px] font-bold relative overflow-hidden group
    ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
    ${active 
      ? 'text-white bg-blue-600 border border-blue-400/50 shadow-[0_4px_14px_rgba(37,99,235,0.35)]' 
      : 'text-white hover:bg-white/10 border border-transparent'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="activeNavIndicator"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-amber-400 rounded-r-full shadow-[0_0_8px_#fbbf24]"
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
    <div className={`relative z-10 transition-colors ${isCollapsed ? '' : 'mr-3'} ${active ? 'text-amber-400' : 'text-blue-100 group-hover:text-white'}`}>
      {React.cloneElement(icon, { className: 'w-[18px] h-[18px]' })}
    </div>
    {!isCollapsed && <span className="relative z-10 truncate whitespace-nowrap">{text}</span>}
  </button>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeModule, setActiveModule] = useState<string>('Главная');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mapType, setMapType] = useState<'vector' | 'yandex' | 'google'>('vector');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden relative font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900">
      {/* FULL WIDTH HEADER ROW - UNIFIED DEEP BLUE STYLE WITH BLUE BRANDED BUTTONS */}
      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-[84px] py-2 bg-gradient-to-r from-[#0f2b5c] via-[#164082] to-[#205cb3] text-white px-8 flex items-center justify-between z-20 border-b border-blue-950/40 shadow-lg shrink-0"
      >
        <div className="flex flex-col justify-center select-none py-1">
           <MinistryLogo />
        </div>
        <div className="flex items-center gap-5">
           {/* Language Panel - Styled with official royal blue */}
           <div className="flex bg-[#060B1A]/60 p-1 rounded-[12px] border border-blue-950/80 backdrop-blur-sm">
             <button className="px-3 py-1 rounded-[8px] bg-blue-600 text-white text-[11px] font-bold shadow-sm transition-all">RU</button>
             <button className="px-3 py-1 rounded-[8px] text-blue-200/60 hover:text-white hover:bg-white/5 text-[11px] font-bold transition-colors">KZ</button>
             <button className="px-3 py-1 rounded-[8px] text-blue-200/60 hover:text-white hover:bg-white/5 text-[11px] font-bold transition-colors">EN</button>
           </div>

           {/* Personal Cabinet - Brighter blue */}
           <button className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-[12px] border border-blue-500/25 shadow-md hover:shadow-lg transition-all duration-300 text-[12px] font-bold group">
             <User className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
             Личный кабинет
           </button>
        </div>
      </motion.div>

      {/* CONNECTED ROW CONTAINER (HEADER AND SIDEBAR JOINED PERFECTLY) */}
      <div className="flex-1 flex min-h-0 z-10">
        
        {/* LEFT COLUMN (MENU) - UNIFIED DEEP BLUE BACKGROUND */}
        <motion.div 
          layout
          transition={{ duration: 0.3 }}
          className={`${isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]'} shrink-0 bg-gradient-to-b from-[#0f2b5c] via-[#164082] to-[#205cb3] p-4 border-r border-blue-950/40 shadow-lg overflow-y-auto custom-scrollbar flex flex-col gap-1.5`}
        >
          {/* Brand/System Title */}
          {!isSidebarCollapsed ? (
            <div className="px-3 py-2.5 mb-1.5 border-b border-white/10 select-none">
              <h2 className="text-[12px] font-black tracking-tight text-white uppercase leading-tight">
                Цифровая система
              </h2>
              <p className="text-[10px] font-bold text-blue-200/80 mt-0.5 uppercase tracking-wide leading-tight">
                управления информацией
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2.5 mb-1.5 border-b border-white/10 select-none" title="Цифровая система управления информацией">
              <span className="text-[10px] font-black text-white bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-800/30">ЦСУИ</span>
            </div>
          )}

          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="w-full flex items-center justify-center p-3 hover:bg-white/5 text-blue-300 rounded-[12px] transition-colors mb-2 group border border-transparent hover:border-blue-500/20"
          >
            {isSidebarCollapsed ? (
              <Menu className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
            ) : (
              <div className="flex items-center justify-between w-full">
                 <span className="text-[10px] font-sans font-extrabold tracking-wider text-blue-200">НАВИГАЦИЯ</span>
                 <ChevronLeft className="w-4 h-4 text-blue-300 group-hover:-translate-x-0.5 transition-transform" />
              </div>
            )}
          </button>

          <NavItem icon={<Home />} text="Главный дашборд" active={activeModule === 'Главная'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Главная')} />
          
          <div className={`pt-3 pb-1.5 mt-1 border-t border-blue-950/20 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
             {isSidebarCollapsed ? (
               <Cpu className="w-4 h-4 text-blue-500/40" />
             ) : (
               <div className="px-4 flex items-center gap-2">
                 <Cpu className="w-3.5 h-3.5 text-blue-300" />
                 <p className="text-[10px] font-sans font-extrabold text-blue-100/75 uppercase tracking-widest">Модули</p>
               </div>
             )}
          </div>
          
          <NavItem icon={<Database />} text="Реестры зон" active={activeModule === 'Реестры'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Реестры')} />
          <NavItem icon={<Network />} text="Проекты" active={activeModule === 'Проекты'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Проекты')} />
          <NavItem icon={<MapPin />} text="Карта участков" active={activeModule === 'Земельные участки'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Земельные участки')} />
          <NavItem icon={<ShieldCheck />} text="Реестр договоров" active={activeModule === 'Договоры'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Договоры')} />
          <NavItem icon={<Activity />} text="Мониторинг KPI" active={activeModule === 'Мониторинг'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Мониторинг')} />
          <NavItem icon={<BarChart2 />} text="BI Аналитика" active={activeModule === 'Аналитика'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Аналитика')} />
          <NavItem icon={<MessageSquare />} text="Уведомления" active={activeModule === 'Сообщения'} isCollapsed={isSidebarCollapsed} onClick={() => setActiveModule('Сообщения')} />
          
          <div className="mt-auto pt-3 border-t border-blue-950/20">
            <NavItem icon={<Settings />} text="Системные настройки" isCollapsed={isSidebarCollapsed} />
          </div>
        </motion.div>

        {/* MAIN WORKSPACE CONTENT COLUMN - SCROLLABLE */}
        <div className="flex-1 flex flex-col p-6 gap-6 min-w-0 overflow-y-auto custom-scrollbar">
          
          {/* STATS (TOP ROW) - PERMANENT AS REQUESTED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
             <StatCard value="42" title="СЭЗ / ИЗ / МИЗ" subtitle="Активные зоны" delay={0.1} icon={LayoutGrid} imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" />
             <StatCard value="312" title="Инвест. проекты" subtitle="В реализации" delay={0.2} icon={Briefcase} imageUrl="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80" />
             <StatCard value="2.1T" title="Инвестиции (₸)" subtitle="Общий объем" delay={0.3} icon={Zap} imageUrl="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80" />
             <StatCard value="24K" title="Рабочие места" subtitle="Создано" delay={0.4} icon={User} imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80" />
          </div>

          {/* MAP & RIGHT PANEL ROW / DYNAMIC CONTENT AREA */}
          <motion.div 
            layout
            className="h-[680px] flex gap-4 shrink-0 bg-white/30 backdrop-blur-sm border border-white/50 p-2 rounded-lg shadow-[inset_0_2px_20px_rgba(0,0,0,0.01)]"
          >
            <AnimatePresence mode="wait">
              {activeModule === 'Главная' ? (
                <motion.div 
                  key="main-view"
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex gap-4 min-h-0 w-full"
                >
                  {/* MAP CONTAINER */}
                  <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-lg border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col group tech-border">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      {mapType === 'vector' ? (
                        geoData ? (
                          <InteractiveMap 
                            regions={REGIONS} 
                            selectedRegion={selectedRegion} 
                            onRegionSelect={setSelectedRegion} 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin"></div>
                          </div>
                        )
                      ) : mapType === 'yandex' ? (
                        <iframe 
                          src={`https://yandex.ru/map-widget/v1/?ll=${selectedRegion ? selectedRegion.coordinates[0] : 66.9237}%2C${selectedRegion ? selectedRegion.coordinates[1] : 48.0196}&z=${selectedRegion ? 8 : 5}&l=map`} 
                          width="100%" 
                          height="100%" 
                          frameBorder="0" 
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <iframe 
                          src={`https://maps.google.com/maps?q=${selectedRegion ? selectedRegion.coordinates[1] : 48.0196},${selectedRegion ? selectedRegion.coordinates[0] : 66.9237}&z=${selectedRegion ? 9 : 5}&t=k&output=embed`} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      )}
                    </div>
                    
                    {/* DATA LEGEND OVERLAY */}
                    {mapType === 'vector' && (
                      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                         <div className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-[10px] border border-slate-200/50 flex items-center gap-3 shadow-sm">
                           <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                           <span className="text-[10px] font-sans font-extrabold text-slate-700 uppercase tracking-wider">СЭЗ Объекты</span>
                         </div>
                         <div className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-[10px] border border-slate-200/50 flex items-center gap-3 shadow-sm">
                           <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                           <span className="text-[10px] font-sans font-extrabold text-slate-700 uppercase tracking-wider">ИЗ Объекты</span>
                         </div>
                      </div>
                    )}

                    {/* MAP SELECTOR */}
                    <div className="absolute top-5 right-5 z-20 flex bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200/50 shadow-sm gap-1">
                      <button 
                        onClick={() => setMapType('vector')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${mapType === 'vector' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        Векторная ГИС
                      </button>
                      <button 
                        onClick={() => setMapType('yandex')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${mapType === 'yandex' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        Яндекс.Карты
                      </button>
                      <button 
                        onClick={() => setMapType('google')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${mapType === 'google' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        Google Спутник
                      </button>
                    </div>
                    
                    {/* COORDINATE DECORATION */}
                    <div className="absolute bottom-5 right-5 z-20 text-[10px] font-sans font-bold text-slate-500 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-slate-200/40 tracking-wider pointer-events-none shadow-sm">
                      LAT: {(selectedRegion ? selectedRegion.coordinates[1] : 48.0196).toFixed(4)}° N<br/>
                      LON: {(selectedRegion ? selectedRegion.coordinates[0] : 66.9237).toFixed(4)}° E
                    </div>
                  </div>

                  {/* RIGHT PANEL (SEARCH & ZONES LIST) */}
                  <div className="w-[300px] shrink-0 bg-white/70 backdrop-blur-xl rounded-lg border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
                    {/* Search Header */}
                    <div className="p-4 border-b border-slate-100/60 shrink-0">
                      <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Идентификатор зоны..." 
                          className="w-full bg-slate-50 border border-slate-200/50 rounded py-2.5 pl-10 pr-4 text-[12px] font-bold focus:outline-none focus:border-blue-300 focus:bg-white placeholder:text-slate-400 transition-all font-sans shadow-inner"
                        />
                      </div>
                    </div>
                    
                    {/* List Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                       <div className="px-3 py-2 flex items-center gap-2 mb-1">
                         <Database className="w-3.5 h-3.5 text-indigo-400" />
                         <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">База данных зон</span>
                       </div>
                       
                       <div className="space-y-1.5">
                         {REGIONS.filter(r => r.zones.length > 0).map(region => (
                           <div key={region.id} className="mb-1.5">
                             <div 
                               className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all border ${selectedRegion?.id === region.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent hover:bg-white border-transparent hover:border-slate-100'}`}
                               onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
                             >
                               <span className={`text-[12px] font-bold ${selectedRegion?.id === region.id ? 'text-indigo-800' : 'text-slate-700'}`}>{region.name}</span>
                               <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${selectedRegion?.id === region.id ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                             </div>
                             
                             {/* Children (Zones) */}
                             <AnimatePresence>
                               {selectedRegion?.id === region.id && (
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                 >
                                   <div className="pl-4 pr-2 py-1.5 space-y-1 border-l border-indigo-200/50 ml-4 mt-1 mb-1">
                                     {region.zones.map((zone, idx) => (
                                       <div key={idx} className="flex items-center gap-2.5 p-2 rounded-sm hover:bg-white cursor-pointer group transition-colors border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md font-sans">
                                         <div className={`w-1.5 h-1.5 rounded-full ${zone.type === 'СЭЗ' ? 'bg-indigo-500' : 'bg-cyan-400'}`}></div>
                                         <div className="flex flex-col">
                                           <span className="text-[11px] font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors leading-tight">{zone.name}</span>
                                           <span className="text-[9px] font-sans font-semibold text-slate-400">{zone.type} • ID:{Math.floor(Math.random()*10000)}</span>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeModule === 'Проекты' ? (
                <motion.div
                  key="projects-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 w-full h-full min-h-0"
                >
                  <ProjectsModule />
                </motion.div>
              ) : (
                <motion.div 
                  key="module-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 bg-white/70 backdrop-blur-xl rounded-lg border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center px-6 w-full relative overflow-hidden tech-border"
                >
                   <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
                   
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", damping: 15, delay: 0.1 }}
                     className="w-20 h-20 rounded-[16px] bg-indigo-50 flex items-center justify-center text-indigo-500 mb-5 shadow-inner border border-indigo-100 relative z-10"
                   >
                     <Database className="w-10 h-10" />
                   </motion.div>
                   <h2 className="text-[28px] font-display font-extrabold text-slate-800 tracking-tight mb-3 relative z-10">Модуль «{activeModule}»</h2>
                   <p className="text-[14px] text-slate-500 font-medium max-w-[400px] leading-relaxed relative z-10">
                     Данный информационный блок находится в процессе синхронизации. Доступ будет предоставлен после завершения интеграции баз данных.
                   </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* DYNAMIC FOOTER CONTENT SECTIONS BASED ON ACTIVE MODULE */}
          {activeModule === 'Главная' && (
            <div className="flex flex-col gap-6 mt-2 shrink-0">
              <NewsSection />
              <NpaSection />
            </div>
          )}

          {/* FOOTER BLOCK - HIGH FIDELITY BLUE INTEGRATION */}
          <div className="bg-gradient-to-r from-[#0f2b5c] via-[#164082] to-[#205cb3] -mx-6 -mb-6 mt-8 p-8 md:p-10 text-white flex flex-col gap-8 shrink-0">
             {/* Main Link Grid */}
             <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Branding/Logotype column */}
                <div className="flex flex-col gap-3.5 md:col-span-2">
                   <div className="flex items-center gap-3">
                      {/* Industrial Logotype Icon resembling the reference image */}
                      <div className="w-10 h-10 rounded-full border border-white/25 bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5 text-blue-100">
                           <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                           <circle cx="12" cy="12" r="3" className="fill-white/10" />
                         </svg>
                      </div>
                      <span className="text-[13px] font-black tracking-tight leading-tight uppercase text-white max-w-[240px]">
                        Национальная информационная система промышленности
                      </span>
                   </div>
                   <p className="text-[11px] text-blue-200/70 leading-relaxed max-w-[320px]">
                     Портал для мониторинга и анализа состояния промышленного рынка.
                   </p>
                </div>

                {/* Enterprises & Services Links */}
                <div className="flex flex-col gap-2.5">
                   <a href="#" className="text-[12px] font-bold text-blue-100 hover:text-white transition-colors">
                     Действующие предприятия
                   </a>
                   <a href="#" className="text-[12px] font-bold text-blue-100 hover:text-white transition-colors">
                     Меры господдержки
                   </a>
                   <a href="#" className="text-[12px] font-bold text-blue-100 hover:text-white transition-colors">
                     Госуслуги
                   </a>
                </div>

                {/* News & Resources */}
                <div className="flex flex-col gap-2.5">
                   <a href="#" className="text-[12px] font-bold text-blue-100 hover:text-white transition-colors">
                     Новости
                   </a>
                   <a href="#" className="text-[12px] font-bold text-blue-100 hover:text-white transition-colors">
                     Внешние ресурсы
                   </a>
                </div>

                {/* Social media links */}
                <div className="flex flex-col gap-3">
                   <span className="text-[10px] font-sans font-bold text-blue-200/50 uppercase tracking-wider">
                     Мы в социальных сетях
                   </span>
                   <div className="flex items-center gap-4 text-blue-100">
                      <a href="#" title="Instagram" className="hover:text-white hover:scale-110 transition-transform p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15">
                         <Instagram className="w-4 h-4" />
                      </a>
                      <a href="#" title="Twitter" className="hover:text-white hover:scale-110 transition-transform p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15">
                         <Twitter className="w-4 h-4" />
                      </a>
                      <a href="#" title="Facebook" className="hover:text-white hover:scale-110 transition-transform p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15">
                         <Facebook className="w-4 h-4" />
                      </a>
                      <a href="#" title="Telegram" className="hover:text-white hover:scale-110 transition-transform p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15">
                         <Send className="w-4 h-4" />
                      </a>
                      <a href="#" title="YouTube" className="hover:text-white hover:scale-110 transition-transform p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/15">
                         <Youtube className="w-4 h-4" />
                      </a>
                   </div>
                </div>
             </div>

             {/* Bottom thin line divider */}
             <div className="border-t border-white/10 w-full"></div>

             {/* Copyright & Hotline Phone indicator */}
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-blue-200/60 font-semibold">
                <span>
                  © АО «Казахстанский центр индустрии и экспорта «QazIndustry» 2026 | Все права защищены.
                </span>
                <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-white shadow-sm hover:bg-white/15 transition-colors cursor-pointer">
                   <Phone className="w-3.5 h-3.5 text-blue-300" />
                   <span className="text-[13px] font-black tracking-wide">1465</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
