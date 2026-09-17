import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Search, Tv, UserCheck, Shield, ChevronDown, Check } from 'lucide-react';
import { TruthLayer } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    setIsSearchOpen,
    setIsModoSalonOpen,
    filterTruthLayer,
    setFilterTruthLayer,
    showToast,
  } = useCampaign();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleTruthPillClick = (layer: TruthLayer) => {
    if (filterTruthLayer === layer) {
      setFilterTruthLayer('ALL');
      showToast('Filtro de verdad restablecido: mostrando todas las capas.');
    } else {
      setFilterTruthLayer(layer);
      showToast(`Filtro activo: Mostrando únicamente registros [${layer}].`);
    }
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#f9f3e6]/95 backdrop-blur-md z-40 border-b border-[#c8c5cb]/50 flex items-center justify-between px-4 lg:px-6 shadow-xs">
      {/* Left: Global Search trigger and Truth Protocol Badges */}
      <div className="flex items-center gap-3 lg:gap-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center bg-[#e8e2d5] hover:bg-[#dfd9cd] px-3 py-1.5 border border-[#c8c5cb]/60 transition-colors group cursor-pointer text-left"
          title="Buscar en todo el archivo (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-[#47464b] mr-2 group-hover:text-black transition-colors" />
          <span className="font-mono-code text-[11px] text-[#47464b] group-hover:text-black uppercase tracking-wider">
            BUSCAR EN DESPACHO... [CTRL+K]
          </span>
        </button>

        {/* Epistemological Truth Pills */}
        <div className="hidden xl:flex items-center gap-2 font-mono-code text-[10px]">
          <button
            onClick={() => handleTruthPillClick('HECHO')}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              filterTruthLayer === 'HECHO'
                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs'
                : 'border-[#1e3a8a]/60 text-[#1e3a8a] bg-white/70 hover:bg-[#1e3a8a]/10'
            }`}
            title="Filtrar por Hechos Certificados"
          >
            [FACT // CERTIFICADO]
          </button>

          <button
            onClick={() => handleTruthPillClick('AFIRMACIÓN')}
            className={`px-2 py-1 border border-dashed transition-all cursor-pointer ${
              filterTruthLayer === 'AFIRMACIÓN'
                ? 'bg-[#b45309] text-white border-[#b45309] shadow-xs'
                : 'border-[#b45309]/60 text-[#b45309] bg-white/70 hover:bg-[#b45309]/10'
            }`}
            title="Filtrar por Afirmaciones Testimoniales"
          >
            [CLAIM // ATRIBUIDO]
          </button>

          <button
            onClick={() => handleTruthPillClick('CANON')}
            className={`px-2 py-1 font-bold transition-all cursor-pointer ${
              filterTruthLayer === 'CANON'
                ? 'bg-[#881337] text-white ring-2 ring-[#881337] shadow-xs'
                : 'bg-[#aa304f] text-white hover:bg-[#881337]'
            }`}
            title="Filtrar por Canon Aprobado en Asamblea"
          >
            [CANON // ASAMBLEA]
          </button>
        </div>
      </div>

      {/* Right: Salon Mode button and User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Salon Mode Button */}
        <button
          onClick={() => setIsModoSalonOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white font-mono-code text-[11px] font-bold uppercase tracking-wider hover:bg-[#aa304f] transition-all shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          title="Abrir vista de proyección en pantalla de salón"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>MODO SALÓN</span>
        </button>

        {/* User Identity Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 px-2 hover:bg-[#eee8db] transition-colors cursor-pointer border border-transparent hover:border-[#c8c5cb]"
            title="Cambiar investigador activo"
          >
            <div className="text-right hidden sm:block">
              <div className="font-mono-code text-[11px] font-bold text-black leading-none uppercase">
                {currentUser.name}
              </div>
              <div className="font-mono-code text-[9px] text-[#47464b] leading-none mt-1 uppercase tracking-wider">
                {currentUser.badge} // {currentUser.role}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono-code text-xs font-bold shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#47464b]" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#fff9ec] border-2 border-black shadow-[4px_4px_0px_0px_#18181b] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2 py-1 border-b border-[#c8c5cb] mb-1 font-mono-code text-[10px] uppercase font-bold text-[#47464b]">
                Conmutar Credencial de Mesa:
              </div>
              <div className="flex flex-col gap-1">
                {allUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserMenuOpen(false);
                        showToast(`Identidad cambiada a: ${user.name} (${user.badge})`);
                      }}
                      className={`flex items-center justify-between px-2 py-1.5 text-left font-mono-code text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-black text-white font-bold'
                          : 'hover:bg-[#eee8db] text-[#1e1c14]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{user.name}</span>
                        <span className={`text-[10px] ${isCurrent ? 'text-[#c8c5cb]' : 'text-[#47464b]'}`}>
                          {user.badge} · {user.title}
                        </span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-white ml-2 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
