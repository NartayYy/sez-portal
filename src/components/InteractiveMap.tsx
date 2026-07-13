import React, { useMemo, useEffect, useState, useRef } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { motion, AnimatePresence } from 'motion/react';
import geoData from '../kazakhstan.json';

interface Region {
  id: string;
  name: string;
  coordinates: [number, number];
  sez: number;
  iz: number;
  zones: { name: string; type: 'СЭЗ' | 'ИЗ' }[];
}

interface InteractiveMapProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region | null) => void;
}

const REGION_PALETTE: Record<string, { fill: string; stroke: string; hoverFill: string }> = {
  astana: { fill: '#EFF6FF', stroke: '#3B82F6', hoverFill: '#DBEAFE' }, // Blue
  almaty: { fill: '#F5F3FF', stroke: '#8B5CF6', hoverFill: '#EDE9FE' }, // Purple
  shymkent: { fill: '#ECFDF5', stroke: '#10B981', hoverFill: '#D1FAE5' }, // Emerald
  mangystau: { fill: '#FFF7ED', stroke: '#F97316', hoverFill: '#FFEDD5' }, // Orange
  karaganda: { fill: '#FFF1F2', stroke: '#F43F5E', hoverFill: '#FFE4E6' }, // Rose
  zhetysu: { fill: '#F0FDFA', stroke: '#14B8A6', hoverFill: '#CCFBF1' }, // Teal
  aktobe: { fill: '#FAF5FF', stroke: '#A855F7', hoverFill: '#F3E8FF' }, // Violet
  pavlodar: { fill: '#EFF6FF', stroke: '#2563EB', hoverFill: '#DBEAFE' }, // Deep Blue
  sko: { fill: '#F0FDF4', stroke: '#22C55E', hoverFill: '#DCFCE7' }, // Green
  kostanay: { fill: '#FFFBEB', stroke: '#F59E0B', hoverFill: '#FEF3C7' }, // Amber
  almatinskaya: { fill: '#EEF2FF', stroke: '#4F46E5', hoverFill: '#E0E7FF' }, // Indigo
  turkestan: { fill: '#ECFDF5', stroke: '#059669', hoverFill: '#D1FAE5' }, // Emerald
  atyrau: { fill: '#FFF7ED', stroke: '#EA580C', hoverFill: '#FFEDD5' }, // Orange
  zhambyl: { fill: '#FDF2F8', stroke: '#EC4899', hoverFill: '#FCE7F3' }, // Pink
  kyzylorda: { fill: '#FFFBEB', stroke: '#D97706', hoverFill: '#FEF3C7' }, // Dark Amber
  zko: { fill: '#F0FDFA', stroke: '#0D9488', hoverFill: '#CCFBF1' }, // Teal
  abai: { fill: '#FAF5FF', stroke: '#8B5CF6', hoverFill: '#F3E8FF' }, // Purple
  vko: { fill: '#F5F3FF', stroke: '#7C3AED', hoverFill: '#EDE9FE' }, // Indigo-Purple
  ulytau: { fill: '#F8FAFC', stroke: '#64748B', hoverFill: '#F1F5F9' }, // Slate
  akmola: { fill: '#EFF6FF', stroke: '#1D4ED8', hoverFill: '#DBEAFE' }, // Royal Blue
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ regions, selectedRegion, onRegionSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;

  const { pathGenerator, projection } = useMemo(() => {
    // Increased scale to 1.25 for a larger, beautiful map filling the container
    const proj = geoMercator().fitSize([width * 1.25, height * 1.25], geoData as any)
      .translate([width / 2, height / 2]);
    const generator = geoPath().projection(proj);
    return { pathGenerator: generator, projection: proj };
  }, [width, height]);

  // Ultra-modern animation variants
  const mapVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
  };

  const pathVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut"
      } 
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center overflow-hidden" onClick={() => onRegionSelect(null)}>
      <motion.svg 
        width={width} 
        height={height} 
        className="overflow-visible drop-shadow-[0_12px_28px_rgba(37,99,235,0.12)]"
        variants={mapVariants}
        initial="hidden"
        animate="visible"
      >
        <g>
          {geoData.features.map((feature, i) => {
            const d = pathGenerator(feature as any) || '';
            const regionName = (feature.properties as any)?.name || '';
            const matchedRegion = regions.find(r => r.name.toLowerCase().includes(regionName.toLowerCase() || 'none'));
            const regionId = matchedRegion?.id || feature.id || `region-${i}`;
            const isHovered = hoveredRegion === regionId;
            const isSelected = selectedRegion?.id === regionId;

            const palette = matchedRegion ? REGION_PALETTE[matchedRegion.id] : null;

            const defaultFill = palette ? palette.fill : '#F8FAFC';
            const defaultStroke = palette ? palette.stroke : '#E2E8F0';
            const hoverFill = palette ? palette.hoverFill : '#EEF2FF';

            const fill = isSelected ? hoverFill : (isHovered ? hoverFill : defaultFill);
            const stroke = isSelected ? (palette ? palette.stroke : '#2563EB') : (isHovered ? (palette ? palette.stroke : '#93C5FD') : defaultStroke);
            const strokeWidth = isSelected ? 2.5 : (isHovered ? 1.8 : 1.2);
            
            return (
              <motion.path
                key={`path-${i}`}
                d={d}
                variants={pathVariants}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => matchedRegion && setHoveredRegion(matchedRegion.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={(e) => {
                   e.stopPropagation();
                   if (matchedRegion) {
                     onRegionSelect(matchedRegion);
                   } else {
                     onRegionSelect(null);
                   }
                }}
              />
            );
          })}
        </g>

        <g>
          {regions.map((region) => {
            const [cx, cy] = projection(region.coordinates) || [0, 0];
            const hasZones = region.sez > 0 || region.iz > 0;
            const selected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion === region.id;
            
            if (cx === 0 && cy === 0) return null;

            return (
              <g 
                key={region.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegionSelect(region);
                }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="group cursor-pointer"
              >
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: selected ? 1.15 : (isHovered ? 1.05 : 1), opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25, delay: Math.random() * 0.5 + 0.5 }}
                >
                  {hasZones ? (
                    <foreignObject x={-40} y={-16} width={80} height={32} className="overflow-visible pointer-events-none">
                      <div className={`flex items-center justify-center gap-1.5 px-2 py-1 mx-auto w-max rounded-sm transition-all duration-300 pointer-events-auto backdrop-blur-md border shadow-sm tech-border
                        ${selected 
                          ? 'bg-blue-600/90 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' 
                          : 'bg-white/90 border-slate-200 group-hover:bg-white group-hover:border-blue-300 group-hover:shadow-[0_4px_12px_rgba(37,99,235,0.15)]'}`}>
                        
                        {region.sez > 0 && (
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-sm ${selected ? 'bg-white' : 'bg-blue-500'} shadow-[0_0_4px_#2563EB]`}></div>
                            <span className={`text-[10px] font-mono font-bold ${selected ? 'text-white' : 'text-slate-700'}`}>{region.sez}</span>
                          </div>
                        )}
                        
                        {region.iz > 0 && (
                          <div className="flex items-center gap-1 ml-0.5">
                            <div className={`w-1.5 h-1.5 rounded-sm ${selected ? 'bg-cyan-200' : 'bg-cyan-400'} shadow-[0_0_4px_rgba(34,211,238,0.8)]`}></div>
                            <span className={`text-[10px] font-mono font-bold ${selected ? 'text-white' : 'text-slate-700'}`}>{region.iz}</span>
                          </div>
                        )}
                      </div>
                    </foreignObject>
                  ) : (
                    <g className="origin-center pointer-events-auto">
                      <circle r={4} fill={selected ? "#2563EB" : "#CBD5E1"} stroke="#ffffff" strokeWidth={1} className="transition-colors duration-300" />
                      <circle r={10} fill="#2563EB" className="opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                    </g>
                  )}
                </motion.g>

                <foreignObject 
                  x={-100} y={-70} width={200} height={45} 
                  className={`pointer-events-none transition-all duration-300 origin-bottom
                    ${selected || isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
                >
                  <div className="flex justify-center h-full items-end pb-3">
                    <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-sm shadow-xl border border-slate-700 text-[11px] font-mono font-bold text-white whitespace-nowrap tracking-widest uppercase">
                      {region.name}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </motion.svg>
    </div>
  );
};
