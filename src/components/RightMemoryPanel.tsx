import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Database, Cpu, Sparkles, Terminal, Activity, Zap } from 'lucide-react';
import { MemoryEntry, TelemetryLog, GlobalDashboardStats } from '../types';

interface RightMemoryPanelProps {
  stats: GlobalDashboardStats;
  memoryEntries: MemoryEntry[];
  logs: TelemetryLog[];
  isOpen: boolean;
  onClose: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const RightMemoryPanel: React.FC<RightMemoryPanelProps> = ({
  stats,
  memoryEntries,
  logs,
  isOpen,
  onClose,
  onTriggerSync,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'logs'>('logs');

  if (!isOpen) return null;

  return (
    <aside className="w-[320px] sm:w-[360px] bg-[#0a0a0d] border-l border-[#1e1e24] flex flex-col h-full select-none shrink-0 overflow-hidden z-20">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#1e1e24] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-white" />
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">
            Grok Memory & Telemetry
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-[#181820] transition-colors"
          title="Close Memory Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Global Solved Metric Box */}
      <div className="p-3 border-b border-[#1e1e24] bg-[#121216]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-zinc-300">Conjecture Proof Progress</span>
          <span className="text-xs font-mono font-bold text-white">
            {stats.totalSubProblemsSolved}/{stats.totalSubProblems} Solved ({stats.overallSolvedPercentage}%)
          </span>
        </div>

        {/* Global Progress bar (~8.5% scale) */}
        <div className="w-full h-2.5 bg-[#1c1c24] rounded-full overflow-hidden mb-2.5 p-0.5 border border-[#262630]">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${Math.max(stats.overallSolvedPercentage, 6)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Last update time */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Last update: {stats.lastSyncTime}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {stats.totalStepsTaken.toLocaleString()} steps
          </span>
        </div>
      </div>

      {/* Tabs: Grok Memory vs Live Telemetry Logs */}
      <div className="flex items-center border-b border-[#1e1e24] bg-[#0d0d10]">
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'logs'
              ? 'border-white text-white bg-[#141418]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Proof Stream ({logs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all ${
            activeTab === 'memory'
              ? 'border-white text-white bg-[#141418]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Memory Log ({memoryEntries.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {activeTab === 'logs' ? (
          <div className="space-y-2 font-mono text-[11px]">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-xl p-2.5 space-y-1.5 transition-all ${
                  log.type === 'proof'
                    ? 'bg-[#141418] border-white/20 text-zinc-100 shadow-sm'
                    : log.type === 'success'
                    ? 'bg-[#101311] border-emerald-900/40 text-zinc-200'
                    : 'bg-[#111115] border-[#202026] text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white truncate max-w-[170px]">{log.agentName}</span>
                    {log.type === 'proof' && (
                      <span className="px-1 py-0.2 rounded bg-white text-black text-[9px] font-bold uppercase">
                        Proof
                      </span>
                    )}
                    {log.type === 'success' && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase border border-emerald-500/30">
                        Solved
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
                </div>
                <p className="text-zinc-300 leading-snug font-sans text-xs">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Grok Desktop screenshot style "Memory updated" banner */}
            <div className="text-center py-1">
              <span className="text-[11px] font-mono font-medium text-zinc-400 bg-[#141418] px-3 py-1 rounded-full border border-[#232328]">
                Memory updated
              </span>
            </div>

            {memoryEntries.map((mem) => (
              <div
                key={mem.id}
                className="bg-[#111115] border border-[#202026] rounded-xl p-3 text-xs text-zinc-200 transition-all hover:border-[#30303a]"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="truncate max-w-[200px]">{mem.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 shrink-0">{mem.timestamp}</span>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed mb-2">
                  {mem.summary}
                </p>

                <div className="flex flex-wrap gap-1">
                  {mem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono bg-[#1c1c22] text-zinc-400 px-1.5 py-0.5 rounded border border-[#262630]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
};
