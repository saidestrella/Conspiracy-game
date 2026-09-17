import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { CanonEntry, CanonStatus } from '../types';
import {
  Flame,
  CheckCircle,
  Clock,
  History,
  AlertCircle,
  Plus,
  Filter,
  Download,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CanonView: React.FC = () => {
  const { canonEntries, addCanonProposal, showToast } = useCampaign();

  const [filterStatus, setFilterStatus] = useState<CanonStatus | 'ALL'>('ALL');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    'CANON-02': true,
  });

  // New Proposal Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newProponent, setNewProponent] = useState('Agente Cooper');
  const [newRelatedNodes, setNewRelatedNodes] = useState('N04, N05');

  const toggleExpand = (id: string) => {
    setExpandedVersions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEntries = canonEntries.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addCanonProposal(
      newText,
      newRelatedNodes.split(',').map((s) => s.trim()),
      newProponent
    );
    setNewText('');
    setIsModalOpen(false);
  };

  const exportCanonJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(canonEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'Canon_Oficial_Proyecto_Blackwood.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Archivo oficial de Canon exportado exitosamente.');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#881337] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>REGISTRO OFICIAL DE VERDADES DE CAMPAÑA</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black">
            Canon Aprobado (El Libro Rojo)
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Elementos de ficción y conjeturas aprobadas por mayoría absoluta en asamblea.
            Constituyen la verdad inquebrantable que gobierna el universo de la campaña.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-[#aa304f] hover:bg-[#881337] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#18181b] cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Proponer Moción</span>
          </button>
          <button
            onClick={exportCanonJSON}
            className="px-3.5 py-2 bg-[#f3ede0] border border-black font-bold uppercase tracking-wider text-black hover:bg-[#e8e2d5] flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#c8c5cb] pb-3 font-mono-code text-xs">
        <span className="font-bold text-black uppercase mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#aa304f]" />
          <span>Filtrar Artículos:</span>
        </span>

        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all ${
            filterStatus === 'ALL'
              ? 'bg-black text-white'
              : 'bg-[#f3ede0] text-[#47464b] hover:bg-[#e8e2d5]'
          }`}
        >
          Todos ({canonEntries.length})
        </button>

        <button
          onClick={() => setFilterStatus('vigente')}
          className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all ${
            filterStatus === 'vigente'
              ? 'bg-[#1e3a8a] text-white'
              : 'bg-[#f3ede0] text-[#1e3a8a] hover:bg-[#1e3a8a]/10'
          }`}
        >
          Vigentes ({canonEntries.filter((c) => c.status === 'vigente').length})
        </button>

        <button
          onClick={() => setFilterStatus('enmendada')}
          className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all ${
            filterStatus === 'enmendada'
              ? 'bg-[#aa304f] text-white'
              : 'bg-[#f3ede0] text-[#aa304f] hover:bg-[#aa304f]/10'
          }`}
        >
          Enmendadas ({canonEntries.filter((c) => c.status === 'enmendada').length})
        </button>

        <button
          onClick={() => setFilterStatus('retirada')}
          className={`px-3 py-1 font-bold uppercase cursor-pointer transition-all ${
            filterStatus === 'retirada'
              ? 'bg-[#47464b] text-white'
              : 'bg-[#f3ede0] text-[#47464b] hover:bg-[#47464b]/10'
          }`}
        >
          Retiradas ({canonEntries.filter((c) => c.status === 'retirada').length})
        </button>
      </div>

      {/* Canon List */}
      <div className="flex flex-col gap-5">
        {filteredEntries.map((entry) => {
          const isEnmended = entry.status === 'enmendada';
          const isRetracted = entry.status === 'retirada';
          const isExpanded = expandedVersions[entry.id];

          return (
            <div
              key={entry.id}
              className={`bg-[#fff9ec] border-2 shadow-[5px_5px_0px_0px_#18181b] p-5 lg:p-6 flex flex-col gap-4 ${
                isEnmended
                  ? 'border-[#aa304f]'
                  : isRetracted
                  ? 'border-[#77767b] opacity-80'
                  : 'border-black'
              }`}
            >
              {/* Card Top Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c8c5cb] pb-2.5 font-mono-code text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-black text-sm">{entry.codex}</span>
                  <span className="text-[#47464b]">
                    Sesión #{entry.sessionNumber} · {entry.date}
                  </span>
                  <span className="text-[#47464b]">· Proponente: {entry.proponentName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 font-bold uppercase text-[10px] ${
                      entry.status === 'vigente'
                        ? 'bg-emerald-800 text-white'
                        : entry.status === 'enmendada'
                        ? 'bg-[#aa304f] text-white'
                        : 'bg-[#47464b] text-white'
                    }`}
                  >
                    {entry.status.toUpperCase()} // V{entry.version}
                  </span>
                </div>
              </div>

              {/* Main Canon Text (Serif Display) */}
              <div className="py-1">
                <p className="font-serif text-lg lg:text-xl font-medium text-black leading-relaxed italic">
                  “{entry.text}”
                </p>
              </div>

              {/* Enmended Version Divergence & Audit Log */}
              {isEnmended && (
                <div className="bg-[#fcedf1] border border-[#aa304f] p-3 flex flex-col gap-2 font-mono-code text-xs">
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="flex items-center justify-between font-bold text-[#881337] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#aa304f]" />
                      <span>HISTORIAL DE ENMIENDA (Divergencia V1.0 ➔ V2.0)</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-[#aa304f]/30 flex flex-col gap-2">
                      <div>
                        <span className="text-[10px] text-[#47464b] uppercase font-bold block mb-0.5">
                          Texto Original Derogado (V1.0):
                        </span>
                        <p className="line-through text-[#77767b] font-serif text-xs italic bg-white/60 p-2 border border-[#c8c5cb]">
                          “{entry.originalText}”
                        </p>
                      </div>

                      <div className="text-[11px] text-[#47464b]">
                        <strong className="text-black">Motivo de Enmienda:</strong>{' '}
                        {entry.amendmentReason}
                      </div>

                      <div className="text-[10px] text-[#881337]">
                        Enmendado por: {entry.enmendedBy} en {entry.enmendedSession}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer Telemetry */}
              <div className="pt-2 border-t border-[#c8c5cb] flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs text-[#47464b]">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-black font-bold">
                    Cómputo de Votos: {entry.votesFor} A favor · {entry.votesAgainst} En contra ·{' '}
                    {entry.votesAbstain} Abstenciones
                  </span>
                  <span>·</span>
                  <span>Impacto: {entry.nodeRelationSummary}</span>
                </div>

                <div className="text-[10px] text-[#77767b] bg-[#f3ede0] px-2 py-1 border border-[#c8c5cb]">
                  Hash de Bloque: {entry.auditBlockHash}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#fff9ec] border-2 border-black shadow-[8px_8px_0px_0px_#18181b] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[10px] text-[#aa304f] font-bold uppercase">
                  MOCIÓN DE SALA
                </span>
                <h3 className="text-xl font-serif font-black text-black">
                  Proponer Nueva Entrada de Canon
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#eee8db] text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="flex flex-col gap-3 font-mono-code text-xs">
              <div>
                <label className="block text-[#47464b] font-bold uppercase text-[10px] mb-1">
                  Texto del Postulado Canónico:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Ej: El transmisor de Montauk utilizaba un amplificador de radiofaros civiles para eludir la inspección del Congreso..."
                  className="w-full bg-[#f3ede0] border border-black p-2.5 text-black outline-none resize-none font-serif text-sm"
                />
              </div>

              <div>
                <label className="block text-[#47464b] font-bold uppercase text-[10px] mb-1">
                  Investigador Proponente:
                </label>
                <input
                  type="text"
                  value={newProponent}
                  onChange={(e) => setNewProponent(e.target.value)}
                  className="w-full bg-[#f3ede0] border border-black p-2 text-black outline-none"
                />
              </div>

              <div>
                <label className="block text-[#47464b] font-bold uppercase text-[10px] mb-1">
                  Nodos Vinculados (Separados por coma):
                </label>
                <input
                  type="text"
                  value={newRelatedNodes}
                  onChange={(e) => setNewRelatedNodes(e.target.value)}
                  className="w-full bg-[#f3ede0] border border-black p-2 text-black outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#c8c5cb] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-white border border-black hover:bg-[#eee8db] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-[#aa304f] text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  Someter a Votación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
