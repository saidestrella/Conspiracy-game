import React from 'react';
import { CampaignProvider, useCampaign } from './context/CampaignContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ModoSalonModal } from './components/ModoSalonModal';
import { InicioView } from './views/InicioView';
import { TableroView } from './views/TableroView';
import { SesionActualView } from './views/SesionActualView';
import { BitacoraView } from './views/BitacoraView';
import { CanonView } from './views/CanonView';
import { ArchivoCabosView } from './views/ArchivoCabosView';
import { InvestigadoresView } from './views/InvestigadoresView';
import { CodexReglasView } from './views/CodexReglasView';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage } = useCampaign();

  return (
    <div className="min-h-screen bg-[#fff9ec] text-[#1e1c14] flex flex-col font-sans">
      {/* Permanent Forensic Sidebar */}
      <Sidebar />

      {/* Top Protocol Header */}
      <Header />

      {/* Main Viewport Container */}
      <main className="ml-72 pt-20 px-6 lg:px-8 flex-1">
        {activeTab === 'cuartel-general' && <InicioView />}
        {activeTab === 'tablero-grafo' && <TableroView />}
        {activeTab === 'sesion-actual' && <SesionActualView />}
        {activeTab === 'bitacora' && <BitacoraView />}
        {activeTab === 'canon-aprobado' && <CanonView />}
        {activeTab === 'archivo-y-cabos' && <ArchivoCabosView />}
        {activeTab === 'expedientes-personas' && <InvestigadoresView />}
        {activeTab === 'manual-reglas' && <CodexReglasView />}
      </main>

      {/* Modals */}
      <GlobalSearchModal />
      <ModoSalonModal />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white border-2 border-[#aa304f] p-3 px-4 shadow-[4px_4px_0px_0px_#aa304f] font-mono-code text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-[#aa304f] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CampaignProvider>
      <MainLayout />
    </CampaignProvider>
  );
}
