import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, HeartHandshake, Eye, Sparkles, X, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import SmartwatchSimulator from './SmartwatchSimulator';
import HBWLogo from './HBWLogo';
// @ts-ignore
import onboardingUserFlowImg from '../assets/images/onboarding_user_flow_1782264270534.jpg';

interface DeviceSimulatorProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
}

export default function DeviceSimulator({ children, theme = 'light' }: DeviceSimulatorProps) {
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [showWatchSimulator, setShowWatchSimulator] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isDark = theme === 'dark';

  const downloadUserFlowPDF = () => {
    setIsExporting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = onboardingUserFlowImg;
    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      const doc = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        doc.addImage(dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight);
        doc.save('onboarding_user_flow_diagram.pdf');
      }
      setIsExporting(false);
    };
    img.onerror = () => {
      setIsExporting(false);
    };
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header bar with organization identity and simulator controls */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 mb-4 flex flex-col sm:flex-row items-center justify-between border border-[#002246]/60 bg-[#000f1f]/80 backdrop-blur-md rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <HBWLogo size="lg" theme="dark" />
          <div>
            <p className="text-xs text-[#0285ff] font-medium tracking-wide font-mono flex items-center gap-1">
              <span>● Interactive Mobile App Prototype</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowWatchSimulator(!showWatchSimulator)}
            className={`flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold rounded-xl transition-all border shadow-md active:scale-95 ${
              showWatchSimulator 
                ? 'bg-[#0285ff] text-white border-[#0285ff]' 
                : 'bg-[#002246] hover:bg-[#00488A] text-slate-200 border-[#00488A]/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#0285ff] bg-white/10 rounded-full p-0.5" />
            {showWatchSimulator ? 'Hide Watch Demo' : 'Show Watch Demo'}
          </button>

          <button
            onClick={() => setShowFlowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#002246] hover:bg-[#00488A] active:scale-95 text-white font-sans text-xs font-bold rounded-xl transition-all border border-[#00488A]/50 shadow-md"
          >
            <Eye className="w-4 h-4 text-[#0285ff]" />
            View Onboarding User Flow Map
          </button>
        </div>
      </div>

      {/* Simulator view frame context - Forced to Mobile Bezel layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 min-h-[750px] py-4">
        {/* Mobile App design viewport with simulation bezel */}
        <div className="relative w-[390px] h-[820px] bg-black rounded-[50px] p-3.5 shadow-[0_25px_60px_-15px_rgba(2,133,255,0.15)] border-4 border-neutral-900 flex flex-col items-center shrink-0 transition-all duration-300">
          {/* Top Ear Piece notch dynamic simulation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-between px-4 border border-neutral-900">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111]"></div>
            <div className="w-12 h-3.5 bg-[#111] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0285ff]"></span>
            </div>
          </div>

          {/* Simulated phone screen container with transform containment for in-phone modals */}
          <div className={`w-full h-full rounded-[38px] overflow-hidden relative flex flex-col border transition-colors duration-300 [transform:translateZ(0)] ${
            isDark ? 'bg-[#000814] border-neutral-950' : 'bg-[#F5F5F7] border-[#D1D1D6]'
          }`}>
            {/* Simulated Mobile Status bar */}
            <div className={`pt-3 px-6 pb-2 flex items-center justify-between text-2xs font-sans font-semibold tracking-wide select-none transition-colors duration-300 ${
              isDark ? 'bg-[#000814] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
            }`}>
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xs font-mono">5G</span>
                <div className={`w-5 h-2.5 rounded-sm p-0.5 border flex items-center justify-start ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#E5E5EA] border-[#C7C7CC]'
                }`}>
                  <div className="w-3.5 h-full bg-emerald-500 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* Viewable Content Area scale-adaptive */}
            <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col transition-colors duration-300 ${
              isDark ? 'bg-[#000814]' : 'bg-[#F5F5F7]'
            }`}>
              {children}
            </div>

            {/* Simulated iOS home gesture pill */}
            <div className={`w-full h-5 flex items-center justify-center shrink-0 pb-1.5 z-20 transition-colors duration-300 ${
              isDark ? 'bg-[#000814]' : 'bg-[#F5F5F7]'
            }`}>
              <div className={`w-32 h-1 rounded-full ${
                isDark ? 'bg-slate-800' : 'bg-[#C7C7CC]'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Smartwatch Simulator side-by-side companion (Optional) */}
        {showWatchSimulator && (
          <div className="flex flex-col gap-4 items-center shrink-0 w-full max-w-[340px] lg:mt-24 transition-all duration-300">
            <SmartwatchSimulator />
            <div className="bg-[#000d1a]/40 border border-[#002246]/50 rounded-2xl p-4 text-xs text-slate-400 max-w-[340px] leading-relaxed">
              <h4 className="text-white font-bold mb-1.5 font-sans flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#0285ff]" />
                Eco-System Sync Technology
              </h4>
              <p className="text-[11px]">
                This simulation showcases real-time, bi-directional telemetry synchronizing the phone app with WearOS and watchOS wearables. 
              </p>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[10px]">
                <li>Tapping <strong>Complete</strong> on the watch instantly updates your streak on the phone app.</li>
                <li>Setting custom anchors on the phone broadcasts alerts down to your wrist.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Full screen User Flow Modal */}
      {showFlowModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#000814] rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#002246]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#002246] flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0285ff]" />
                <div>
                  <h3 className="text-base font-serif text-white font-bold">
                    Systemic Habits Onboarding User Flow
                  </h3>
                  <p className="text-3xs font-mono uppercase tracking-widest text-[#0285ff] font-bold">
                    4-Screen Design Journey Map
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadUserFlowPDF}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0285ff] hover:bg-[#0075e3] text-white font-sans font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isExporting ? 'Compiling PDF...' : 'Download PDF Visual'}
                </button>
                <button
                  onClick={() => setShowFlowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Scrollable image */}
            <div className="flex-1 p-6 bg-[#000f1f] overflow-auto flex items-center justify-center">
              <div className="relative border border-[#002246] rounded-2xl overflow-hidden shadow-lg bg-slate-950 max-w-full">
                <img
                  src={onboardingUserFlowImg}
                  alt="Habits Onboarding 4-Screen User Flow Infographic"
                  className="max-h-[60vh] object-contain mx-auto"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#002246] bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>
                Generated design asset depicting the 4 sequential screens: demographics, pillar focus, lifestyle constraints, and the active custom dashboard.
              </p>
              <button
                onClick={() => setShowFlowModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white font-semibold hover:bg-[#002246]/50 rounded-xl transition-all"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
