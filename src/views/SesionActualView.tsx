import React, { useState, useEffect } from 'react';
import { useCampaign } from '../context/CampaignContext';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Check,
  ExternalLink,
  Lock,
  ArrowRight,
  Vote,
  FileCheck,
} from 'lucide-react';

export const SesionActualView: React.FC = () => {
  const {
    sessions,
    claims,
    nodes,
    currentUser,
    currentMotionVotes,
    hasVotedCurrentMotion,
    castVoteOnCurrentMotion,
    isMotionPassed,
    closeActiveSession,
    showToast,
  } = useCampaign();

  const currentSession = sessions.find((s) => s.id === 'S04') || sessions[0];
  const currentNode = nodes.find((n) => n.id === currentSession.mainNodeId);

  // Stopwatch state
  const [seconds, setSeconds] = useState(18 * 60 + 42); // 18m 42s
  const [timerRunning, setTimerRunning] = useState(true);

  // Session closure form state
  const [selectedNextNodeId, setSelectedNextNodeId] = useState('N05');
  const [cliffhangerText, setCliffhangerText] = useState(
    '¿Quién apagó el generador auxiliar cuando los archivos de Camp Hero desaparecieron en la tormenta de 1984?'
  );
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeClaims = claims.filter((c) => c.sessionId === 'S04' || c.nodeId === 'N04');
  const facts = activeClaims.filter((c) => c.truthLayer === 'HECHO');
  const assertions = activeClaims.filter((c) => c.truthLayer === 'AFIRMACIÓN');

  const totalVotes =
    currentMotionVotes.approve + currentMotionVotes.reject + currentMotionVotes.abstain;

  // Next candidate nodes (1-hop or 2-hop from N04)
  const candidateNodes = nodes.filter(
    (n) => n.id === 'N05' || n.id === 'N06' || n.id === 'N07' || n.id === 'N08'
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Session Top Bar with Live Telemetry */}
      <div className="bg-[#fff9ec] border-2 border-black p-4 lg:p-5 shadow-[5px_5px_0px_0px_#18181b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-code text-[10px] bg-[#aa304f] text-white px-2 py-0.5 font-bold uppercase tracking-wider animate-pulse">
              EN VIVO EN SALÓN
            </span>
            <span className="font-mono-code text-[10px] text-[#47464b]">
              PROYECTO BLACKWOOD · SESIÓN #{currentSession.number}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-black text-black">
            {currentSession.title}
          </h1>
          <div className="font-mono-code text-xs text-[#47464b] mt-1 flex flex-wrap items-center gap-3">
            <span>
              Ponente: <strong className="text-black">{currentSession.presenterName}</strong>
            </span>
            <span>·</span>
            <span>
              Nodo Asignado: <strong className="text-black">{currentNode?.name}</strong> (
              {currentNode?.code})
            </span>
            <span>·</span>
            <a
              href={currentSession.slidesUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#aa304f] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Presentación (Google Slides)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Stopwatch & Speaker Clock */}
        <div className="bg-[#f3ede0] border-2 border-black p-3 flex items-center gap-3 shadow-[3px_3px_0px_0px_#18181b] shrink-0">
          <div className="flex flex-col">
            <span className="font-mono-code text-[9px] text-[#47464b] uppercase font-bold">
              CRONÓMETRO DE TARIMA
            </span>
            <span className="font-mono-code text-2xl font-bold text-black tracking-wider">
              {formatTimer(seconds)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-2 bg-black text-white hover:bg-[#aa304f] transition-colors cursor-pointer"
              title={timerRunning ? 'Pausar tiempo' : 'Reanudar tiempo'}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSeconds((s) => s + 300)}
              className="p-1.5 px-2 bg-white border border-black font-mono-code text-[10px] font-bold hover:bg-[#e8e2d5] cursor-pointer"
              title="Añadir 5 minutos a la exposición"
            >
              +5m
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="p-2 bg-white border border-black hover:bg-[#e8e2d5] cursor-pointer"
              title="Reiniciar cronómetro"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Facts vs Claims) | Right Column (Assembly Chamber & Closure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Epistemological Records of Session #04 */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div>
              <h2 className="font-mono-code text-xs font-bold text-black uppercase tracking-wider">
                Desglose Epistemológico de la Sesión
              </h2>
              <p className="font-mono-code text-[10px] text-[#47464b]">
                Separación obligatoria entre registros documentales certificados y conjeturas testimoniales
              </p>
            </div>
            <button
              onClick={() => showToast('Formulario para adjuntar nuevo registro abierto.')}
              className="px-2.5 py-1 bg-white border border-black font-mono-code text-[10px] font-bold hover:bg-[#eee8db] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-[#aa304f]" />
              <span>Añadir Registro</span>
            </button>
          </div>

          {/* Facts Section */}
          <div className="bg-[#fff9ec] border-2 border-[#1e3a8a] p-4 shadow-[3px_3px_0px_0px_#1e3a8a] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#1e3a8a]/30 pb-2">
              <span className="font-mono-code text-xs font-bold text-[#1e3a8a] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                [HECHOS OFICIALES COMPROBADOS] ({facts.length})
              </span>
              <span className="font-mono-code text-[9px] bg-[#1e3a8a] text-white px-2 py-0.5 uppercase font-bold">
                Nivel Verificable
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {facts.map((fact) => (
                <div key={fact.id} className="bg-white/80 border border-[#1e3a8a]/40 p-3 shadow-xs">
                  <div className="flex items-center justify-between font-mono-code text-[10px] text-[#1e3a8a] mb-1">
                    <span className="font-bold">{fact.code}</span>
                    <span>{fact.dateStr}</span>
                  </div>
                  <h4 className="font-bold text-sm text-black mb-1">{fact.title}</h4>
                  <p className="font-body text-xs text-[#2d2b24] leading-relaxed mb-2">
                    {fact.text}
                  </p>
                  <div className="font-mono-code text-[9px] text-[#47464b] border-t border-[#1e3a8a]/15 pt-1 flex justify-between">
                    <span>Certificado por: {fact.author}</span>
                    <span className="text-emerald-700 font-bold">✓ DESCLASIFICADO</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Claims Section */}
          <div className="bg-[#fff9ec] border-2 border-dashed border-[#b45309] p-4 shadow-[3px_3px_0px_0px_#b45309] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#b45309]/30 pb-2">
              <span className="font-mono-code text-xs font-bold text-[#b45309] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                [AFIRMACIONES ATRIBUIDAS // CONJETURAS] ({assertions.length})
              </span>
              <span className="font-mono-code text-[9px] bg-[#b45309] text-white px-2 py-0.5 uppercase font-bold">
                Testimonial no probado
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {assertions.map((claim) => (
                <div key={claim.id} className="bg-white/80 border border-[#b45309]/40 p-3 shadow-xs">
                  <div className="flex items-center justify-between font-mono-code text-[10px] text-[#b45309] mb-1">
                    <span className="font-bold">{claim.code}</span>
                    <span>{claim.dateStr}</span>
                  </div>
                  <h4 className="font-bold text-sm text-black mb-1">{claim.title}</h4>
                  <p className="font-body text-xs text-[#2d2b24] leading-relaxed mb-2">
                    {claim.text}
                  </p>
                  <div className="font-mono-code text-[9px] text-[#47464b] border-t border-[#b45309]/15 pt-1 flex justify-between">
                    <span>Atribuido a: {claim.author}</span>
                    <span className="text-amber-800 font-bold uppercase">
                      {claim.status === 'conjetura_extrema' ? '⚠ Conjetura Extrema' : 'Conjetura'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Assembly Voting Chamber & Final Session Closure */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Active Canon Voting Box */}
          <div className="bg-[#fff9ec] border-2 border-[#aa304f] p-4 shadow-[6px_6px_0px_0px_#aa304f] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#aa304f]/30 pb-2">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#aa304f]" />
                <span className="font-mono-code text-xs font-bold text-[#aa304f] uppercase tracking-wider">
                  CÁMARA DE VOTACIÓN DE CANON
                </span>
              </div>
              <span
                className={`font-mono-code text-[9px] px-2 py-0.5 font-bold uppercase ${
                  isMotionPassed || currentMotionVotes.approve >= 4
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#aa304f] text-white animate-pulse'
                }`}
              >
                {isMotionPassed || currentMotionVotes.approve >= 4
                  ? 'CANON PROMULGADO'
                  : 'MOCIÓN EN CURSO'}
              </span>
            </div>

            <div className="bg-[#f3ede0] p-3 border border-[#c8c5cb]">
              <div className="font-mono-code text-[10px] text-[#47464b] font-bold uppercase mb-1">
                Moción #08 (Proponente: {currentSession.presenterName}):
              </div>
              <p className="font-serif text-xs text-black italic leading-relaxed">
                “La estación de radar en Montauk Point nunca fue desmantelada por completo; su
                frecuencia de 425 MHz fue absorbida por la red civil de radiofaros y torres de
                comunicación en 1989 para mantener un canal de resonancia pasivo.”
              </p>
              <div className="mt-2 pt-1 border-t border-[#c8c5cb] font-mono-code text-[9px] text-[#aa304f]">
                Impacto Canónico: Convierte a las torres civiles en nodos receptores de campaña.
              </div>
            </div>

            {/* Voting Bar & Quorum */}
            <div className="flex flex-col gap-1 font-mono-code text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#47464b]">Estado del Quórum:</span>
                <span className="font-bold text-black">
                  {currentMotionVotes.approve} Favor / {currentMotionVotes.reject} Contra /{' '}
                  {currentMotionVotes.abstain} Abs.
                </span>
              </div>

              <div className="w-full bg-[#dfd9cd] h-3 border border-black flex overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.approve / 5) * 100}%` }}
                  title="A favor"
                />
                <div
                  className="bg-rose-700 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.reject / 5) * 100}%` }}
                  title="En contra"
                />
                <div
                  className="bg-amber-600 h-full transition-all duration-300"
                  style={{ width: `${(currentMotionVotes.abstain / 5) * 100}%` }}
                  title="Abstención"
                />
              </div>

              <div className="flex justify-between text-[9px] text-[#47464b]">
                <span>Mínimo para Canonizar: 4 votos afirmativos</span>
                <span>Total papeletas: {totalVotes}/5</span>
              </div>
            </div>

            {/* Vote Action */}
            {!hasVotedCurrentMotion ? (
              <div className="bg-white p-3 border border-black flex flex-col gap-2">
                <div className="font-mono-code text-[11px] font-bold text-black flex items-center justify-between">
                  <span>Tu Voto como {currentUser.name}:</span>
                  <span className="text-[9px] text-[#47464b]">Voto Secreto & Certificado</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono-code text-xs">
                  <button
                    onClick={() => castVoteOnCurrentMotion('approve')}
                    className="py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer"
                  >
                    ✓ A FAVOR
                  </button>
                  <button
                    onClick={() => castVoteOnCurrentMotion('reject')}
                    className="py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold transition-colors cursor-pointer"
                  >
                    ✕ EN CONTRA
                  </button>
                  <button
                    onClick={() => castVoteOnCurrentMotion('abstain')}
                    className="py-2 bg-[#47464b] hover:bg-black text-white transition-colors cursor-pointer"
                  >
                    — ABSTENCIÓN
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-600 p-3 flex items-center gap-2 font-mono-code text-xs text-emerald-900">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Tu papeleta secreta ya ha sido depositada y sellada en el acta.</span>
              </div>
            )}

            {/* Wax Seal / Canon Stamped Animation */}
            {(isMotionPassed || currentMotionVotes.approve >= 4) && (
              <div className="p-3 bg-[#fff0f3] border-2 border-[#881337] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#881337] text-white flex items-center justify-center font-mono-code text-xs font-black shadow-md shrink-0">
                  SELLO
                </div>
                <div>
                  <div className="font-mono-code text-xs font-bold text-[#881337] uppercase">
                    PROMULGADO COMO CANON-04
                  </div>
                  <div className="font-mono-code text-[10px] text-[#47464b]">
                    Registrado en el Gran Libro con Hash SHA-256 de asamblea.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session Closure & Transition Card */}
          <div className="bg-[#fff9ec] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#18181b] flex flex-col gap-3">
            <div className="border-b border-[#c8c5cb] pb-1.5 flex items-center justify-between">
              <span className="font-mono-code text-xs font-bold text-black uppercase">
                Clausura de Sesión & Siguiente Rumbo
              </span>
              <span className="font-mono-code text-[9px] bg-black text-white px-1.5 py-0.5">
                Rol: {currentUser.role.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-2 font-mono-code text-xs">
              <label className="text-[#47464b] text-[10px] font-bold uppercase">
                Fijar Siguiente Nodo del Grafo (Regla de los 2 Saltos):
              </label>
              <select
                value={selectedNextNodeId}
                onChange={(e) => setSelectedNextNodeId(e.target.value)}
                className="w-full bg-[#f3ede0] border border-black p-2 font-mono-code text-xs text-black cursor-pointer outline-none"
              >
                {candidateNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.code} — {n.name} [{n.truthLayer}] ({n.category})
                  </option>
                ))}
              </select>

              <label className="text-[#47464b] text-[10px] font-bold uppercase mt-1">
                Cliffhanger para el Próximo Investigador:
              </label>
              <textarea
                value={cliffhangerText}
                onChange={(e) => setCliffhangerText(e.target.value)}
                rows={2}
                className="w-full bg-[#f3ede0] border border-black p-2 font-mono-code text-xs text-black outline-none resize-none"
              />
            </div>

            <button
              onClick={() => closeActiveSession(selectedNextNodeId, cliffhangerText)}
              className="w-full py-2.5 bg-black hover:bg-[#aa304f] text-white font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_0px_#18181b] cursor-pointer mt-1"
            >
              <FileCheck className="w-4 h-4" />
              <span>Cerrar Sesión #04 & Generar Acta Forense</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
