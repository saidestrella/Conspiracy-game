import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { User } from '../types';
import {
  Users,
  Award,
  BookOpen,
  Share2,
  CheckCircle,
  FileText,
  UserCheck,
  Shield,
} from 'lucide-react';

export const InvestigadoresView: React.FC = () => {
  const { allUsers, currentUser, setCurrentUser, sessions, canonEntries, showToast } =
    useCampaign();

  const [selectedUser, setSelectedUser] = useState<User>(allUsers[0]);

  const getUserSessions = (userId: string) => {
    return sessions.filter((s) => s.presenterId === userId);
  };

  const getUserCanon = (userName: string) => {
    return canonEntries.filter((c) => c.proponentName === userName);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#aa304f] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>MESA PERMANENTE DE INVESTIGACIÓN</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black">
            Expedientes de Investigadores
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Directorio de jugadores, historial de ponencias, canon promovido y condecoraciones
            otorgadas por la mesa en la Temporada 1.
          </p>
        </div>

        <div className="font-mono-code text-xs bg-[#fff9ec] border border-black p-2 px-3 shadow-[2px_2px_0px_0px_#18181b]">
          <span className="text-[#47464b]">Investigador Activo en Pantalla: </span>
          <strong className="text-black">{currentUser.name}</strong> ({currentUser.badge})
        </div>
      </div>

      {/* Main Grid: User Cards & Selected Profile Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Directory List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {allUsers.map((user) => {
            const isSelected = selectedUser.id === user.id;
            const isCurrent = currentUser.id === user.id;
            const userSessions = getUserSessions(user.id);
            const userCanon = getUserCanon(user.name);

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`bg-[#fff9ec] border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_#18181b] flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#aa304f] shadow-[5px_5px_0px_0px_#18181b]'
                    : 'hover:bg-[#fcf7ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-mono-code font-bold text-sm shadow-xs shrink-0">
                    {user.name.charAt(0)}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-black">{user.name}</span>
                      {isCurrent && (
                        <span className="font-mono-code text-[9px] bg-[#aa304f] text-white px-1.5 py-0.2 font-bold uppercase">
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <span className="font-mono-code text-[10px] text-[#47464b]">
                      {user.badge} · {user.title}
                    </span>
                  </div>
                </div>

                <div className="font-mono-code text-right text-[10px] shrink-0">
                  <div className="text-black font-bold">{userSessions.length} Charlas</div>
                  <div className="text-[#881337]">{userCanon.length} Canon</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Full Dossier Detail */}
        {selectedUser && (
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#fff9ec] border-2 border-black p-5 lg:p-6 shadow-[6px_6px_0px_0px_#18181b] flex flex-col gap-5">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-mono-code font-bold text-xl shadow-md">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-black">
                      {selectedUser.name}
                    </h3>
                    <div className="font-mono-code text-xs text-[#aa304f] font-bold">
                      {selectedUser.badge} // {selectedUser.title}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentUser(selectedUser);
                    showToast(`Identidad activa conmutada a ${selectedUser.name}`);
                  }}
                  className="px-3 py-1.5 bg-black hover:bg-[#aa304f] text-white font-mono-code text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Asumir Identidad</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono-code text-xs">
                <div className="bg-[#f3ede0] p-3 border border-[#c8c5cb]">
                  <span className="text-[10px] text-[#47464b] block">Ponencias Hechas</span>
                  <span className="text-xl font-bold text-black mt-0.5">
                    {getUserSessions(selectedUser.id).length}
                  </span>
                </div>
                <div className="bg-[#f3ede0] p-3 border border-[#c8c5cb]">
                  <span className="text-[10px] text-[#47464b] block">Canon Promovido</span>
                  <span className="text-xl font-bold text-[#881337] mt-0.5">
                    {getUserCanon(selectedUser.name).length}
                  </span>
                </div>
                <div className="bg-[#f3ede0] p-3 border border-[#c8c5cb]">
                  <span className="text-[10px] text-[#47464b] block">Rol en Asamblea</span>
                  <span className="text-sm font-bold text-black uppercase mt-0.5">
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Sessions Given by this User */}
              <div>
                <h4 className="font-mono-code text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#aa304f]" />
                  <span>Charlas Realizadas en la Campaña:</span>
                </h4>

                {getUserSessions(selectedUser.id).length === 0 ? (
                  <div className="font-mono-code text-xs text-[#77767b] p-3 bg-[#f3ede0] border border-[#c8c5cb]">
                    Sin charlas presentadas todavía en esta temporada.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {getUserSessions(selectedUser.id).map((s) => (
                      <div
                        key={s.id}
                        className="bg-[#f3ede0] p-3 border border-[#c8c5cb] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono-code text-[10px] text-[#aa304f] font-bold block">
                            Sesión #{s.number} · {s.date}
                          </span>
                          <span className="font-serif font-bold text-black text-sm">{s.title}</span>
                          <span className="font-mono-code text-[10px] text-[#47464b] block mt-0.5">
                            Nodo: {s.mainNodeName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Canon authored */}
              <div>
                <h4 className="font-mono-code text-xs font-bold text-[#881337] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#881337]" />
                  <span>Artículos de Canon Aprobados en Asamblea:</span>
                </h4>

                {getUserCanon(selectedUser.name).length === 0 ? (
                  <div className="font-mono-code text-xs text-[#77767b] p-3 bg-[#f3ede0] border border-[#c8c5cb]">
                    No ha promovido mociones canónicas aprobadas.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {getUserCanon(selectedUser.name).map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#fff0f3] p-3 border border-[#881337] font-serif text-xs italic text-black"
                      >
                        <div className="font-mono-code text-[10px] text-[#881337] font-bold not-italic mb-1">
                          {c.codex} ({c.version}) · Sesión #{c.sessionNumber}
                        </div>
                        “{c.text}”
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Condecoraciones y Menciones */}
              <div className="bg-[#fef9c3]/60 border border-[#eab308] p-3 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="font-mono-code text-xs">
                  <div className="font-bold text-amber-900 uppercase">
                    Distinciones de Mesa Otorgadas:
                  </div>
                  <div className="text-[#47464b] mt-0.5">
                    {selectedUser.id === 'carlos'
                      ? 'Condecorado con “Mejor Uso de Fuentes” en Sesión #01.'
                      : selectedUser.id === 'sofia'
                      ? 'Condecorada con “Mejor Giro Narrativo” en Sesión #02.'
                      : selectedUser.id === 'elena'
                      ? 'Condecorada con “Mejor Continuidad de Archivo” en Sesión #03.'
                      : 'Elegible para nominaciones de asamblea en la Sesión Plenaria.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
