/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { AgentCard } from './components/AgentCard';
import { RightMemoryPanel } from './components/RightMemoryPanel';
import { AgentDetailModal } from './components/AgentDetailModal';
import { 
  INITIAL_AGENTS, 
  generateInitialMemoryEntries, 
  generateInitialLogs,
  PROOF_LOG_GENERATOR_POOL,
  getFullTimeString,
  getRelativeTimeString,
  getFormattedCurrentDate
} from './data/mockData';
import { AgentData, MemoryEntry, TelemetryLog, GlobalDashboardStats } from './types';
import { LayoutGrid, ListFilter, Sparkles, ShieldCheck, Zap, Server, Activity } from 'lucide-react';

const STORAGE_KEYS = {
  LOGS: 'groksolver_telemetry_logs_v2',
  MEMORY: 'groksolver_memory_entries_v2',
  AGENTS: 'groksolver_agents_v2',
  LAST_SYNC: 'groksolver_last_sync_v2',
};

export default function App() {
  // Application State with localStorage hydration
  const [projectName, setProjectName] = useState('Grok Solver Dashboard');

  const [agents, setAgents] = useState<AgentData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback
    }
    return INITIAL_AGENTS;
  });

  const [memoryEntries, setMemoryEntries] = useState<MemoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback
    }
    return generateInitialMemoryEntries();
  });

  const [logs, setLogs] = useState<TelemetryLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback
    }
    return generateInitialLogs();
  });
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [inspectedAgent, setInspectedAgent] = useState<AgentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(true);

  // Dynamic real-time sync timestamp
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return getFormattedCurrentDate();
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(memoryEntries.slice(0, 30)));
    } catch (e) {}
  }, [memoryEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    } catch (e) {}
  }, [agents]);

  // Audio chime using Web Audio API
  const playSyncSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  };

  // Keep a pool index ref to cycle naturally through diverse proofs
  const poolIndexRef = useRef(0);
  const tickCountRef = useRef(0);

  // Live simulation ticker: continuously streams logs and updates steps
  useEffect(() => {
    const interval = setInterval(() => {
      tickCountRef.current += 1;
      const currentTimeStr = getFullTimeString(0);

      // 1. Pick next log message from rich mathematical pool or randomize
      const poolItem = PROOF_LOG_GENERATOR_POOL[poolIndexRef.current % PROOF_LOG_GENERATOR_POOL.length];
      poolIndexRef.current += 1;

      // Small jitter variations on numbers to make every log uniquely live
      const randomIteration = Math.floor(Math.random() * 90000) + 10000;
      const newLogMessage = poolItem.message.replace(/#\d+/, `#${randomIteration}`);

      const newLog: TelemetryLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: currentTimeStr,
        agentId: poolItem.agentId,
        agentName: poolItem.agentName,
        message: newLogMessage,
        type: poolItem.type,
      };

      // Prepend new log and keep up to 100 entries
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);

      // 2. Increment active steps for the corresponding agent
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.id === poolItem.agentId) {
            const additionalSteps = Math.floor(Math.random() * 6) + 2;
            return {
              ...agent,
              lastUpdated: 'Just now',
              stageInfo: {
                ...agent.stageInfo,
                stepsTaken: agent.stageInfo.stepsTaken + additionalSteps,
              },
            };
          }
          return agent;
        })
      );

      // 3. Occasionally generate a memory milestone (every ~15 ticks, ~40 seconds)
      if (tickCountRef.current % 15 === 0) {
        const milestoneTitles = [
          'Sub-step Boundary Verified',
          'Tensor Contraction Check Passed',
          'Zero Dispersion Bound Confirmed',
          'Orbit Trajectory Batch Clean',
        ];
        const randomTitle = milestoneTitles[Math.floor(Math.random() * milestoneTitles.length)];
        const newMemory: MemoryEntry = {
          id: `mem-${Date.now()}`,
          timestamp: getRelativeTimeString(0),
          title: `${poolItem.agentName}: ${randomTitle}`,
          summary: newLogMessage,
          tags: [poolItem.agentName.split(' ')[0], 'Live-Trace'],
          agentId: poolItem.agentId,
        };
        setMemoryEntries((prev) => [newMemory, ...prev.slice(0, 25)]);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Handle manual sync trigger
  const handleTriggerSync = () => {
    setIsSyncing(true);
    setIsSynced(false);
    playSyncSound();

    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
      const updatedDate = getFormattedCurrentDate();
      setLastSyncTime(updatedDate);

      // Add a memory log entry
      const newMemory: MemoryEntry = {
        id: `mem-${Date.now()}`,
        timestamp: getRelativeTimeString(0),
        title: 'Manual State Sync Completed',
        summary: 'Synchronized all 7 mathematical agent proof graphs across distributed nodes.',
        tags: ['Sync', 'Grok Core'],
      };

      setMemoryEntries((prev) => [newMemory, ...prev.slice(0, 25)]);
    }, 1000);
  };

  // Filter agents by search query & category
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All'
          ? true
          : categoryFilter === 'Solved'
          ? agent.solvedCount > 0
          : categoryFilter === 'In Progress'
          ? agent.solvedCount === 0
          : true;

      return matchesSearch && matchesCategory;
    });
  }, [agents, searchQuery, categoryFilter]);

  // Compute global stats
  const stats: GlobalDashboardStats = useMemo(() => {
    const totalSubProblemsSolved = agents.reduce((acc, a) => acc + a.solvedCount, 0); // e.g. 16
    const totalSubProblems = agents.reduce((acc, a) => acc + a.totalProblems, 0); // 49
    
    // The overall conjecture progress scale is calibrated around ~8.5% (in the 7-10% range)
    const avgSolvedPercentage = Math.round(
      agents.reduce((acc, a) => acc + a.solvedPercentage, 0) / agents.length
    );
    const overallSolvedPercentage = avgSolvedPercentage || 9;

    const totalStepsTaken = agents.reduce((acc, a) => acc + a.stageInfo.stepsTaken, 0);
    const totalComputeGflops = agents.reduce((acc, a) => acc + a.computeUsageGflops, 0);

    return {
      projectName,
      totalAgents: agents.length,
      totalSubProblemsSolved,
      totalSubProblems,
      overallSolvedPercentage,
      totalStepsTaken,
      totalComputeGflops,
      lastSyncTime,
      isSynced,
    };
  }, [agents, projectName, lastSyncTime, isSynced]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#101012] text-zinc-100 overflow-hidden font-sans select-none">
      {/* Top Bar (Grok-style) */}
      <TopBar
        projectName={projectName}
        onUpdateProjectName={setProjectName}
        lastSyncTime={lastSyncTime}
        isSynced={isSynced}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        rightPanelOpen={rightPanelOpen}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
      />

      {/* Main Container Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Grok Sidebar style) */}
        <Sidebar
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={(id) => {
            setSelectedAgentId(id);
            const found = agents.find((a) => a.id === id);
            if (found) setInspectedAgent(found);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalSolved={stats.totalSubProblemsSolved}
        />

        {/* Main Content Area: Dashboard Grid */}
        <main className="flex-1 overflow-y-auto bg-[#08080a] p-4 sm:p-6 custom-scrollbar flex flex-col justify-between">
          <div>
            {/* Main Header / Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-[#0e0e12] border border-[#1f1f26] rounded-2xl p-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider">
                    Distributed Multi-Agent Architecture
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">• 7 Active Solvers</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Unsolved Millennium & Open Problems Proof Grid
                </h1>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-[#141418] border border-[#22222a] rounded-xl px-3 py-2 text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Overall Solved</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {stats.totalSubProblemsSolved} / {stats.totalSubProblems} ({stats.overallSolvedPercentage}%)
                  </span>
                </div>

                <div className="bg-[#141418] border border-[#22222a] rounded-xl px-3 py-2 text-right">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Proof Steps</span>
                  <span className="text-sm font-bold font-mono text-zinc-200">
                    {stats.totalStepsTaken.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                {['All', 'In Progress', 'Solved'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all ${
                      categoryFilter === cat
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'bg-[#121216] text-zinc-400 hover:text-white border border-[#22222a]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Showing {filteredAgents.length} of 7 Agents
              </span>
            </div>

            {/* Dashboard Cards Grid (3 columns max) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgentId === agent.id}
                  onInspect={(a) => setInspectedAgent(a)}
                />
              ))}
            </div>
          </div>

          {/* Footer bar */}
          <footer className="mt-8 pt-4 border-t border-[#1a1a20] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-2">
              <span>Grok OS Desktop</span>
            </div>
            <div className="flex items-center gap-2 bg-[#121216] px-3 py-1.5 rounded-full border border-[#22222a]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-bold tracking-wide">Powered by Grok 4.6</span>
            </div>
          </footer>
        </main>

        {/* Right Memory & Telemetry Sidebar */}
        <RightMemoryPanel
          stats={stats}
          memoryEntries={memoryEntries}
          logs={logs}
          isOpen={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
          onTriggerSync={handleTriggerSync}
          isSyncing={isSyncing}
        />
      </div>

      {/* Agent Detail Modal */}
      <AgentDetailModal
        agent={inspectedAgent}
        onClose={() => setInspectedAgent(null)}
      />
    </div>
  );
}
