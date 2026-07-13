import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Download, FileSpreadsheet, ArrowUpDown, Tag, Calendar, 
  MapPin, Briefcase, DollarSign, Users, CheckCircle, Clock, 
  AlertCircle, RefreshCw, X, FileText, BarChart2, ShieldAlert
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  investor: string;
  bin: string;
  sezName: string;
  region: string;
  industry: string;
  investmentAmount: number; // in billion tenge (млрд ₸)
  jobsCount: number;
  status: 'Действующее производство' | 'На стадии реализации' | 'Проектирование';
  launchYear: number;
  description: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'p1',
    name: 'Завод по производству цельнокатаных железнодорожных колес',
    investor: 'ТОО «ПромМашКомплект»',
    bin: '110440003291',
    sezName: 'СЭЗ «Павлодар»',
    region: 'Павлодарская обл.',
    industry: 'Машиностроение',
    investmentAmount: 54.3,
    jobsCount: 850,
    status: 'Действующее производство',
    launchYear: 2018,
    description: 'Высокотехнологичный комплекс по производству колес и стрелочных переводов для подвижного железнодорожного состава. Обеспечивает потребности АО «НК «ҚТЖ» и экспорт в страны СНГ.'
  },
  {
    id: 'p2',
    name: 'Интегрированный газохимический комплекс (производство полипропилена)',
    investor: 'ТОО «Kazakhstan Petrochemical Industries Inc.»',
    bin: '080340005411',
    sezName: 'СЭЗ «НИНТ»',
    region: 'Атырауская обл.',
    industry: 'Химическая промышленность',
    investmentAmount: 1200.0,
    jobsCount: 630,
    status: 'Действующее производство',
    launchYear: 2022,
    description: 'Крупнейший индустриальный проект нефтехимии в Казахстане. Мощность производства составляет 500 тыс. тонн полипропилена в год с использованием технологии Catofin и Novolen.'
  },
  {
    id: 'p3',
    name: 'Автомобильный завод бренда Hyundai методом мелкоузловой сборки',
    investor: 'ТОО «Hyundai Trans Kazakhstan»',
    bin: '190140018592',
    sezName: 'Индустриальная зона Алматы',
    region: 'г. Алматы',
    industry: 'Машиностроение',
    investmentAmount: 28.1,
    jobsCount: 700,
    status: 'Действующее производство',
    launchYear: 2020,
    description: 'Высокотехнологичное производство легковых автомобилей. Включает цеха сварки и окраски кузовов, сборки пластиковых деталей, сборки салона и финального технического аудита.'
  },
  {
    id: 'p4',
    name: 'Строительство завода по производству стальных сортовых заготовок',
    investor: 'ТОО «Kaz-Met-Industries»',
    bin: '140540023412',
    sezName: 'СЭЗ «Сарыарка»',
    region: 'Карагандинская обл.',
    industry: 'Металлургия',
    investmentAmount: 9.7,
    jobsCount: 240,
    status: 'Действующее производство',
    launchYear: 2019,
    description: 'Литейно-прокатный комплекс по выпуску высококачественного металлопроката, арматуры и заготовок для строительной и машиностроительной отраслей Центрального Казахстана.'
  },
  {
    id: 'p5',
    name: 'Сухой порт и мультимодальный логистический центр на границе',
    investor: 'ТОО «КХВВ Логистик»',
    bin: '150440023192',
    sezName: 'СЭЗ «Хоргос - Восточные ворота»',
    region: 'Жетысуская обл.',
    industry: 'Логистика',
    investmentAmount: 35.6,
    jobsCount: 450,
    status: 'Действующее производство',
    launchYear: 2016,
    description: 'Ключевой логистический узел Нового шелкового пути, соединяющий Азию и Европу. Обеспечивает перевалку контейнеров с узкой колеи (КНР) на широкую колею (РК) и обработку грузов.'
  },
  {
    id: 'p6',
    name: 'Высокотехнологичный комплекс глубокой переработки зерна',
    investor: 'ТОО «BioOperations»',
    bin: '060440005822',
    sezName: 'СЭЗ «Qyzyljar»',
    region: 'СКО',
    industry: 'Пищевая промышленность',
    investmentAmount: 15.0,
    jobsCount: 400,
    status: 'Действующее производство',
    launchYear: 2018,
    description: 'Уникальное предприятие по производству биоэтанола, крахмала, клейковины и высокобелковых кормовых добавок из пшеницы. Полноцикловой экспортоориентированный кластер.'
  },
  {
    id: 'p7',
    name: 'Завод по производству пассажирских автобусов марки Yutong',
    investor: 'ТОО «QazTehna»',
    bin: '200540023145',
    sezName: 'СЭЗ «Сарыарка»',
    region: 'Карагандинская обл.',
    industry: 'Машиностроение',
    investmentAmount: 23.3,
    jobsCount: 600,
    status: 'Действующее производство',
    launchYear: 2021,
    description: 'Крупнейшее сборочное производство городских, междугородних автобусов и специальной техники в городе Сарань. Способствует обновлению муниципального автопарка страны.'
  },
  {
    id: 'p8',
    name: 'Завод по производству фотоэлектрических пластин на кремнии',
    investor: 'ТОО «Astana Solar»',
    bin: '111140003920',
    sezName: 'СЭЗ «Астана – новый город»',
    region: 'г. Астана',
    industry: 'IT и электроника',
    investmentAmount: 18.2,
    jobsCount: 150,
    status: 'На стадии реализации',
    launchYear: 2026,
    description: 'Прогрессивное инновационное предприятие по сборке солнечных панелей высокой эффективности. Ориентировано на зеленую энергетику и локализацию компонентов ВИЭ.'
  },
  {
    id: 'p9',
    name: 'Установка разделения воздуха по производству технических газов',
    investor: 'ТОО «Linde Gas Kazakhstan»',
    bin: '091040003844',
    sezName: 'СЭЗ «Павлодар»',
    region: 'Павлодарская обл.',
    industry: 'Химическая промышленность',
    investmentAmount: 12.5,
    jobsCount: 120,
    status: 'Действующее производство',
    launchYear: 2013,
    description: 'Поставка технического кислорода, газообразного азота высокого давления для нужд Павлодарского нефтехимического завода и металлургических производств региона.'
  },
  {
    id: 'p10',
    name: 'Строительство современного тепличного комплекса пятого поколения',
    investor: 'ТОО «Green Land Alatau»',
    bin: '120240019253',
    sezName: 'СЭЗ «Актобе»',
    region: 'Актюбинская обл.',
    industry: 'Пищевая промышленность',
    investmentAmount: 8.4,
    jobsCount: 180,
    status: 'На стадии реализации',
    launchYear: 2026,
    description: 'Инвестиционный агропромышленный проект по круглогодичному выращиванию овощей закрытого грунта с применением систем Ultra-Clima и капельного орошения.'
  },
  {
    id: 'p11',
    name: 'Строительство ИТ-Дата центра обработки данных Tier III',
    investor: 'ТОО «Alatau Tech Data»',
    bin: '221140023001',
    sezName: 'СЭЗ «ПИТ»',
    region: 'г. Алматы',
    industry: 'IT и электроника',
    investmentAmount: 42.0,
    jobsCount: 110,
    status: 'Проектирование',
    launchYear: 2027,
    description: 'Современный высоконадежный отказоустойчивый дата-центр мощностью 10 МВт для хостинга облачных систем государственных органов, банковского сектора и крупных ИТ-компаний.'
  },
  {
    id: 'p12',
    name: 'Производство безалкогольных напитков и соков',
    investor: 'ТОО «RG Brand»',
    bin: '981140001923',
    sezName: 'СЭЗ «Оңтүстік»',
    region: 'г. Шымкент',
    industry: 'Пищевая промышленность',
    investmentAmount: 6.4,
    jobsCount: 220,
    status: 'Действующее производство',
    launchYear: 2011,
    description: 'Современное производство безалкогольных напитков, натуральных соков, нектаров и чая. Соответствует международным стандартам качества ISO и экологического менеджмента.'
  }
];

