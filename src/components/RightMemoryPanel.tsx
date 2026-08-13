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
  const [activeTab, setActiveTab] = useState<'memory' | 'logs'>('memory');

  if (!isOpen) return null;

  return (
    <aside className="w-[320px] sm:w-[350px] bg-[#0a0a0d] border-l border-[#1e1e24] flex flex-col h-full select-none shrink-0 overflow-hidden z-20">
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

      {/* Global Solved Metric Box (Right Sidebar Requirement) */}
      <div className="p-3 border-b border-[#1e1e24] bg-[#121216]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-300">Total Solved Across All 7 Agents</span>
          <span className="text-xs font-mono font-bold text-white">
            {stats.totalSubProblemsSolved}/{stats.totalSubProblems} Sub-Proofs
          </span>
        </div>

        {/* Global Progress bar */}
        <div className="w-full h-2 bg-[#1c1c24] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.max(stats.overallSolvedPercentage, 5)}%` }}
          />
        </div>

        {/* Last update time */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[11px] font-mono text-zinc-500">
            Last update: {stats.lastSyncTime}
          </span>
        </div>
      </div>

      {/* Tabs: Grok Memory vs Live Telemetry Logs */}
      <div className="flex items-center border-b border-[#1e1e24] bg-[#0d0d10]">
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
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-white text-white bg-[#141418]'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Proof Stream ({logs.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {activeTab === 'memory' ? (
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>{mem.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">{mem.timestamp}</span>
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
        ) : (
          <div className="space-y-2 font-mono text-[11px]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#111115] border border-[#202026] rounded-lg p-2.5 space-y-1 text-zinc-300"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-white">{log.agentName}</span>
                  <span className="text-zinc-500">{log.timestamp}</span>
                </div>
                <p className="text-zinc-400 leading-snug font-sans">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
