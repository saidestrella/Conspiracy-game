import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Session } from '../types';
import {
  Calendar,
  User,
  Share2,
  ExternalLink,
  Award,
  HelpCircle,
  CheckCircle,
  FileText,
  Download,
  Filter,
} from 'lucide-react';

export const BitacoraView: React.FC = () => {
  const { sessions, canonEntries, looseEnds, showToast, setActiveTab, setSelectedNodeId } =
    useCampaign();

  const [selectedSession, setSelectedSession] = useState<Session | null>(sessions[sessions.length - 1]);
  const [filterSpeaker, setFilterSpeaker] = useState<string>('ALL');

  const filteredSessions = sessions.filter((s) => {
    if (filterSpeaker !== 'ALL' && s.presenterName !== filterSpeaker) return false;
    return true;
  });

  const getSessionCanon = (sessionNum: string) => {
    return canonEntries.filter((c) => c.sessionNumber === sessionNum);
  };

  const getSessionLooseEnds = (sessionNum: string) => {
    return looseEnds.filter((l) => l.sessionNumber === sessionNum);
  };

  const downloadActaJson = (session: Session) => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            acta: `ACTA-FORENSE-S${session.number}`,
            campaña: 'Proyecto Blackwood - Temporada 1',
            fecha: session.date,
            anfitrion: session.hostName,
            ponente: session.presenterName,
            rol: session.presenterRole,
            nodoPrincipal: session.mainNodeName,
            rutaTablero: session.routeUsedSummary,
            canonAprobado: getSessionCanon(session.number),
            cliffhanger: session.cliffhanger,
            resumen: session.summary,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Acta_Sesion_${session.number}_Blackwood.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Acta Forense de Sesión #${session.number} exportada en formato JSON.`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#aa304f] font-bold tracking-widest uppercase mb-1">
            REGISTRO CRONOLÓGICO INALTERABLE
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black">
            Bitácora de Sesiones
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Historial de presentaciones, rutas recorridas en el tablero, votos plenarios y actas de
            asamblea de la Temporada 1.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          <Filter className="w-3.5 h-3.5 text-[#aa304f]" />
          <span className="text-[#47464b]">Ponente:</span>
          <select
            value={filterSpeaker}
            onChange={(e) => setFilterSpeaker(e.target.value)}
            className="bg-[#f3ede0] border border-black px-2 py-1.5 font-mono-code text-xs cursor-pointer outline-none"
          >
            <option value="ALL">Todos los Investigadores</option>
            <option value="Carlos M.">Carlos M.</option>
            <option value="Sofía G.">Sofía G.</option>
            <option value="Elena R.">Elena R.</option>
          </select>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Session Timeline Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {filteredSessions.map((session, index) => {
            const isSelected = selectedSession?.id === session.id;
            const sessionCanon = getSessionCanon(session.number);
            const sessionLooseEnds = getSessionLooseEnds(session.number);

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`bg-[#fff9ec] border-2 border-black p-4 lg:p-5 shadow-[4px_4px_0px_0px_#18181b] flex flex-col gap-3 transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-[#aa304f] shadow-[6px_6px_0px_0px_#18181b]' : 'hover:bg-[#fcf7ee]'
                }`}
              >
                {/* Session Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c8c5cb] pb-2 font-mono-code text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-0.5 font-bold">
                      SESIÓN #{session.number}
                    </span>
                    <span className="text-[#47464b]">{session.date}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                      session.status === 'en_curso'
                        ? 'bg-[#aa304f] text-white animate-pulse'
                        : 'bg-emerald-800 text-white'
                    }`}
                  >
                    {session.status === 'en_curso' ? 'En Curso en Salón' : 'Acta Cerrada'}
                  </span>
                </div>

                {/* Title and Speaker */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-black leading-snug">
                    {session.title}
                  </h3>
                  <div className="font-mono-code text-[11px] text-[#47464b] mt-1 flex flex-wrap items-center gap-2">
                    <span>
                      Ponente: <strong className="text-black">{session.presenterName}</strong>
                    </span>
                    <span>·</span>
                    <span>{session.durationMin} minutos de exposición</span>
                    <span>·</span>
                    <span>{session.slideCount} diapositivas</span>
                  </div>
                </div>

                {/* Route Used */}
                <div className="bg-[#f3ede0] p-2.5 border border-[#c8c5cb] font-mono-code text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-black">
                    <Share2 className="w-3.5 h-3.5 text-[#aa304f]" />
                    <span className="font-bold">Trayectoria:</span>
                    <span className="text-[#47464b]">{session.routeUsedSummary}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(session.mainNodeId);
                      setActiveTab('tablero-grafo');
                    }}
                    className="text-[10px] text-[#aa304f] font-bold hover:underline"
                  >
                    Ver en Tablero ➔
                  </button>
                </div>

                {/* Summary */}
                <p className="font-body text-xs text-[#2d2b24] leading-relaxed line-clamp-3">
                  {session.summary}
                </p>

                {/* Session Footer Badges */}
                <div className="pt-2 border-t border-[#c8c5cb]/50 flex flex-wrap items-center justify-between gap-2 font-mono-code text-[10px]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#881337] font-bold">
                      ✓ {sessionCanon.length} Canon Aprobado
                    </span>
                    <span className="text-[#b45309] font-bold">
                      ⚠ {sessionLooseEnds.length} Cabos Abiertos
                    </span>
                  </div>

                  <span className="text-black font-bold underline">
                    {isSelected ? 'Inspeccionando Acta ➔' : 'Click para ver detalles'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Detailed Formal Session Act (Acta Forense) */}
        {selectedSession && (
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-20">
            <div className="bg-[#fff9ec] border-2 border-black p-5 shadow-[6px_6px_0px_0px_#18181b] flex flex-col gap-4">
              {/* Acta Header */}
              <div className="border-b-2 border-black pb-3">
                <div className="flex items-center justify-between font-mono-code text-[10px] text-[#47464b] uppercase mb-1">
                  <span>ACTA FORENSE OFICIAL</span>
                  <span className="font-bold text-black">EXP-S{selectedSession.number}-1989</span>
                </div>
                <h3 className="text-xl font-serif font-black text-black">
                  Acta de Sesión #{selectedSession.number}
                </h3>
                <div className="font-mono-code text-xs text-[#aa304f] font-bold mt-0.5">
                  {selectedSession.title}
                </div>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 gap-2 font-mono-code text-xs bg-[#f3ede0] p-3 border border-[#c8c5cb]">
                <div>
                  <span className="text-[10px] text-[#47464b] block">Fecha de Celebración:</span>
                  <span className="font-bold text-black">{selectedSession.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#47464b] block">Custodio / Anfitrión:</span>
                  <span className="font-bold text-black">{selectedSession.hostName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#47464b] block">Investigador Ponente:</span>
                  <span className="font-bold text-black">{selectedSession.presenterName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#47464b] block">Nodo de Entrada:</span>
                  <span className="font-bold text-black">{selectedSession.mainNodeName}</span>
                </div>
              </div>

              {/* Full Text of Summary */}
              <div>
                <span className="font-mono-code text-[10px] text-[#47464b] uppercase font-bold block mb-1">
                  Certificación de Hechos y Deliberación:
                </span>
                <p className="font-body text-xs text-black leading-relaxed bg-white/70 p-3 border border-[#c8c5cb]">
                  {selectedSession.summary}
                </p>
              </div>

              {/* Canon Approved in this session */}
              <div>
                <span className="font-mono-code text-[10px] text-[#881337] uppercase font-bold block mb-1">
                  Canon Aprobado en Esta Sesión:
                </span>
                <div className="flex flex-col gap-2">
                  {getSessionCanon(selectedSession.number).map((c) => (
                    <div key={c.id} className="bg-[#fff0f3] p-2.5 border border-[#881337] text-xs">
                      <div className="font-mono-code text-[10px] text-[#881337] font-bold">
                        {c.codex} ({c.version})
                      </div>
                      <div className="font-serif italic text-black mt-1">"{c.text}"</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cliffhanger */}
              <div className="bg-[#2d1b1f] text-white p-3 border border-black">
                <span className="font-mono-code text-[10px] text-[#f472b6] uppercase font-bold block mb-1">
                  Cliffhanger Registrado al Cierre:
                </span>
                <p className="font-serif text-xs italic leading-relaxed text-[#fce7f3]">
                  “{selectedSession.cliffhanger}”
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-2 font-mono-code text-xs">
                <a
                  href={selectedSession.slidesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-white border border-black hover:bg-[#eee8db] font-bold text-black flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Diapositivas</span>
                </a>

                <button
                  onClick={() => downloadActaJson(selectedSession)}
                  className="px-3 py-2 bg-black hover:bg-[#aa304f] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#18181b]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Acta JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
