import React, { useState, useRef } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { CampaignNode, TruthLayer } from '../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Lock,
  Layers,
  Info,
  X,
} from 'lucide-react';

export const TableroView: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    claims,
    currentUser,
    showToast,
    setActiveTab,
  } = useCampaign();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PLAYED' | 'ELIGIBLE_1' | 'ELIGIBLE_2'>(
    'ALL'
  );
  const [truthFilter, setTruthFilter] = useState<TruthLayer | 'ALL'>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);

  // Active node is S04 (Montauk N04)
  const activeNode = nodes.find((n) => n.id === 'N04');

  // Identify 1-hop and 2-hop neighbor node IDs from Montauk N04
  const oneHopNodeIds = new Set<string>();
  const twoHopNodeIds = new Set<string>();

  edges.forEach((e) => {
    if (e.fromNodeId === 'N04') oneHopNodeIds.add(e.toNodeId);
    if (e.toNodeId === 'N04') oneHopNodeIds.add(e.fromNodeId);
  });

  edges.forEach((e) => {
    if (oneHopNodeIds.has(e.fromNodeId) && e.toNodeId !== 'N04' && !oneHopNodeIds.has(e.toNodeId)) {
      twoHopNodeIds.add(e.toNodeId);
    }
    if (oneHopNodeIds.has(e.toNodeId) && e.fromNodeId !== 'N04' && !oneHopNodeIds.has(e.fromNodeId)) {
      twoHopNodeIds.add(e.fromNodeId);
    }
  });

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-card') || (e.target as HTMLElement).closest('.board-ui')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node filtering logic
  const isNodeVisible = (node: CampaignNode) => {
    if (truthFilter !== 'ALL' && node.truthLayer !== truthFilter) return false;
    if (activeFilter === 'PLAYED') {
      return node.id === 'N01' || node.id === 'N02' || node.id === 'N03' || node.id === 'N04';
    }
    if (activeFilter === 'ELIGIBLE_1') {
      return node.id === 'N04' || oneHopNodeIds.has(node.id);
    }
    if (activeFilter === 'ELIGIBLE_2') {
      return node.id === 'N04' || oneHopNodeIds.has(node.id) || twoHopNodeIds.has(node.id);
    }
    return true;
  };

  // Node styling by truth layer
  const getNodeBorderAndBadge = (node: CampaignNode) => {
    const isSelected = node.id === selectedNodeId;
    const isLive = node.id === 'N04';

    let borderClass = 'border-black';
    let badgeBg = 'bg-black text-white';

    if (node.truthLayer === 'HECHO') {
      borderClass = isSelected ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]' : 'border-[#1e3a8a]';
      badgeBg = 'bg-[#1e3a8a] text-white';
    } else if (node.truthLayer === 'AFIRMACIÓN') {
      borderClass = isSelected
        ? 'border-[#b45309] ring-2 ring-[#b45309]'
        : 'border-dashed border-[#b45309]';
      badgeBg = 'bg-[#b45309] text-white';
    } else if (node.truthLayer === 'CANON') {
      borderClass = isSelected ? 'border-[#aa304f] ring-2 ring-[#aa304f]' : 'border-[#aa304f]';
      badgeBg = 'bg-[#aa304f] text-white';
    }

    if (isLive) {
      borderClass = 'border-2 border-[#aa304f] ring-4 ring-[#aa304f]/20 shadow-lg';
    }

    return { borderClass, badgeBg };
  };

  // Selected node claims
  const nodeClaims = claims.filter((c) => c.nodeId === selectedNode?.id);

  return (
    <div className="relative h-[calc(100vh-5.5rem)] flex flex-col bg-[#f5efe3] border-2 border-black overflow-hidden select-none">
      {/* Top Filter & Toolbar */}
      <div className="board-ui h-14 bg-[#f9f3e6] border-b-2 border-black px-4 flex items-center justify-between z-20 shrink-0">
        {/* Left: View Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="font-mono-code text-[11px] font-bold text-black uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>Filtros de Red:</span>
          </span>

          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 font-mono-code text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
              activeFilter === 'ALL'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white text-[#47464b] border-[#c8c5cb] hover:bg-[#eee8db]'
            }`}
          >
            Todos ({nodes.length})
          </button>

          <button
            onClick={() => setActiveFilter('PLAYED')}
            className={`px-2.5 py-1 font-mono-code text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
              activeFilter === 'PLAYED'
                ? 'bg-[#aa304f] text-white border-[#aa304f] shadow-xs'
                : 'bg-white text-[#aa304f] border-[#aa304f]/40 hover:bg-[#aa304f]/10'
            }`}
          >
            Hilo Jugado (4)
          </button>

          <button
            onClick={() => setActiveFilter('ELIGIBLE_1')}
            className={`px-2.5 py-1 font-mono-code text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
              activeFilter === 'ELIGIBLE_1'
                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs'
                : 'bg-white text-[#1e3a8a] border-[#1e3a8a]/40 hover:bg-[#1e3a8a]/10'
            }`}
          >
            1 Salto Elegible ({oneHopNodeIds.size})
          </button>

          <button
            onClick={() => setActiveFilter('ELIGIBLE_2')}
            className={`px-2.5 py-1 font-mono-code text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
              activeFilter === 'ELIGIBLE_2'
                ? 'bg-[#b45309] text-white border-[#b45309] shadow-xs'
                : 'bg-white text-[#b45309] border-[#b45309]/40 hover:bg-[#b45309]/10'
            }`}
          >
            2 Saltos (Regla Máx.)
          </button>
        </div>

        {/* Right: Zoom controls & Layer toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center border border-black bg-white">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 hover:bg-[#eee8db] transition-colors cursor-pointer border-r border-black"
              title="Alejar Zoom"
            >
              <ZoomOut className="w-4 h-4 text-black" />
            </button>
            <span className="font-mono-code text-[10px] px-2 font-bold text-black min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-1.5 hover:bg-[#eee8db] transition-colors cursor-pointer border-l border-black"
              title="Acercar Zoom"
            >
              <ZoomIn className="w-4 h-4 text-black" />
            </button>
          </div>

          <button
            onClick={resetView}
            className="p-1.5 border border-black bg-white hover:bg-[#eee8db] transition-colors cursor-pointer"
            title="Centrar y reajustar vista"
          >
            <Maximize2 className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-grid-dots cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Scaled & Panned Board Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '1000px',
            height: '800px',
          }}
          className="absolute inset-0 transition-transform duration-75 pointer-events-none"
        >
          {/* SVG Connection Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead-played"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#aa304f" />
              </marker>
              <marker
                id="arrowhead-normal"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#77767b" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const from = nodes.find((n) => n.id === edge.fromNodeId);
              const to = nodes.find((n) => n.id === edge.toNodeId);
              if (!from || !to) return null;

              const isFromVisible = isNodeVisible(from);
              const isToVisible = isNodeVisible(to);
              if (!isFromVisible || !isToVisible) return null;

              // Node card dimensions: 180w x 90h
              const x1 = from.x + 90;
              const y1 = from.y + 45;
              const x2 = to.x + 90;
              const y2 = to.y + 45;

              const isPlayed = edge.isPlayedThread;
              const isConnectedToSelected =
                from.id === selectedNodeId || to.id === selectedNodeId;

              return (
                <g key={edge.id}>
                  {/* Outer glow or shadow for played thread */}
                  {isPlayed && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#aa304f"
                      strokeWidth="8"
                      strokeOpacity="0.25"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Primary edge line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isPlayed
                        ? '#aa304f'
                        : isConnectedToSelected
                        ? '#18181b'
                        : '#9ca3af'
                    }
                    strokeWidth={isPlayed ? '3.5' : isConnectedToSelected ? '2' : '1.5'}
                    strokeDasharray={
                      edge.creativeLicense === 'dispensa_aprobada'
                        ? '6,4'
                        : edge.creativeLicense === 'requiere_licencia'
                        ? '3,3'
                        : 'none'
                    }
                    markerEnd={isPlayed ? 'url(#arrowhead-played)' : 'url(#arrowhead-normal)'}
                  />

                  {/* Small badge in midpoint */}
                  <circle
                    cx={(x1 + x2) / 2}
                    cy={(y1 + y2) / 2}
                    r={isPlayed ? '5' : '3'}
                    fill={isPlayed ? '#aa304f' : '#47464b'}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes Layer */}
          {nodes.map((node) => {
            if (!isNodeVisible(node)) return null;

            const isSelected = node.id === selectedNodeId;
            const isLive = node.id === 'N04';
            const { borderClass, badgeBg } = getNodeBorderAndBadge(node);

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                }}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                }}
                className={`node-card absolute w-48 bg-[#fff9ec] ${borderClass} shadow-[3px_3px_0px_0px_#18181b] p-2 flex flex-col justify-between transition-all cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 ${
                  isSelected ? 'z-30 scale-105 shadow-[5px_5px_0px_0px_#18181b]' : 'z-10'
                }`}
              >
                {/* Header with code and layer */}
                <div className="flex items-center justify-between border-b border-[#c8c5cb]/50 pb-1 mb-1 font-mono-code text-[9px]">
                  <span className="font-bold text-black">{node.code}</span>
                  <span className={`px-1 py-0.2 font-bold uppercase tracking-wider ${badgeBg}`}>
                    {node.truthLayer}
                  </span>
                </div>

                {/* Node Title */}
                <div className="font-bold text-xs text-black leading-tight line-clamp-2 my-0.5">
                  {node.name}
                </div>

                {/* Node Short meta */}
                <div className="font-mono-code text-[9px] text-[#47464b] line-clamp-1">
                  {node.category}
                </div>

                {/* Bottom live indicator or speaker */}
                <div className="mt-1 pt-1 border-t border-[#c8c5cb]/40 flex items-center justify-between font-mono-code text-[9px]">
                  {isLive ? (
                    <span className="text-[#aa304f] font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#aa304f] animate-ping" />
                      EN VIVO (S-04)
                    </span>
                  ) : node.speakerName ? (
                    <span className="text-black font-semibold truncate">
                      {node.speakerName}
                    </span>
                  ) : (
                    <span className="text-[#77767b] italic">Sin explorar</span>
                  )}

                  <span className="text-[#47464b] font-bold">
                    {node.directLinksCount} vínculos
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Legend / Quick Guide Overlay */}
        <div className="board-ui absolute bottom-4 left-4 bg-[#fff9ec]/95 border-2 border-black p-3 shadow-[4px_4px_0px_0px_#18181b] font-mono-code text-[10px] flex flex-col gap-1.5 z-20 max-w-xs">
          <div className="font-bold text-black uppercase flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>Guía de Conectividad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#aa304f]" />
            <span>Hilo Continuo Jugado (Paperclip ➔ Montauk)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-black" />
            <span>Puente de 2 Saltos (Dispensa Aprobada)</span>
          </div>
          <div className="text-[9px] text-[#47464b] border-t border-[#c8c5cb] pt-1">
            Regla de los 2 Saltos: Los ponentes solo pueden vincular su tema con nodos a 1 o 2
            aristas de distancia del último nodo jugado.
          </div>
        </div>

        {/* Selected Node Inspector Drawer (Right Side) */}
        {selectedNode && (
          <div className="board-ui absolute top-0 right-0 bottom-0 w-80 md:w-96 bg-[#fff9ec] border-l-2 border-black shadow-[-4px_0px_0px_0px_#18181b] flex flex-col z-30 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-3 bg-[#eee8db] border-b-2 border-black flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs font-bold text-[#aa304f]">
                  {selectedNode.code}
                </span>
                <span className="font-mono-code text-[10px] bg-black text-white px-1.5 py-0.5 uppercase">
                  {selectedNode.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId('')}
                className="p-1 hover:bg-[#dfd9cd] text-black transition-colors cursor-pointer"
                title="Cerrar Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo / Visual */}
            {selectedNode.photoUrl && (
              <div className="relative aspect-16/9 bg-black border-b-2 border-black overflow-hidden group">
                <img
                  src={selectedNode.photoUrl}
                  alt={selectedNode.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/85 p-1 text-center font-mono-code text-[9px] text-white">
                  {selectedNode.photoCaption || 'Evidencia fotográfica clasificada'}
                </div>
              </div>
            )}

            {/* Drawer Content */}
            <div className="p-4 flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-black leading-tight">
                  {selectedNode.name}
                </h3>
                <div className="font-mono-code text-[10px] text-[#47464b] mt-1 flex flex-wrap gap-2">
                  <span>Categoría: {selectedNode.category}</span>
                  <span>·</span>
                  <span>Período: {selectedNode.historicalPeriod || '1945-1990'}</span>
                </div>
              </div>

              {/* Neutral Description */}
              <div className="bg-[#f3ede0] p-3 border border-[#c8c5cb] font-body text-xs text-[#1e1c14] leading-relaxed">
                <div className="font-mono-code text-[9px] text-[#47464b] font-bold uppercase mb-1">
                  Descripción Neutral Verificable:
                </div>
                {selectedNode.neutralDescription}
              </div>

              {/* Epistemological Status Badge */}
              <div className="flex items-center justify-between p-2 border border-black bg-white font-mono-code text-xs">
                <span className="text-[#47464b]">Capa de Verdad:</span>
                <span
                  className={`px-2 py-0.5 font-bold uppercase ${
                    selectedNode.truthLayer === 'HECHO'
                      ? 'bg-[#1e3a8a] text-white'
                      : selectedNode.truthLayer === 'AFIRMACIÓN'
                      ? 'bg-[#b45309] text-white'
                      : 'bg-[#aa304f] text-white'
                  }`}
                >
                  [{selectedNode.truthLayer}]
                </span>
              </div>

              {/* Topology Telemetry */}
              <div className="grid grid-cols-2 gap-2 font-mono-code text-xs">
                <div className="bg-[#f3ede0] p-2 border border-[#c8c5cb]">
                  <span className="text-[10px] text-[#47464b] block">Vínculos Directos:</span>
                  <span className="font-bold text-black text-sm">
                    {selectedNode.directLinksCount} aristas
                  </span>
                </div>
                <div className="bg-[#f3ede0] p-2 border border-[#c8c5cb]">
                  <span className="text-[10px] text-[#47464b] block">Centralidad en Red:</span>
                  <span className="font-bold text-black text-sm">
                    {selectedNode.centralityScore || 0.7} / 1.0
                  </span>
                </div>
              </div>

              {/* Claims for this node */}
              <div className="flex flex-col gap-2">
                <div className="font-mono-code text-[11px] font-bold text-black uppercase flex items-center justify-between">
                  <span>Registros y Alegaciones ({nodeClaims.length}):</span>
                </div>

                {nodeClaims.length === 0 ? (
                  <div className="font-mono-code text-[10px] text-[#77767b] p-2 bg-[#f3ede0]">
                    Sin alegaciones específicas en el acta abierta.
                  </div>
                ) : (
                  nodeClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className={`p-2.5 text-xs border ${
                        claim.truthLayer === 'HECHO'
                          ? 'border-[#1e3a8a] bg-[#1e3a8a]/5'
                          : 'border-dashed border-[#b45309] bg-[#b45309]/5'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono-code text-[9px] mb-1">
                        <span className="font-bold text-black">{claim.code}</span>
                        <span
                          className={`px-1 font-bold uppercase ${
                            claim.truthLayer === 'HECHO' ? 'text-[#1e3a8a]' : 'text-[#b45309]'
                          }`}
                        >
                          [{claim.truthLayer}]
                        </span>
                      </div>
                      <div className="font-bold text-black text-[11px] mb-0.5">{claim.title}</div>
                      <div className="text-[11px] text-[#47464b] leading-tight">{claim.text}</div>
                      <div className="mt-1 text-[9px] font-mono-code text-[#77767b] italic">
                        Fuente: {claim.author}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {selectedNode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono-code text-[9px] bg-[#e8e2d5] text-[#47464b] px-2 py-0.5 border border-[#c8c5cb]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t-2 border-black flex flex-col gap-2 font-mono-code text-xs">
                {selectedNode.id === 'N04' && (
                  <button
                    onClick={() => setActiveTab('sesion-actual')}
                    className="w-full py-2 bg-[#aa304f] text-white font-bold uppercase tracking-wider hover:bg-[#881337] transition-colors cursor-pointer text-center"
                  >
                    Ir a la Sesión en Vivo de este Nodo
                  </button>
                )}

                <button
                  onClick={() => {
                    showToast(`Proponiendo moción de canon vinculada a ${selectedNode.name}`);
                    setActiveTab('sesion-actual');
                  }}
                  className="w-full py-2 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#47464b] transition-colors cursor-pointer text-center"
                >
                  Proponer Moción Canónica
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