export function ProjectsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSez, setSelectedSez] = useState('Все СЭЗ');
  const [selectedStatus, setSelectedStatus] = useState('Все статусы');
  const [selectedIndustry, setSelectedIndustry] = useState('Все отрасли');
  const [sortField, setSortField] = useState<'investmentAmount' | 'jobsCount' | 'launchYear'>('investmentAmount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS_DATA[0]);
  const [notification, setNotification] = useState<string | null>(null);

  // Lists of unique values for filters
  const sezOptions = useMemo(() => {
    const list = new Set(PROJECTS_DATA.map(p => p.sezName));
    return ['Все СЭЗ', ...Array.from(list)];
  }, []);

  const statusOptions = [
    'Все статусы',
    'Действующее производство',
    'На стадии реализации',
    'Проектирование'
  ];

  const industryOptions = useMemo(() => {
    const list = new Set(PROJECTS_DATA.map(p => p.industry));
    return ['Все отрасли', ...Array.from(list)];
  }, []);

  // Filter & Sort projects
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.investor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.bin.includes(searchQuery);

      const matchesSez = selectedSez === 'Все СЭЗ' || project.sezName === selectedSez;
      const matchesStatus = selectedStatus === 'Все статусы' || project.status === selectedStatus;
      const matchesIndustry = selectedIndustry === 'Все отрасли' || project.industry === selectedIndustry;

      return matchesSearch && matchesSez && matchesStatus && matchesIndustry;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [searchQuery, selectedSez, selectedStatus, selectedIndustry, sortField, sortDirection]);

  // Overall metrics based on currently filtered projects
  const metrics = useMemo(() => {
    const total = filteredProjects.length;
    const totalInvestment = filteredProjects.reduce((sum, p) => sum + p.investmentAmount, 0);
    const totalJobs = filteredProjects.reduce((sum, p) => sum + p.jobsCount, 0);
    const operatingCount = filteredProjects.filter(p => p.status === 'Действующее производство').length;
    return {
      total,
      totalInvestment: totalInvestment.toFixed(1),
      totalJobs,
      operatingCount
    };
  }, [filteredProjects]);

  const toggleSort = (field: 'investmentAmount' | 'jobsCount' | 'launchYear') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    setNotification(`Экспорт реестра проектов в формат ${format} успешно запущен...`);
    setTimeout(() => {
      setNotification(`Файл реестра СЭЗ_${Date.now()}.${format === 'Excel' ? 'xlsx' : 'pdf'} успешно загружен.`);
      setTimeout(() => setNotification(null), 4000);
    }, 1500);
  };

  const getStatusBadgeStyles = (status: Project['status']) => {
    switch (status) {
      case 'Действующее производство':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'На стадии реализации':
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'Проектирование':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/50';
    }
  };

  const getIndustryBadgeStyles = (industry: string) => {
    switch (industry) {
      case 'Машиностроение': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Химическая промышленность': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Металлургия': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'Логистика': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Пищевая промышленность': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'IT и электроника': return 'bg-teal-50 text-teal-700 border-teal-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-4 h-full min-h-0 text-slate-800 font-sans" id="projects-registry-module">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700/50 text-[12px] font-bold"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT BLOCK: Filter and List */}
      <div className="flex-1 flex flex-col min-h-0 bg-white/70 backdrop-blur-xl rounded-xl border border-white/80 shadow-sm p-4 overflow-hidden">
        {/* Module Header & Search Controls */}
        <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Инвестиционные проекты СЭЗ и ИЗ РК
              </h2>
              <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Официальный реестр участников • Интеграция с АО «QazIndustry»
              </p>
            </div>
            
            {/* Exports */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button 
                onClick={() => handleExport('Excel')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Excel
              </button>
              <button 
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-red-600" />
                PDF
              </button>
            </div>
          </div>

          {/* Metrics summary strip inside the module */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/50">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100 shadow-sm flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Всего проектов</span>
              <span className="text-[16px] font-black text-slate-800 tracking-tight leading-none mt-1">{metrics.total}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100 shadow-sm flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Инвестиции (млрд ₸)</span>
              <span className="text-[16px] font-black text-blue-900 tracking-tight leading-none mt-1">{metrics.totalInvestment}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100 shadow-sm flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Рабочие места</span>
              <span className="text-[16px] font-black text-indigo-900 tracking-tight leading-none mt-1">{metrics.totalJobs.toLocaleString()}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100 shadow-sm flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Действующие заводы</span>
              <span className="text-[16px] font-black text-emerald-800 tracking-tight leading-none mt-1">{metrics.operatingCount}</span>
            </div>
          </div>

          {/* Filtering & Search panel */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mt-1">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, инвестору, БИН..." 
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8.5 pr-3 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 font-sans shadow-inner transition-all"
              />
            </div>

            {/* SEZ Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedSez}
                onChange={(e) => setSelectedSez(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                {sezOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Industry Filter */}
            <div className="sm:col-span-2.5">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Sort Header Row */}
        <div className="bg-slate-100/60 border-b border-slate-200/50 px-3 py-2 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 select-none">
          <div className="w-[45%] flex items-center gap-1">Наименование предприятия / Инвестор</div>
          <div className="w-[18%] flex items-center gap-1 justify-end cursor-pointer hover:text-slate-800 transition-colors" onClick={() => toggleSort('investmentAmount')}>
            Инвестиции
            <ArrowUpDown className={`w-3 h-3 ${sortField === 'investmentAmount' ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div className="w-[18%] flex items-center gap-1 justify-end cursor-pointer hover:text-slate-800 transition-colors" onClick={() => toggleSort('jobsCount')}>
            Рабочие места
            <ArrowUpDown className={`w-3 h-3 ${sortField === 'jobsCount' ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div className="w-[19%] flex items-center gap-1 justify-end cursor-pointer hover:text-slate-800 transition-colors" onClick={() => toggleSort('launchYear')}>
            Год запуска
            <ArrowUpDown className={`w-3 h-3 ${sortField === 'launchYear' ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
        </div>

        {/* PROJECTS SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1.5">
          <AnimatePresence initial={false}>
            {filteredProjects.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center text-slate-400"
              >
                <ShieldAlert className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-[13px] font-bold">Проекты не найдены</p>
                <p className="text-[11px]">Попробуйте скорректировать параметры фильтрации или поисковый запрос</p>
              </motion.div>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  layoutId={`proj-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedProject?.id === project.id ? 'bg-blue-50/70 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/40 shadow-[0_1px_3px_rgba(0,0,0,0.01)]'}`}
                >
                  {/* Left branding */}
                  <div className="w-[45%] flex flex-col pr-2">
                    <span className="text-[12px] font-bold text-slate-800 leading-tight line-clamp-1">{project.name}</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">{project.investor} • БИН {project.bin}</span>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/30">
                        {project.sezName}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${getIndustryBadgeStyles(project.industry)}`}>
                        {project.industry}
                      </span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="w-[18%] text-right flex flex-col justify-center pr-2">
                    <span className="text-[12px] font-extrabold text-slate-900 tracking-tight">
                      {project.investmentAmount >= 1000 
                        ? `${(project.investmentAmount / 1000).toFixed(2)} трлн` 
                        : `${project.investmentAmount} млрд`
                      } ₸
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Инвестиции</span>
                  </div>

                  {/* Jobs */}
                  <div className="w-[18%] text-right flex flex-col justify-center pr-2">
                    <span className="text-[12px] font-black text-indigo-900 tracking-tight">{project.jobsCount}</span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Рабочих мест</span>
                  </div>

                  {/* Year & Status */}
                  <div className="w-[19%] text-right flex flex-col items-end justify-center">
                    <span className="text-[12px] font-bold text-slate-800">{project.launchYear} год</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1.5 leading-none ${getStatusBadgeStyles(project.status)}`}>
                      {project.status === 'Действующее производство' ? 'Запущен' : project.status === 'На стадии реализации' ? 'Внедрение' : 'Проект'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT BLOCK: Detailed inspector panel */}
      <div className="w-full md:w-[320px] shrink-0 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 shadow-lg flex flex-col text-white p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div 
              key={selectedProject.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col min-h-0 relative z-10"
            >
              {/* Card Header Info */}
              <div className="pb-4 border-b border-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedProject.status === 'Действующее производство' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : selectedProject.status === 'На стадии реализации'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {selectedProject.status}
                  </span>
                  
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    ID: {selectedProject.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-[14px] font-black leading-snug tracking-tight text-white mb-1.5">
                  {selectedProject.name}
                </h3>
                <p className="text-[11px] text-blue-200/70 font-medium">
                  {selectedProject.investor}
                </p>
              </div>

              {/* Inspector stats grid */}
              <div className="grid grid-cols-2 gap-2 py-4 border-b border-slate-800/60">
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" /> Инвестиции
                  </span>
                  <span className="text-[14px] font-black text-white mt-1">
                    {selectedProject.investmentAmount} млрд ₸
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" /> Рабочие места
                  </span>
                  <span className="text-[14px] font-black text-white mt-1">
                    {selectedProject.jobsCount} мест
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> Год запуска
                  </span>
                  <span className="text-[14px] font-black text-white mt-1">
                    {selectedProject.launchYear} г.
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" /> Зона размещения
                  </span>
                  <span className="text-[11px] font-extrabold text-blue-100 truncate mt-1">
                    {selectedProject.sezName}
                  </span>
                </div>
              </div>

              {/* Description & metadata details */}
              <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4 pr-1 text-[11px]">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Описание проекта</span>
                  <p className="text-slate-300 leading-relaxed text-justify bg-white/3 border border-white/5 p-3 rounded-xl font-medium">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">БИН организации:</span>
                    <span className="font-mono font-bold text-blue-200">{selectedProject.bin}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">Отраслевая сфера:</span>
                    <span className="font-bold text-blue-200">{selectedProject.industry}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">Регион:</span>
                    <span className="font-bold text-blue-200">{selectedProject.region}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-3 border-t border-slate-800/60 mt-auto shrink-0 flex items-center gap-2 text-slate-400 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                <span>Синхронизировано с АИС ГИС «QazIndustry»</span>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <BarChart2 className="w-12 h-12 text-slate-700 mb-2" />
              <p className="text-[13px] font-bold text-slate-400">Проект не выбран</p>
              <p className="text-[11px] text-slate-600 max-w-[200px]">Выберите любой инвестиционный проект из реестра слева для просмотра подробностей</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
