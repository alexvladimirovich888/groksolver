import React from 'react';
import { Search, Activity, Cpu, Waves, GitMerge, Zap, Layers, Workflow, CheckCircle2 } from 'lucide-react';
import { AgentData } from '../types';

interface SidebarProps {
  agents: AgentData[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalSolved: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  searchQuery,
  onSearchChange,
  totalSolved,
}) => {
  // Helper to render icon for agent
  const renderAgentIcon = (iconName: string, color: string) => {
    const props = { className: "w-4 h-4", style: { color } };
    switch (iconName) {
      case 'Activity': return <Activity {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'GitMerge': return <GitMerge {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Workflow': return <Workflow {...props} />;
      default: return <Activity {...props} />;
    }
  };

  return (
    <aside className="w-[300px] bg-[#0a0a0d] border-r border-[#1e1e24] flex flex-col h-full select-none shrink-0 overflow-hidden">
      {/* Top Search Bar (Grok style) */}
      <div className="p-3 border-b border-[#1e1e24]">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search math agents or problems..."
            className="w-full bg-[#141418] text-zinc-200 text-xs pl-9 pr-3 py-2 rounded-lg border border-transparent focus:border-white/40 focus:bg-[#18181f] focus:outline-none placeholder-zinc-500 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Agents Subheader */}
      <div className="px-3 py-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-400 uppercase border-b border-[#1c1c22]">
        <span>7 Solvers Active</span>
        <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono border border-white/20">
          {totalSolved}/49 Solved
        </span>
      </div>

      {/* Agents List (Grok Sidebar style) */}
      <div className="flex-1 overflow-y-auto py-1 px-1.5 space-y-1 custom-scrollbar">
        {agents.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            No agents found matching "{searchQuery}"
          </div>
        ) : (
          agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            const solvedFraction = `${agent.solvedCount}/${agent.totalProblems} solved`;
            const isSolvedSome = agent.solvedCount > 0;

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`group relative p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                  isSelected
                    ? 'bg-[#181820] border-[#2c2c38] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-[#121216] hover:border-[#1f1f26]'
                }`}
              >
                {/* Left: Avatar image */}
                <div className="w-11 h-11 flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-full h-full object-contain"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Solved checkmark pill overlay */}
                  {isSolvedSome && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 border-2 border-[#0a0a0d]" title="Partial sub-proofs completed">
                      <CheckCircle2 className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Center / Right info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs font-semibold truncate transition-colors ${
                      isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                    }`}>
                      {agent.name}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {agent.lastUpdated}
                    </span>
                  </div>

                  {/* Status & Solved ratio line */}
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className={`font-mono font-medium ${
                      isSolvedSome ? 'text-white' : 'text-zinc-400'
                    }`}>
                      {solvedFraction}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Stg {agent.currentStage}/{agent.totalStages}
                    </span>
                  </div>

                  {/* Mini Progress bar */}
                  <div className="w-full h-1 bg-[#1a1a20] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(agent.solvedPercentage, 4)}%`,
                        backgroundColor: isSolvedSome ? '#ffffff' : '#52525b',
                      }}
                    />
                  </div>
                </div>

                {/* Selection indicator line */}
                {isSelected && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r" />
                )}
              </div>
            );
          })
        )}
      </div>

    </aside>
  );
};
