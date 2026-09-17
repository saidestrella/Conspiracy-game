import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { LooseEnd, Source } from '../types';
import {
  HelpCircle,
  FolderOpen,
  Plus,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Filter,
  ArrowUpRight,
} from 'lucide-react';

export const ArchivoCabosView: React.FC = () => {
  const { sources, looseEnds, resolveLooseEnd, showToast, setActiveTab, setSelectedNodeId } =
    useCampaign();

  const [activeSubTab, setActiveSubTab] = useState<'cabos' | 'fuentes'>('cabos');

  // Loose ends filters
  const [filterCaboStatus, setFilterCaboStatus] = useState<string>('ALL');

  // Sources filters
  const [filterSourceType, setFilterSourceType] = useState<string>('ALL');

  // New Loose End Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaboTitle, setNewCaboTitle] = useState('');
  const [newCaboDetail, setNewCaboDetail] = useState('');
  const [newCaboAuthor, setNewCaboAuthor] = useState('Carlos M.');

  const filteredCabos = looseEnds.filter((l) => {
    if (filterCaboStatus !== 'ALL' && l.status !== filterCaboStatus) return false;
    return true;
  });

  const filteredSources = sources.filter((s) => {
    if (filterSourceType !== 'ALL' && s.type !== filterSourceType) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#b45309] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#b45309]" />
            <span>EXPEDIENTES RESIDUALES & FONDOS DOCUMENTALES</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black">
            Archivo & Cabos Sueltos
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Repositorio de enigmas pendientes de resolución entre sesiones y catálogo de fuentes
            desclasificadas de la campaña.
          </p>
        </div>

        {/* Subtab Toggle Buttons */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          <button
            onClick={() => setActiveSubTab('cabos')}
            className={`px-3.5 py-2 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_#18181b] ${
              activeSubTab === 'cabos'
                ? 'bg-black text-white'
                : 'bg-[#f3ede0] text-black hover:bg-[#e8e2d5]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#b45309]" />
            <span>Cabos Sueltos ({looseEnds.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fuentes')}
            className={`px-3.5 py-2 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_#18181b] ${
              activeSubTab === 'fuentes'
                ? 'bg-black text-white'
                : 'bg-[#f3ede0] text-black hover:bg-[#e8e2d5]'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#1e3a8a]" />
            <span>Fuentes Desclasificadas ({sources.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CABOS SUELTOS */}
      {activeSubTab === 'cabos' && (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c8c5cb] pb-3 font-mono-code text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black uppercase">Estado:</span>
              <select
                value={filterCaboStatus}
                onChange={(e) => setFilterCaboStatus(e.target.value)}
                className="bg-[#f3ede0] border border-black px-2 py-1 font-mono-code text-xs cursor-pointer outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="abierto">Abiertos (Pendientes)</option>
                <option value="retomado">Retomados en Hilo</option>
                <option value="resuelto">Resueltos</option>
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-[#aa304f] hover:bg-[#881337] text-white font-bold uppercase flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Nuevo Cabo</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCabos.map((cabo) => {
              const isResolved = cabo.status === 'resuelto';
              const isRetomado = cabo.status === 'retomado';

              return (
                <div
                  key={cabo.id}
                  className={`bg-[#fff9ec] border-2 shadow-[4px_4px_0px_0px_#18181b] p-4 flex flex-col justify-between gap-3 ${
                    isResolved
                      ? 'border-[#77767b] opacity-85'
                      : isRetomado
                      ? 'border-[#aa304f]'
                      : 'border-black'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#c8c5cb] pb-1.5 mb-2 font-mono-code text-[10px]">
                      <span className="font-bold text-black">{cabo.code}</span>
                      <span
                        className={`px-2 py-0.2 uppercase font-bold ${
                          isResolved
                            ? 'bg-emerald-800 text-white'
                            : isRetomado
                            ? 'bg-[#aa304f] text-white'
                            : 'bg-[#b45309] text-white'
                        }`}
                      >
                        {cabo.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-black mb-1 leading-snug">
                      {cabo.text}
                    </h4>

                    <p className="font-body text-xs text-[#2d2b24] leading-relaxed mb-2">
                      {cabo.detail}
                    </p>
                  </div>

                  <div className="border-t border-[#c8c5cb] pt-2 flex flex-col gap-2 font-mono-code text-[10px]">
                    <div className="flex justify-between text-[#47464b]">
                      <span>
                        Registrado en: <strong>Sesión #{cabo.sessionNumber}</strong> por{' '}
                        {cabo.authorName}
                      </span>
                      <span>{cabo.openedDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {cabo.relatedNodeIds.map((nid) => (
                          <button
                            key={nid}
                            onClick={() => {
                              setSelectedNodeId(nid);
                              setActiveTab('tablero-grafo');
                            }}
                            className="bg-[#f3ede0] border border-[#c8c5cb] px-1.5 py-0.5 hover:bg-[#e8e2d5] font-bold cursor-pointer"
                          >
                            Nodo {nid}
                          </button>
                        ))}
                      </div>

                      {!isResolved ? (
                        <button
                          onClick={() => resolveLooseEnd(cabo.id)}
                          className="px-2 py-1 bg-black text-white hover:bg-emerald-800 font-bold uppercase transition-colors cursor-pointer"
                        >
                          ✓ Marcar Resuelto
                        </button>
                      ) : (
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Resuelto en Actas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: FUENTES DESCLASIFICADAS */}
      {activeSubTab === 'fuentes' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#c8c5cb] pb-3 font-mono-code text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black uppercase">Tipo de Documento:</span>
              <select
                value={filterSourceType}
                onChange={(e) => setFilterSourceType(e.target.value)}
                className="bg-[#f3ede0] border border-black px-2 py-1 font-mono-code text-xs cursor-pointer outline-none"
              >
                <option value="ALL">Todos los Tipos</option>
                <option value="documento_oficial">Documento Oficial</option>
                <option value="foia">Desclasificación FOIA</option>
                <option value="croquis">Croquis / Planos Técnicos</option>
                <option value="audio">Cintas de Audio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className="bg-[#fff9ec] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#18181b] flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between font-mono-code text-[10px] border-b border-[#c8c5cb] pb-1.5 mb-2">
                    <span className="font-bold text-[#1e3a8a]">{source.code}</span>
                    <span className="bg-[#1e3a8a] text-white px-1.5 py-0.2 uppercase">
                      {source.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-black mb-1 leading-snug">
                    {source.title}
                  </h4>

                  <div className="font-mono-code text-[10px] text-[#47464b] mb-2">
                    Emisor: <strong>{source.author}</strong> ({source.date})
                  </div>

                  <p className="font-body text-xs text-[#2d2b24] leading-relaxed bg-[#f3ede0] p-2 border border-[#c8c5cb]">
                    {source.note}
                  </p>
                </div>

                <div className="border-t border-[#c8c5cb] pt-2 flex items-center justify-between font-mono-code text-[10px]">
                  <span className="text-[#47464b]">Aportado por: {source.addedBy}</span>

                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#aa304f] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Ver Expediente</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#77767b] italic">Copia en papel</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for new loose end */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#fff9ec] border-2 border-black shadow-[8px_8px_0px_0px_#18181b] p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="border-b-2 border-black pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[10px] text-[#b45309] font-bold uppercase">
                  NUEVO REGISTRO FORENSE
                </span>
                <h3 className="text-xl font-serif font-black text-black">
                  Registrar Cabo Abierto
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#eee8db] text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 font-mono-code text-xs">
              <div>
                <label className="block text-[#47464b] font-bold uppercase text-[10px] mb-1">
                  Enunciado del Enigma:
                </label>
                <input
                  type="text"
                  value={newCaboTitle}
                  onChange={(e) => setNewCaboTitle(e.target.value)}
                  placeholder="Ej: El segundo receptor sintonizado en la frecuencia de 425 MHz..."
                  className="w-full bg-[#f3ede0] border border-black p-2 text-black outline-none font-serif text-sm"
                />
              </div>

              <div>
                <label className="block text-[#47464b] font-bold uppercase text-[10px] mb-1">
                  Detalle e Hipótesis:
                </label>
                <textarea
                  rows={3}
                  value={newCaboDetail}
                  onChange={(e) => setNewCaboDetail(e.target.value)}
                  placeholder="Explica qué contradicción o pista documental quedó sin resolver..."
                  className="w-full bg-[#f3ede0] border border-black p-2 text-black outline-none resize-none font-body text-xs"
                />
              </div>

              <div className="pt-2 border-t border-[#c8c5cb] flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-white border border-black hover:bg-[#eee8db] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    showToast('Nuevo cabo suelto incorporado a la bitácora activa.');
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-black hover:bg-[#aa304f] text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  Registrar Cabo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
