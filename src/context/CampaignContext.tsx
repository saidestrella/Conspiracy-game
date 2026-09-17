import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CampaignNode,
  CampaignEdge,
  Claim,
  Source,
  CanonEntry,
  Session,
  LooseEnd,
  AuditEvent,
  User,
  TruthLayer,
} from '../types';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_SESSIONS,
  INITIAL_CANON,
  INITIAL_CLAIMS,
  INITIAL_SOURCES,
  INITIAL_LOOSE_ENDS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_USERS,
} from '../mockData';

export type NavTab =
  | 'cuartel-general'
  | 'tablero-grafo'
  | 'sesion-actual'
  | 'bitacora'
  | 'canon-aprobado'
  | 'archivo-y-cabos'
  | 'expedientes-personas'
  | 'manual-reglas';

interface CampaignContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  nodes: CampaignNode[];
  edges: CampaignEdge[];
  sessions: Session[];
  canonEntries: CanonEntry[];
  claims: Claim[];
  sources: Source[];
  looseEnds: LooseEnd[];
  auditEvents: AuditEvent[];
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  selectedNode: CampaignNode | undefined;
  isModoSalonOpen: boolean;
  setIsModoSalonOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  castVoteOnCurrentMotion: (vote: 'approve' | 'reject' | 'abstain') => void;
  currentMotionVotes: { approve: number; reject: number; abstain: number };
  hasVotedCurrentMotion: boolean;
  isMotionPassed: boolean;
  closeActiveSession: (nextNodeId: string, cliffhanger: string) => void;
  resolveLooseEnd: (id: string) => void;
  addCanonProposal: (text: string, relatedNodeIds: string[], proponentName: string) => void;
  resetAllDemoData: () => void;
  filterTruthLayer: TruthLayer | 'ALL';
  setFilterTruthLayer: (layer: TruthLayer | 'ALL') => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_PREFIX = 'el_gran_hilo_v4_';

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('cuartel-general');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('N04');
  const [isModoSalonOpen, setIsModoSalonOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterTruthLayer, setFilterTruthLayer] = useState<TruthLayer | 'ALL'>('ALL');

  // Voting state for active session S04
  const [currentMotionVotes, setCurrentMotionVotes] = useState<{
    approve: number;
    reject: number;
    abstain: number;
  }>({ approve: 3, reject: 1, abstain: 0 });
  const [hasVotedCurrentMotion, setHasVotedCurrentMotion] = useState<boolean>(false);
  const [isMotionPassed, setIsMotionPassed] = useState<boolean>(false);

  // Entities with localStorage fallback
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [nodes, setNodes] = useState<CampaignNode[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}nodes`);
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [edges, setEdges] = useState<CampaignEdge[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}edges`);
    return saved ? JSON.parse(saved) : INITIAL_EDGES;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}sessions`);
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [canonEntries, setCanonEntries] = useState<CanonEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}canon`);
    return saved ? JSON.parse(saved) : INITIAL_CANON;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}claims`);
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  const [sources, setSources] = useState<Source[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}sources`);
    return saved ? JSON.parse(saved) : INITIAL_SOURCES;
  });

  const [looseEnds, setLooseEnds] = useState<LooseEnd[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}loose_ends`);
    return saved ? JSON.parse(saved) : INITIAL_LOOSE_ENDS;
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_EVENTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}nodes`, JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}edges`, JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}sessions`, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}canon`, JSON.stringify(canonEntries));
  }, [canonEntries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}loose_ends`, JSON.stringify(looseEnds));
  }, [looseEnds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const castVoteOnCurrentMotion = (vote: 'approve' | 'reject' | 'abstain') => {
    if (hasVotedCurrentMotion) {
      showToast('AVISO FORENSE: Ya has emitido tu voto secreto para esta moción.');
      return;
    }
    const updated = { ...currentMotionVotes, [vote]: currentMotionVotes[vote] + 1 };
    setCurrentMotionVotes(updated);
    setHasVotedCurrentMotion(true);

    if (updated.approve >= 4) {
      setIsMotionPassed(true);
      showToast('¡QUÓRUM ALCANZADO! Moción #08 incorporada al Canon de Campaña.');
    } else {
      showToast('Voto anónimo computado exitosamente mediante encriptación SHA-256.');
    }
  };

  const closeActiveSession = (nextNodeId: string, cliffhanger: string) => {
    const nextNode = nodes.find((n) => n.id === nextNodeId);
    const nextNodeName = nextNode ? nextNode.name : 'Nodo Seleccionado';

    // Update session 4 to closed
    setSessions((prev) =>
      prev.map((s) =>
        s.id === 'S04'
          ? {
              ...s,
              status: 'cerrada',
              cliffhanger,
              summary: `${s.summary} Sesión clausurada formalmente. Se aprobó la moción de absorción de frecuencia Montauk. Se fijó rumbo hacia: ${nextNodeName}.`,
            }
          : s
      )
    );

    // If motion passed, ensure Canon entry is recorded
    if (isMotionPassed || currentMotionVotes.approve >= 4) {
      const newCanon: CanonEntry = {
        id: `CANON-04`,
        codex: 'CANON-04',
        sessionId: 'S04',
        sessionNumber: '04',
        text: 'La estación Montauk no fue desmantelada; su frecuencia fue absorbida por la red civil de radiofaros y torres de telecomunicación en 1989.',
        proponentName: 'Carlos M.',
        proponentRole: 'Investigador de Terreno',
        date: '18-OCT-1989',
        status: 'vigente',
        version: '1.0',
        votesFor: currentMotionVotes.approve,
        votesAgainst: currentMotionVotes.reject,
        votesAbstain: currentMotionVotes.abstain,
        relatedNodeIds: ['N04', nextNodeId],
        nodeRelationSummary: `N-04 (Montauk) ➔ ${nextNode?.code || 'N-05'} (${nextNode?.shortName || 'Siguiente'})`,
        chronologicalImpact: '1989 - Presente // Frecuencia Residual Activa',
        auditBlockHash: 'SHA256//AC-09941-CM',
      };
      setCanonEntries((prev) => [newCanon, ...prev]);
    }

    // Add audit event
    const newAudit: AuditEvent = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeLabel: '18-OCT-2026 // 23:55',
      actor: currentUser.name,
      action: 'Cierre de Sesión & Sello de Acta',
      entity: 'Sesión #04',
      entityId: 'S04',
      summary: `Sesión #04 cerrada formalmente en sala. Siguiente nodo fijado en el grafo: ${nextNodeName}.`,
      blockHash: '#SES-04-FINAL',
      type: 'cierre',
    };
    setAuditEvents((prev) => [newAudit, ...prev]);

    // Update node status
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'N04') return { ...n, status: 'canonizado' };
        if (n.id === nextNodeId) return { ...n, status: 'asignado' };
        return n;
      })
    );

    showToast('EXPEDIENTE #04 CERRADO. ACTA FORENSE GENERADA EN LA BITÁCORA.');
    setActiveTab('bitacora');
  };

  const resolveLooseEnd = (id: string) => {
    setLooseEnds((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'resuelto', resolvedSessionId: 'S04' } : l))
    );
    showToast('CABO SUELTO MARCADO COMO RESUELTO EN ACTAS');
  };

  const addCanonProposal = (text: string, relatedNodeIds: string[], proponentName: string) => {
    const id = `CANON-0${canonEntries.length + 1}`;
    const newEntry: CanonEntry = {
      id,
      codex: id,
      sessionId: 'S04',
      sessionNumber: '04',
      text,
      proponentName,
      proponentRole: 'Investigador Forense',
      date: '18-OCT-1989',
      status: 'vigente',
      version: '1.0',
      votesFor: 5,
      votesAgainst: 0,
      votesAbstain: 0,
      relatedNodeIds,
      nodeRelationSummary: 'Propuesta Directa de Asamblea',
      chronologicalImpact: 'Incorporado al Universo Canónico',
      auditBlockHash: `SHA256//AC-NEW-${Math.floor(Math.random() * 90000 + 10000)}`,
    };
    setCanonEntries((prev) => [newEntry, ...prev]);
    showToast('NUEVA ENTRADA DE CANON REGISTRADA CON ÉXITO');
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setSessions(INITIAL_SESSIONS);
    setCanonEntries(INITIAL_CANON);
    setClaims(INITIAL_CLAIMS);
    setSources(INITIAL_SOURCES);
    setLooseEnds(INITIAL_LOOSE_ENDS);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setCurrentUser(INITIAL_USERS[0]);
    setSelectedNodeId('N04');
    setCurrentMotionVotes({ approve: 3, reject: 1, abstain: 0 });
    setHasVotedCurrentMotion(false);
    setIsMotionPassed(false);
    showToast('DATOS DE CAMPAÑA RESTABLECIDOS AL ESTADO INICIAL DEMO.');
  };

  return (
    <CampaignContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        allUsers,
        nodes,
        edges,
        sessions,
        canonEntries,
        claims,
        sources,
        looseEnds,
        auditEvents,
        selectedNodeId,
        setSelectedNodeId,
        selectedNode,
        isModoSalonOpen,
        setIsModoSalonOpen,
        isSearchOpen,
        setIsSearchOpen,
        toastMessage,
        showToast,
        castVoteOnCurrentMotion,
        currentMotionVotes,
        hasVotedCurrentMotion,
        isMotionPassed,
        closeActiveSession,
        resolveLooseEnd,
        addCanonProposal,
        resetAllDemoData,
        filterTruthLayer,
        setFilterTruthLayer,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
