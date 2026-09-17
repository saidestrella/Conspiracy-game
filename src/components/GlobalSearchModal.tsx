import React, { useState, useMemo } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Search, X, Share2, CheckCircle, Folder, HelpCircle, User } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    nodes,
    canonEntries,
    sources,
    looseEnds,
    allUsers,
    setSelectedNodeId,
    setActiveTab,
  } = useCampaign();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { nodes: [], canon: [], sources: [], looseEnds: [], users: [] };

    return {
      nodes: nodes.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.code.toLowerCase().includes(q) ||
          n.neutralDescription.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      ),
      canon: canonEntries.filter(
        (c) =>
          c.text.toLowerCase().includes(q) ||
          c.codex.toLowerCase().includes(q) ||
          c.proponentName.toLowerCase().includes(q)
      ),
      sources: sources.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.note.toLowerCase().includes(q)
      ),
      looseEnds: looseEnds.filter(
        (l) =>
          l.text.toLowerCase().includes(q) ||
          l.detail.toLowerCase().includes(q) ||
          l.authorName.toLowerCase().includes(q)
      ),
      users: allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.title.toLowerCase().includes(q) ||
          u.badge.toLowerCase().includes(q)
      ),
    };
  }, [query, nodes, canonEntries, sources, looseEnds, allUsers]);

  if (!isSearchOpen) return null;

  const totalResults =
    results.nodes.length +
    results.canon.length +
    results.sources.length +
    results.looseEnds.length +
    results.users.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#fff9ec] border-2 border-black shadow-[8px_8px_0px_0px_#18181b] overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3 bg-[#eee8db] border-b-2 border-black flex items-center gap-3">
          <Search className="w-5 h-5 text-black shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar por conspiración, código, testigo, fuente o canon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-mono-code text-sm text-black placeholder:text-[#77767b] outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:bg-[#dfd9cd] text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 flex flex-col gap-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 font-mono-code text-xs text-[#77767b]">
              Escribe un término de búsqueda para rastrear en el archivo general.
              <div className="mt-2 text-[10px]">Ejemplos: "Montauk", "Paperclip", "Binaural", "1983", "Radar", "Canon"</div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 font-mono-code text-xs text-[#77767b]">
              No se encontraron coincidencias forenses para "{query}".
            </div>
          ) : (
            <>
              {/* Nodes */}
              {results.nodes.length > 0 && (
                <div>
                  <div className="font-mono-code text-[10px] uppercase font-bold text-[#aa304f] mb-1.5 flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    <span>Nodos del Tablero ({results.nodes.length})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {results.nodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setActiveTab('tablero-grafo');
                          setIsSearchOpen(false);
                        }}
                        className="p-2 bg-[#f3ede0] hover:bg-[#e8e2d5] text-left transition-colors cursor-pointer border border-[#c8c5cb]/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono-code text-xs font-bold text-black flex items-center gap-2">
                            <span className="text-[#aa304f]">{node.code}</span>
                            <span>{node.name}</span>
                          </div>
                          <div className="font-body-sm text-[11px] text-[#47464b] line-clamp-1">
                            {node.neutralDescription}
                          </div>
                        </div>
                        <span className="font-mono-code text-[9px] bg-black text-white px-1.5 py-0.5 uppercase shrink-0">
                          {node.truthLayer}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Canon */}
              {results.canon.length > 0 && (
                <div>
                  <div className="font-mono-code text-[10px] uppercase font-bold text-[#881337] mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Canon de Asamblea ({results.canon.length})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {results.canon.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveTab('canon-aprobado');
                          setIsSearchOpen(false);
                        }}
                        className="p-2 bg-[#f3ede0] hover:bg-[#e8e2d5] text-left transition-colors cursor-pointer border border-[#c8c5cb]/40"
                      >
                        <div className="font-mono-code text-[10px] text-[#881337] font-bold">
                          {c.codex} // Sesión {c.sessionNumber} ({c.status.toUpperCase()})
                        </div>
                        <div className="font-body-sm text-xs text-black font-semibold mt-0.5 line-clamp-2">
                          "{c.text}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {results.sources.length > 0 && (
                <div>
                  <div className="font-mono-code text-[10px] uppercase font-bold text-[#1e3a8a] mb-1.5 flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    <span>Fuentes Clasificadas ({results.sources.length})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {results.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveTab('archivo-y-cabos');
                          setIsSearchOpen(false);
                        }}
                        className="p-2 bg-[#f3ede0] hover:bg-[#e8e2d5] text-left transition-colors cursor-pointer border border-[#c8c5cb]/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono-code text-xs font-bold text-black">{s.title}</div>
                          <div className="font-body-sm text-[11px] text-[#47464b]">{s.author} ({s.date})</div>
                        </div>
                        <span className="font-mono-code text-[9px] bg-[#1e3a8a] text-white px-1.5 py-0.5 uppercase shrink-0">
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loose Ends */}
              {results.looseEnds.length > 0 && (
                <div>
                  <div className="font-mono-code text-[10px] uppercase font-bold text-[#b45309] mb-1.5 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>Cabos Sueltos ({results.looseEnds.length})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {results.looseEnds.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setActiveTab('archivo-y-cabos');
                          setIsSearchOpen(false);
                        }}
                        className="p-2 bg-[#f3ede0] hover:bg-[#e8e2d5] text-left transition-colors cursor-pointer border border-[#c8c5cb]/40"
                      >
                        <div className="font-mono-code text-xs font-bold text-black">{l.text}</div>
                        <div className="font-body-sm text-[11px] text-[#47464b] line-clamp-1">{l.detail}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <div className="font-mono-code text-[10px] uppercase font-bold text-black mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Investigadores ({results.users.length})</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {results.users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setActiveTab('expedientes-personas');
                          setIsSearchOpen(false);
                        }}
                        className="p-2 bg-[#f3ede0] hover:bg-[#e8e2d5] text-left transition-colors cursor-pointer border border-[#c8c5cb]/40 flex items-center justify-between"
                      >
                        <div className="font-mono-code text-xs font-bold text-black">{u.name}</div>
                        <div className="font-mono-code text-[10px] text-[#47464b]">{u.badge} · {u.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-[#eee8db] border-t border-[#c8c5cb] flex items-center justify-between font-mono-code text-[10px] text-[#47464b]">
          <span>Pulsa [ESC] para cerrar</span>
          <span>Búsqueda global indexada en tiempo real</span>
        </div>
      </div>
    </div>
  );
};
