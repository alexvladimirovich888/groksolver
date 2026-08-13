import React, { useState } from 'react';
import { PanelRight, Edit2, Check, Copy, CheckCheck } from 'lucide-react';

interface TopBarProps {
  projectName: string;
  onUpdateProjectName: (newName: string) => void;
  lastSyncTime: string;
  isSynced: boolean;
  onTriggerSync: () => void;
  isSyncing: boolean;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onUpdateProjectName,
  lastSyncTime,
  isSynced,
  onTriggerSync,
  isSyncing,
  rightPanelOpen,
  onToggleRightPanel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [copied, setCopied] = useState(false);

  const CA_ADDRESS = 'CrJPSvj625TnPdWS42aG5ybMcHeFvnNqq5AExVespump';

  const handleCopyCa = () => {
    navigator.clipboard.writeText(CA_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateProjectName(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setTempName(projectName);
      setIsEditing(false);
    }
  };

  return (
    <header className="h-[52px] bg-[#09090c] border-b border-[#1f1f26] px-4 flex items-center justify-between select-none z-30 shrink-0 gap-2">
      {/* Left: Logo image + GrokSolver text */}
      <div className="flex items-center gap-2.5 min-w-[180px] shrink-0">
        <img
          src="https://s.fotora.ru/5705788ebfd97b0c.jpeg"
          alt="Grok Logo"
          className="h-8 w-auto object-contain max-h-[36px] rounded-md"
          referrerPolicy="no-referrer"
        />
        <span className="font-bold text-lg tracking-tight text-white font-sans flex items-center">
          Grok<span className="text-white/80 font-normal">Solver</span>
        </span>
      </div>

      {/* Center: CA Box + X Social Link */}
      <div className="flex-1 flex items-center justify-center gap-2.5 max-w-2xl mx-auto overflow-hidden">
        {/* CA Box */}
        <div 
          onClick={handleCopyCa}
          className="flex items-center gap-2 bg-[#121216] border border-[#2a2a34] hover:border-white/50 px-3 py-1 rounded-xl cursor-pointer transition-all group shrink-0"
          title="Click to copy CA"
        >
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">CA:</span>
          <span className="text-xs font-mono text-white font-medium select-all">
            {CA_ADDRESS}
          </span>
          <button 
            type="button"
            className="text-zinc-400 group-hover:text-white transition-colors"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono font-bold">
                <CheckCheck className="w-3.5 h-3.5" />
                Copied!
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Modern X (Twitter) Link */}
        <a
          href="https://x.com/GrokSolver"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#121216] border border-[#2a2a34] hover:border-white hover:bg-white text-white hover:text-black px-2.5 py-1 rounded-xl transition-all font-mono text-xs font-bold shrink-0 group"
          title="Open GrokSolver on X"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">@GrokSolver</span>
        </a>
      </div>

      {/* Right: Live Status + Sync Button + Memory Panel Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-[#121216] border border-[#22222a] px-3 py-1 rounded-full text-xs text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-zinc-300 font-medium">
            {isSyncing ? 'Syncing agents...' : 'All agents synced'}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-zinc-400 text-[11px]">
            {lastSyncTime}
          </span>
        </div>

        {/* Right Memory Panel Toggle */}
        <button
          onClick={onToggleRightPanel}
          className={`p-1.5 rounded-md transition-colors border ${
            rightPanelOpen
              ? 'bg-[#27272c] text-white border-[#3f3f46]'
              : 'bg-[#1b1b1f] text-zinc-400 hover:text-white border-[#27272c] hover:bg-[#232328]'
          }`}
          title="Toggle Grok Memory & Telemetry Panel"
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

