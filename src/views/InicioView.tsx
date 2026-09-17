import React from 'react';
import { useCampaign } from '../context/CampaignContext';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  Share2,
  Tv,
  History,
  FileCheck,
  Users,
} from 'lucide-react';

export const InicioView: React.FC = () => {
  const {
    setActiveTab,
    sessions,
    nodes,
    canonEntries,
    looseEnds,
    setIsModoSalonOpen,
  } = useCampaign();

  const currentSession = sessions.find((s) => s.id === 'S04') || sessions[0];
  const currentNode = nodes.find((n) => n.id === currentSession.mainNodeId);

  const exploredNodesCount = nodes.filter(
    (n) => n.status === 'presentado' || n.status === 'canonizado' || n.status === 'asignado'
  ).length;

  const activeCanonCount = canonEntries.filter((c) => c.status === 'vigente').length;
  const activeLooseEnds = looseEnds.filter((l) => l.status === 'abierto' || l.status === 'retomado');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Title & Case Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#aa304f] font-bold tracking-widest uppercase mb-1">
            SISTEMA FORENSE & BITÁCORA DE CAMPAÑA
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black tracking-tight">
            Proyecto Blackwood: Temporada 1
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Tablero de juego, archivo de desclasificación y continuidad narrativa para la mesa
            recurrente de PowerPoint Nights.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          <button
            onClick={() => setActiveTab('tablero-grafo')}
            className="px-3.5 py-2 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#aa304f] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Ver Tablero</span>
          </button>
          <button
            onClick={() => setIsModoSalonOpen(true)}
            className="px-3.5 py-2 bg-[#f3ede0] border border-black font-bold uppercase tracking-wider text-black hover:bg-[#e8e2d5] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>Modo Salón</span>
          </button>
        </div>
      </div>

      {/* Hero: Active Live Case Card */}
      <div className="bg-[#fff9ec] border-2 border-black shadow-[6px_6px_0px_0px_#18181b] p-5 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Dithered Case Photo */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-2">
          <div className="relative aspect-4/3 bg-black overflow-hidden border border-black group">
            {currentNode?.photoUrl ? (
              <img
                src={currentNode.photoUrl}
                alt={currentNode.name}
                className="w-full h-full object-cover grayscale contrast-125 filter group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono-code text-xs text-white">
                FOTOGRAMA CLASIFICADO
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 font-mono-code text-[9px] text-[#f4efe4] uppercase tracking-wider">
              NARA RG-342 // 1982
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-black/85 p-1.5 text-center font-mono-code text-[9px] text-white">
              Antena radar AN/FPS-35 en Camp Hero (Montauk Point, NY)
            </div>
          </div>

          <div className="font-mono-code text-[10px] text-[#47464b] leading-tight">
            Fotografía desclasificada de la antena triangular de microondas de 425 MHz operada en
            Long Island durante la Guerra Fría.
          </div>
        </div>

        {/* Right: Active Case Details & Direct Entry */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono-code text-[10px] bg-[#aa304f] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                SESIÓN #{currentSession.number} · EN CURSO EN SALA
              </span>
              <span className="font-mono-code text-[10px] text-[#47464b]">
                {currentSession.date} · Anfitrión: {currentSession.hostName}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-black tracking-tight mb-2">
              {currentSession.title}
            </h2>

            <p className="font-body text-sm text-[#2d2b24] leading-relaxed mb-4">
              {currentSession.summary}
            </p>

            {/* Current Thread Path */}
            <div className="bg-[#f3ede0] border border-[#c8c5cb] p-3 mb-4">
              <div className="font-mono-code text-[10px] text-[#47464b] uppercase font-bold mb-1.5">
                Ruta del Grafo Travesada (Regla de 2 Saltos en Vigor):
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono-code text-xs font-bold text-black">
                <span className="px-2 py-1 bg-white border border-black/30">N-01 (Paperclip)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#aa304f]" />
                <span className="px-2 py-1 bg-white border border-black/30">N-02 (MKUltra)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#aa304f]" />
                <span className="px-2 py-1 bg-white border border-black/30">N-03 (Roswell)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#aa304f]" />
                <span className="px-2 py-1 bg-[#aa304f] text-white border border-black">
                  N-04 (Montauk) [ACTUAL]
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c8c5cb]">
            <div className="font-mono-code text-xs text-[#47464b]">
              Ponente en tarima:{' '}
              <strong className="text-black">{currentSession.presenterName}</strong> (
              {currentSession.presenterRole})
            </div>

            <button
              onClick={() => setActiveTab('sesion-actual')}
              className="px-4 py-2 bg-[#aa304f] hover:bg-[#881337] text-white font-mono-code text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Entrar a la Sesión en Vivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono-code text-xs">
        <div className="bg-[#fff9ec] p-3.5 border border-black shadow-[3px_3px_0px_0px_#18181b] flex flex-col">
          <span className="text-[10px] text-[#47464b] uppercase font-bold">Nodos Conectados</span>
          <span className="text-2xl font-bold text-black mt-1">
            {String(exploredNodesCount).padStart(2, '0')}/14
          </span>
          <span className="text-[10px] text-emerald-700 mt-0.5 font-semibold">
            4 Nodos en el hilo continuo
          </span>
        </div>

        <div className="bg-[#fff9ec] p-3.5 border border-black shadow-[3px_3px_0px_0px_#18181b] flex flex-col">
          <span className="text-[10px] text-[#47464b] uppercase font-bold">Canon de Campaña</span>
          <span className="text-2xl font-bold text-[#881337] mt-1">
            {String(activeCanonCount).padStart(2, '0')} Artículos
          </span>
          <span className="text-[10px] text-[#881337] mt-0.5 font-semibold">
            1 Enmienda histórica
          </span>
        </div>

        <div className="bg-[#fff9ec] p-3.5 border border-black shadow-[3px_3px_0px_0px_#18181b] flex flex-col">
          <span className="text-[10px] text-[#47464b] uppercase font-bold">Cabos Sueltos</span>
          <span className="text-2xl font-bold text-[#b45309] mt-1">
            {String(activeLooseEnds.length).padStart(2, '0')} Activos
          </span>
          <span className="text-[10px] text-[#b45309] mt-0.5 font-semibold">
            1 Prioridad urgente
          </span>
        </div>

        <div className="bg-[#fff9ec] p-3.5 border border-black shadow-[3px_3px_0px_0px_#18181b] flex flex-col">
          <span className="text-[10px] text-[#47464b] uppercase font-bold">Sesiones Realizadas</span>
          <span className="text-2xl font-bold text-black mt-1">04 Actas</span>
          <span className="text-[10px] text-[#47464b] mt-0.5 font-semibold">
            100% de asistencia en sala
          </span>
        </div>
      </div>

      {/* Epistemological Truth Protocol System Explainer */}
      <div className="flex flex-col gap-3">
        <div className="border-b border-[#c8c5cb] pb-1 flex items-center justify-between">
          <h3 className="font-mono-code text-xs font-bold text-black uppercase tracking-wider">
            Arquitectura Epistemológica Obligatoria // Tres Capas de Verdad
          </h3>
          <span className="font-mono-code text-[10px] text-[#47464b]">
            Directiva de Neutralidad y Rigor de Sala
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layer 1: Hecho */}
          <div className="bg-white/80 border-2 border-[#1e3a8a] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[#1e3a8a] uppercase mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>1. HECHO CERTIFICADO</span>
              </div>
              <p className="font-body text-xs text-[#1e1c14] leading-relaxed">
                Datos históricos verificables, documentos desclasificados por FOIA, resoluciones del
                Senado, planos de instalaciones y patentes oficiales de radar.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1e3a8a]/20 font-mono-code text-[10px] text-[#1e3a8a]">
              Etiqueta: [FACT // CERTIFICADO] · Color Azul
            </div>
          </div>

          {/* Layer 2: Afirmación */}
          <div className="bg-white/80 border-2 border-dashed border-[#b45309] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[#b45309] uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>2. AFIRMACIÓN ATRIBUIDA</span>
              </div>
              <p className="font-body text-xs text-[#1e1c14] leading-relaxed">
                Conjeturas formuladas por investigadores, ufólogos o autores (e.g. Preston Nichols,
                Bob Lazar). Debe registrarse con autor explícito sin validarse como certeza.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#b45309]/20 font-mono-code text-[10px] text-[#b45309]">
              Etiqueta: [CLAIM // ATRIBUIDO] · Color Ámbar
            </div>
          </div>

          {/* Layer 3: Canon */}
          <div className="bg-[#fff5f7] border-2 border-[#aa304f] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[#aa304f] uppercase mb-2">
                <Flame className="w-4 h-4" />
                <span>3. CANON DE ASAMBLEA</span>
              </div>
              <p className="font-body text-xs text-[#1e1c14] leading-relaxed">
                Elementos narrativos y conjeturas aprobadas por mayoría de votos en asamblea tras la
                presentación. Gobiernan la continuidad narrativa futura de la campaña.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#aa304f]/20 font-mono-code text-[10px] text-[#aa304f]">
              Etiqueta: [CANON // ASAMBLEA] · Color Carmín
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
