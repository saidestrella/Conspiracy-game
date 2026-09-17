import React from 'react';
import { useCampaign, NavTab } from '../context/CampaignContext';
import {
  Building2,
  Share2,
  DoorOpen,
  History,
  CheckCircle,
  FolderOpen,
  Users,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    nodes,
    canonEntries,
    looseEnds,
    sessions,
    resetAllDemoData,
  } = useCampaign();

  const exploredNodesCount = nodes.filter(
    (n) => n.status === 'presentado' || n.status === 'canonizado' || n.status === 'asignado'
  ).length;

  const totalNodesCount = nodes.length;
  const activeLooseEndsCount = looseEnds.filter((l) => l.status === 'abierto' || l.status === 'retomado').length;
  const activeCanonCount = canonEntries.filter((c) => c.status === 'vigente').length;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'cuartel-general', label: '1. Inicio (HQ)', icon: Building2 },
    { id: 'tablero-grafo', label: '2. Tablero (Grafo)', icon: Share2 },
    { id: 'sesion-actual', label: '3. Sesión Actual', icon: DoorOpen },
    { id: 'bitacora', label: '4. Bitácora', icon: History },
    { id: 'canon-aprobado', label: '5. Canon Vigente', icon: CheckCircle },
    { id: 'archivo-y-cabos', label: '6. Archivo & Cabos', icon: FolderOpen },
    { id: 'expedientes-personas', label: '7. Investigadores', icon: Users },
    { id: 'manual-reglas', label: '8. Manual & FAQ', icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#f9f3e6] z-50 flex flex-col justify-between border-r border-[#c8c5cb]/40 select-none">
      <div className="flex flex-col">
        {/* Emblem & App Title */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#c8c5cb]/30 bg-[#f3ede0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_#18181b] p-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <rect width="24" height="24" fill="#18181B" />
                <polyline points="4,7 10,13 8,18 16,15 19,7" stroke="#aa304f" strokeWidth="2" strokeLinecap="square" />
                <rect x="3" y="6" width="3" height="3" fill="#1e3a8a" />
                <rect x="9" y="12" width="3" height="3" fill="#b45309" />
                <rect x="7" y="17" width="3" height="3" fill="#aa304f" />
                <rect x="18" y="6" width="3" height="3" fill="#ffffff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-mono-code text-[12px] font-bold tracking-widest text-black uppercase">
                EL GRAN HILO
              </span>
              <span className="font-mono-code text-[9px] text-[#47464b] tracking-wider">
                SISTEMA FORENSE V4.2
              </span>
            </div>
          </div>
        </div>

        {/* Active Case Badge */}
        <div className="p-2.5 bg-[#eee8db]/70 border-b border-[#c8c5cb]/30">
          <div className="px-1 py-0.5 flex items-center justify-between">
            <span className="font-mono-code text-[9px] text-[#47464b] uppercase tracking-wider font-bold">
              EXPEDIENTE ACTIVO
            </span>
            <span className="font-mono-code text-[9px] px-1 bg-[#aa304f] text-white font-bold tracking-widest">
              EN VIVO
            </span>
          </div>
          <div className="font-mono-code text-[12px] text-black font-bold px-1 truncate mt-0.5">
            PROYECTO BLACKWOOD
          </div>
          <div className="font-mono-code text-[10px] text-[#47464b] px-1">
            SESIÓN #04 // TEMP. 01
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 text-left font-mono-code text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#18181B]'
                    : 'text-[#47464b] hover:bg-[#eee8db] hover:text-black'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#aa304f]' : 'text-[#47464b]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Stats & Telemetry */}
      <div className="p-2.5 border-t border-[#c8c5cb]/30 bg-[#f3ede0]">
        <div className="bg-[#e8e2d5] p-2.5 flex flex-col gap-1.5 shadow-inner">
          <div className="flex justify-between items-center font-mono-code text-[10px]">
            <span className="text-[#47464b] uppercase font-bold">NODOS GRAFO</span>
            <span className="font-bold text-black">
              {String(exploredNodesCount).padStart(2, '0')}/{totalNodesCount}
            </span>
          </div>

          <div className="w-full bg-[#dfd9cd] h-1.5 overflow-hidden">
            <div
              className="bg-black h-1.5 transition-all duration-300"
              style={{ width: `${(exploredNodesCount / totalNodesCount) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[#47464b] pt-1 border-t border-[#c8c5cb]/20 font-mono-code text-[10px]">
            <span>CANON: {String(activeCanonCount).padStart(2, '0')}</span>
            <span className="text-[#aa304f] font-bold">
              CABOS: {String(activeLooseEndsCount).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetAllDemoData}
          className="mt-2 w-full py-1 text-center font-mono-code text-[9px] text-[#47464b] hover:text-[#aa304f] flex items-center justify-center gap-1 transition-colors cursor-pointer"
          title="Restablecer todos los datos al demo inicial"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Restablecer Demo Inicial</span>
        </button>
      </div>
    </aside>
  );
};
