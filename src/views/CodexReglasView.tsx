import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import {
  BookOpen,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Users,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

export const CodexReglasView: React.FC = () => {
  const { showToast } = useCampaign();

  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({
    faq1: true,
    faq2: true,
  });

  const toggleFaq = (key: string) => {
    setExpandedFaq((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqs = [
    {
      id: 'faq1',
      question: '¿Qué ocurre si la teoría de un ponente contradice un Canon ya aprobado?',
      answer:
        'El ponente no puede ignorar el canon existente. Para introducir la contradicción, debe presentar una Moción de Enmienda Canónica formal. Si la asamblea aprueba la enmienda por mayoría absoluta, el canon anterior pasa al estado "Enmendada" (V2.0) y el historial preserva la redacción previa tachada en el libro rojo.',
    },
    {
      id: 'faq2',
      question: '¿Cómo funciona exactamente la Regla de los Dos Saltos en el tablero?',
      answer:
        'Para garantizar coherencia narrativa y evitar saltos temáticos caóticos, la próxima teoría debe conectar directamente con el último nodo jugado (1 salto) o a través de un nodo intermediario que justifique el nexo conceptual o documental (2 saltos). Brincos a 3 o más saltos requieren "Dispensa del Anfitrión" sometida a votación rápida.',
    },
    {
      id: 'faq3',
      question: '¿Por qué es obligatorio etiquetar los Hechos de forma independiente a las Afirmaciones?',
      answer:
        'El Gran Hilo es un juego narrativo e historiográfico, no una plataforma de validación de bulos o desinformación. Es requisito ético y lúdico que todo participante distinga claramente qué documentos existen en los registros públicos (FOIA, NARA, Senado) y qué aseveraciones provienen de declaraciones testimoniales no contrastadas.',
    },
    {
      id: 'faq4',
      question: '¿Puede un espectador votar durante la asamblea de canon?',
      answer:
        'Los espectadores y auditores de sala pueden participar en la deliberación y el debate, pero el quórum resolutivo de votación de canon está reservado a los Investigadores acreditados y al Anfitrión de Actas.',
    },
    {
      id: 'faq5',
      question: '¿Cómo se otorgan los premios y distinciones al final de temporada?',
      answer:
        'Al concluir el último capítulo de la temporada, la mesa vota categorías como "Mejor Continuidad", "Mejor Uso de Fuentes", "Mejor Giro Narrativo" y "Mejor PowerPoint", basándose en las actas históricas conservadas en la Bitácora.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-4 gap-4">
        <div>
          <div className="font-mono-code text-xs text-[#aa304f] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>MANUAL OPERATIVO DE ASAMBLEA // CÓDEX DE JUEGO</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-black text-black">
            Reglamento & Matriz de Roles
          </h1>
          <p className="font-mono-code text-xs text-[#47464b] mt-1 max-w-2xl">
            Protocolos de continuidad, epistemología de las tres capas de verdad y normas de
            votación para la campaña de PowerPoint Nights.
          </p>
        </div>

        <button
          onClick={() => showToast('Copia del Manual Operativo descargada en PDF.')}
          className="px-3.5 py-2 bg-black hover:bg-[#aa304f] text-white font-mono-code text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descargar Reglamento PDF</span>
        </button>
      </div>

      {/* 1. Graphic Diagram of the 2-Hop Rule */}
      <div className="bg-[#fff9ec] border-2 border-black p-5 lg:p-6 shadow-[5px_5px_0px_0px_#18181b] flex flex-col gap-4">
        <div className="border-b border-[#c8c5cb] pb-2">
          <span className="font-mono-code text-xs font-bold text-[#aa304f] uppercase tracking-wider block">
            Mecánica Central del Tablero
          </span>
          <h2 className="text-2xl font-serif font-bold text-black mt-0.5">
            La Regla de los Dos Saltos (Continuidad Topológica)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-code text-xs">
          <div className="bg-[#f3ede0] p-4 border-2 border-black flex flex-col justify-between">
            <div>
              <div className="bg-black text-white px-2 py-0.5 font-bold uppercase inline-block mb-2">
                1 Salto: Inmediato
              </div>
              <h4 className="font-bold text-sm text-black mb-1">Conexión Directa</h4>
              <p className="text-[#47464b] leading-relaxed">
                El nuevo tema comparte arista directa con el último nodo jugado. No requiere
                dispensa ni justificación extraordinaria.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-emerald-800 font-bold">✓ Permitido por defecto</div>
          </div>

          <div className="bg-[#f3ede0] p-4 border-2 border-[#b45309] flex flex-col justify-between">
            <div>
              <div className="bg-[#b45309] text-white px-2 py-0.5 font-bold uppercase inline-block mb-2">
                2 Saltos: Puente
              </div>
              <h4 className="font-bold text-sm text-black mb-1">Conexión Mediada</h4>
              <p className="text-[#47464b] leading-relaxed">
                El tema se enlaza a través de un nodo intermediario del grafo. El ponente debe
                explicar oralmente el nexo documental o temporal.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-amber-800 font-bold">⚠ Requiere nexo argumental</div>
          </div>

          <div className="bg-[#f3ede0] p-4 border-2 border-dashed border-[#77767b] flex flex-col justify-between">
            <div>
              <div className="bg-[#77767b] text-white px-2 py-0.5 font-bold uppercase inline-block mb-2">
                +3 Saltos: Bloqueado
              </div>
              <h4 className="font-bold text-sm text-black mb-1">Ruptura de Grafo</h4>
              <p className="text-[#47464b] leading-relaxed">
                Saltos lejanos están bloqueados para evitar perder el hilo de la temporada, salvo
                moción de dispensa aprobada unánimemente.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-rose-800 font-bold">✕ Requiere Dispensa de Mesa</div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Role Permission Matrix Table */}
      <div className="bg-[#fff9ec] border-2 border-black p-5 lg:p-6 shadow-[5px_5px_0px_0px_#18181b] flex flex-col gap-4">
        <div className="border-b border-[#c8c5cb] pb-2">
          <span className="font-mono-code text-xs font-bold text-black uppercase tracking-wider block">
            Gobernanza de Campaña
          </span>
          <h2 className="text-2xl font-serif font-bold text-black mt-0.5">
            Matriz de Permisos por Rol
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-code text-xs border-collapse">
            <thead>
              <tr className="bg-[#eee8db] border-b-2 border-black text-black">
                <th className="p-2.5 font-bold uppercase">Acción Forense / Sistema</th>
                <th className="p-2.5 font-bold uppercase text-center">Anfitrión (Game Master)</th>
                <th className="p-2.5 font-bold uppercase text-center">Investigador (Ponente)</th>
                <th className="p-2.5 font-bold uppercase text-center">Espectador / Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5cb]">
              <tr className="hover:bg-[#fcf7ee]">
                <td className="p-2.5 font-bold text-black">Proponer Moción de Canon</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí</td>
                <td className="p-2.5 text-center text-[#77767b]">✕ No</td>
              </tr>
              <tr className="hover:bg-[#fcf7ee]">
                <td className="p-2.5 font-bold text-black">Votar en Asamblea de Canon</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí (Voto dirimente)</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí</td>
                <td className="p-2.5 text-center text-[#77767b]">✕ Solo voz</td>
              </tr>
              <tr className="hover:bg-[#fcf7ee]">
                <td className="p-2.5 font-bold text-black">Conceder Dispensa de Salto (+3)</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Exclusivo</td>
                <td className="p-2.5 text-center text-amber-800">Solicitante</td>
                <td className="p-2.5 text-center text-[#77767b]">✕ No</td>
              </tr>
              <tr className="hover:bg-[#fcf7ee]">
                <td className="p-2.5 font-bold text-black">Clausura y Sellado de Acta</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Custodio</td>
                <td className="p-2.5 text-center text-[#77767b]">Firma asistente</td>
                <td className="p-2.5 text-center text-[#77767b]">✕ No</td>
              </tr>
              <tr className="hover:bg-[#fcf7ee]">
                <td className="p-2.5 font-bold text-black">Apertura de Cabos Sueltos</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí</td>
                <td className="p-2.5 text-center text-emerald-800 font-bold">✓ Sí (Con moderación)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Interactive FAQ Accordion */}
      <div className="bg-[#fff9ec] border-2 border-black p-5 lg:p-6 shadow-[5px_5px_0px_0px_#18181b] flex flex-col gap-4">
        <div className="border-b border-[#c8c5cb] pb-2">
          <span className="font-mono-code text-xs font-bold text-[#881337] uppercase tracking-wider block flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#aa304f]" />
            <span>Consultas Frecuentes de la Mesa</span>
          </span>
          <h2 className="text-2xl font-serif font-bold text-black mt-0.5">
            Preguntas Frecuentes & Casos Límites
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => {
            const isOpen = expandedFaq[faq.id];
            return (
              <div key={faq.id} className="border border-black bg-[#f3ede0]">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 text-left flex items-center justify-between font-serif font-bold text-base text-black cursor-pointer hover:bg-[#e8e2d5] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-black shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>

                {isOpen && (
                  <div className="p-3.5 pt-0 font-body text-xs text-[#2d2b24] leading-relaxed border-t border-[#c8c5cb] mt-1 bg-white/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
