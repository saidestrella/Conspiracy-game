import React from 'react';
import { useCampaign } from '../context/CampaignContext';
import { X, Tv, ExternalLink, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ModoSalonModal: React.FC = () => {
  const {
    isModoSalonOpen,
    setIsModoSalonOpen,
    sessions,
    claims,
    currentMotionVotes,
    hasVotedCurrentMotion,
    castVoteOnCurrentMotion,
    isMotionPassed,
  } = useCampaign();

  if (!isModoSalonOpen) return null;

  const currentSession = sessions.find((s) => s.id === 'S04') || sessions[0];
  const activeClaims = claims.filter((c) => c.sessionId === 'S04' || c.nodeId === 'N04');
  const facts = activeClaims.filter((c) => c.truthLayer === 'HECHO');
  const assertions = activeClaims.filter((c) => c.truthLayer === 'AFIRMACIÓN');

  const totalVotes = currentMotionVotes.approve + currentMotionVotes.reject + currentMotionVotes.abstain;

  return (
    <div className="fixed inset-0 bg-[#0d0e12] text-[#f4efe4] z-50 flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Banner for Screen Projection */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2d303a]">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[#aa304f] text-white font-mono-code text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" />
            <span>PANTALLA DE SALÓN // PROYECCIÓN VIVA</span>
          </div>
          <span className="font-mono-code text-xs text-[#8c91a0]">
            EXPEDIENTE BLACKWOOD · SESIÓN #{currentSession.number}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono-code text-xs text-right">
            <div className="text-white font-bold">{currentSession.title}</div>
            <div className="text-[#8c91a0] text-[10px]">
              Ponente: {currentSession.presenterName} ({currentSession.presenterRole})
            </div>
          </div>

          <button
            onClick={() => setIsModoSalonOpen(false)}
            className="p-2 bg-[#1e222d] hover:bg-[#aa304f] text-white transition-colors cursor-pointer"
            title="Salir del Modo Salón"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-6">
        {/* Left 7 Cols: Slide Deck & Epistemological Split */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Slides Mockup / Embed Frame */}
          <div className="bg-[#181a20] border border-[#2d303a] p-4 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between font-mono-code text-xs text-[#8c91a0] border-b border-[#2d303a] pb-2">
              <span className="text-white font-bold">DIAPOSITIVAS DE LA CHARLA (SLIDE 14/28)</span>
              <a
                href={currentSession.slidesUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#aa304f] hover:underline"
              >
                <span>Abrir Google Slides</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="aspect-16/9 bg-[#0b0c0e] border border-[#252833] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-grid-lines pointer-events-none" />
              <div className="font-mono-code text-xs text-[#aa304f] tracking-widest uppercase mb-2">
                DESCLASIFICADO NARA 1982 // AN/FPS-35
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white max-w-lg mb-3">
                “La Frecuencia 425 MHz y la Alteración Craneal de Camp Hero”
              </h2>
              <p className="font-mono-code text-xs text-[#8c91a0] max-w-md">
                Evidencia de interferencia en receptores civiles y los reportes de desincronización
                neuronal en Montauk Point (1983).
              </p>
              <div className="mt-6 flex items-center gap-2 font-mono-code text-[11px] bg-[#1e222d] px-3 py-1 text-[#c8c5cb]">
                <span>Hilo de Campaña:</span>
                <span className="text-white font-bold">Paperclip ➔ MKUltra ➔ Roswell ➔ Montauk</span>
              </div>
            </div>
          </div>

          {/* Truth Layers Visualizer for Living Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code text-xs">
            {/* Fact Box */}
            <div className="bg-[#121927] border border-[#1e3a8a] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#60a5fa] font-bold border-b border-[#1e3a8a]/40 pb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  [HECHOS COMPROBADOS]
                </span>
                <span className="text-[10px] text-[#93c5fd]">{facts.length} REGISTROS</span>
              </div>
              <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                {facts.map((f) => (
                  <div key={f.id} className="bg-[#0b1220] p-2 border-l-2 border-[#3b82f6]">
                    <div className="text-white font-bold text-[11px]">{f.title}</div>
                    <div className="text-[10px] text-[#94a3b8] mt-1">{f.text}</div>
                    <div className="text-[9px] text-[#38bdf8] mt-1 italic">{f.author}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim Box */}
            <div className="bg-[#24180d] border border-[#b45309] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[#f59e0b] font-bold border-b border-[#b45309]/40 pb-1">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  [AFIRMACIONES ATRIBUIDAS]
                </span>
                <span className="text-[10px] text-[#fcd34d]">{assertions.length} CONJETURAS</span>
              </div>
              <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                {assertions.map((a) => (
                  <div key={a.id} className="bg-[#160f08] p-2 border-l-2 border-[#f59e0b]">
                    <div className="text-white font-bold text-[11px]">{a.title}</div>
                    <div className="text-[10px] text-[#cbd5e1] mt-1">{a.text}</div>
                    <div className="text-[9px] text-[#f59e0b] mt-1 italic">Atribuido a: {a.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Assembly Voting Chamber */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#181a20] border-2 border-[#aa304f] p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#2d303a] pb-3">
              <div>
                <span className="font-mono-code text-[10px] text-[#aa304f] uppercase tracking-wider font-bold">
                  ASAMBLEA EN VIVO · MOCIÓN CANON #08
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Absorción de la Frecuencia Montauk
                </h3>
              </div>
              <div
                className={`font-mono-code text-[10px] px-2 py-1 font-bold ${
                  isMotionPassed || currentMotionVotes.approve >= 4
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#aa304f] text-white animate-pulse'
                }`}
              >
                {isMotionPassed || currentMotionVotes.approve >= 4
                  ? 'CANON APROBADO'
                  : 'VOTACIÓN ABIERTA'}
              </div>
            </div>

            <div className="bg-[#0f1115] p-3 border border-[#2d303a]">
              <div className="font-mono-code text-[10px] text-[#8c91a0] uppercase mb-1">
                Texto del Postulado a Votar:
              </div>
              <p className="font-serif text-sm text-white italic leading-relaxed">
                “La estación de Camp Hero nunca fue desmantelada totalmente en 1989; su frecuencia
                de 425 MHz fue reorientada a través de la red civil de radiofaros del Atlántico Norte
                para mantener activo el canal de resonancia.”
              </p>
              <div className="mt-2 text-[10px] font-mono-code text-[#aa304f]">
                Proponente: Carlos M. (Investigador de Terreno)
              </div>
            </div>

            {/* Realtime Quorum Tally */}
            <div className="flex flex-col gap-1.5 font-mono-code text-xs">
              <div className="flex justify-between">
                <span className="text-[#8c91a0]">Cómputo de la Sala:</span>
                <span className="text-white font-bold">
                  {currentMotionVotes.approve} A favor · {currentMotionVotes.reject} En contra ·{' '}
                  {currentMotionVotes.abstain} Abstenciones
                </span>
              </div>
              <div className="w-full h-3 bg-[#252833] overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.approve / 5) * 100}%` }}
                />
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.reject / 5) * 100}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.abstain / 5) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-[#8c91a0] flex justify-between">
                <span>Quórum reglamentario: 4 de 5 votos</span>
                <span>Total computado: {totalVotes}/5</span>
              </div>
            </div>

            {/* Voting Action Buttons */}
            {!hasVotedCurrentMotion ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#2d303a]">
                <div className="font-mono-code text-[11px] text-white">
                  Emitir Voto de Salón (Tu papeleta secreta):
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono-code text-xs">
                  <button
                    onClick={() => castVoteOnCurrentMotion('approve')}
                    className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-colors cursor-pointer"
                  >
                    ✓ A FAVOR
                  </button>
                  <button
                    onClick={() => castVoteOnCurrentMotion('reject')}
                    className="py-2.5 bg-rose-800 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
                  >
                    ✕ EN CONTRA
                  </button>
                  <button
                    onClick={() => castVoteOnCurrentMotion('abstain')}
                    className="py-2.5 bg-[#2d303a] hover:bg-[#3f4350] text-white transition-colors cursor-pointer"
                  >
                    — ABSTENCIÓN
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#12281e] border border-emerald-500 p-3 font-mono-code text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tu voto ha sido registrado y sellado con hash SHA-256 en la asamblea.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
