export type TruthLayer = 'HECHO' | 'AFIRMACIÓN' | 'CANON';

export type UserRole = 'anfitrion' | 'jugador' | 'espectador';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  badge: string;
  title: string;
  proposalsCount: number;
  approvedCanonCount: number;
  presentationsCount: number;
  avatarUrl?: string;
}

export type NodeType =
  | 'teoría'
  | 'acontecimiento'
  | 'persona'
  | 'organización'
  | 'lugar'
  | 'tecnología'
  | 'esotérico'
  | 'documento'
  | 'puente';

export type NodeStatus =
  | 'no_explorado'
  | 'disponible'
  | 'candidato'
  | 'asignado'
  | 'presentado'
  | 'canonizado'
  | 'bloqueado'
  | 'descartado';

export interface CampaignNode {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: NodeType;
  truthLayer: TruthLayer;
  category: string;
  neutralDescription: string;
  tags: string[];
  sensitivity: 'baja' | 'media' | 'alta' | 'restringida';
  status: NodeStatus;
  x: number;
  y: number;
  cluster: string;
  photoUrl?: string;
  photoCaption?: string;
  speakerId?: string;
  speakerName?: string;
  sessionId?: string;
  historicalPeriod?: string;
  centralityScore?: number;
  directLinksCount?: number;
  secondHopCount?: number;
}

export type RelationType =
  | 'se asocia con'
  | 'deriva de'
  | 'comparte personajes'
  | 'comparte acontecimiento'
  | 'puente narrativo'
  | 'conexión creada por el grupo';

export interface CampaignEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: RelationType;
  direction?: 'unidireccional' | 'bidireccional';
  explanation: string;
  sourceRef?: string;
  creativeLicense: 'ninguna' | 'dispensa_aprobada' | 'requiere_licencia';
  isPlayedThread: boolean;
  sessionId?: string;
}

export interface Claim {
  id: string;
  nodeId: string;
  sessionId?: string;
  code: string;
  title: string;
  text: string;
  truthLayer: TruthLayer;
  author: string;
  sourceText?: string;
  status: 'confirmado' | 'conjetura' | 'conjetura_extrema' | 'disputado';
  dateStr?: string;
}

export interface Source {
  id: string;
  code: string;
  title: string;
  author: string;
  date: string;
  type: 'documento_oficial' | 'foia' | 'testimonio' | 'articulo' | 'libro' | 'croquis' | 'audio';
  url?: string;
  note: string;
  addedBy: string;
  nodeId?: string;
  truthLayer: TruthLayer;
}

export type CanonStatus = 'vigente' | 'enmendada' | 'retirada';

export interface CanonEntry {
  id: string;
  codex: string;
  sessionId: string;
  sessionNumber: string;
  text: string;
  originalText?: string;
  proponentName: string;
  proponentRole: string;
  enmendedBy?: string;
  enmendedSession?: string;
  amendmentReason?: string;
  date: string;
  status: CanonStatus;
  version: string;
  replacesId?: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  relatedNodeIds: string[];
  nodeRelationSummary: string;
  chronologicalImpact: string;
  auditBlockHash: string;
  dissentNote?: string;
}

export interface Session {
  id: string;
  seasonId: string;
  number: string;
  title: string;
  date: string;
  hostName: string;
  presenterId: string;
  presenterName: string;
  presenterRole: string;
  mainNodeId: string;
  mainNodeName: string;
  status: 'borrador' | 'programada' | 'en_curso' | 'pendiente_cierre' | 'cerrada';
  summary: string;
  durationMin: number;
  slidesUrl: string;
  slideCount: number;
  routeUsedSummary: string;
  cliffhanger: string;
  nextProposedNodeIds: string[];
  awards?: Award[];
}

export interface LooseEnd {
  id: string;
  code: string;
  sessionId: string;
  sessionNumber: string;
  text: string;
  detail: string;
  relatedNodeIds: string[];
  authorName: string;
  status: 'abierto' | 'retomado' | 'resuelto' | 'abandonado';
  openedDate: string;
  resolvedSessionId?: string;
  priority: 'urgente' | 'prioritario' | 'secundario';
}

export interface Award {
  id: string;
  sessionId: string;
  category:
    | 'Mejor Continuidad'
    | 'Mejor Uso de Fuentes'
    | 'Mejor Giro Narrativo'
    | 'Mejor Cliffhanger'
    | 'Mejor PowerPoint'
    | 'Mejor Recuperación de Detalle Antiguo';
  recipientUserId: string;
  recipientName: string;
  note: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
  blockHash: string;
  type: 'enmienda' | 'canon' | 'cierre' | 'fundacional' | 'dispensa';
}
