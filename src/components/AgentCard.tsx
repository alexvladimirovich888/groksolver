import React, { useState, useRef, useEffect } from 'react';
import { Activity, Cpu, Waves, GitMerge, Zap, Layers, Workflow, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { AgentData } from '../types';
import { StagePopover } from './StagePopover';

interface AgentCardProps {
  agent: AgentData;
  onInspect: (agent: AgentData) => void;
  isSelected?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onInspect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverManualOpen, setIsPopoverManualOpen] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState<'top' | 'bottom'>('top');
  const cardRef = useRef<HTMLDivElement>(null);

  const isSolvedSome = agent.solvedCount > 0;
  const showPopover = isHovered || isPopoverManualOpen;

  const checkPlacement = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      // If card top is less than 350px from viewport top, show popover below card
      if (rect.top < 350) {
        setPopoverPlacement('bottom');
      } else {
        setPopoverPlacement('top');
      }
    }
  };

  useEffect(() => {
    if (showPopover) {
      checkPlacement();
    }
  }, [showPopover]);

  return (
    <div
      ref={cardRef}
      onClick={() => onInspect(agent)}
      onMouseEnter={() => {
        checkPlacement();
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPopoverManualOpen(false);
      }}
      className={`relative group bg-[#111115] border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-2xl cursor-pointer ${
        showPopover ? 'z-40' : 'z-0'
      } ${
        isSelected
          ? 'border-white shadow-lg shadow-white/10 bg-[#16161c]'
          : 'border-[#202026] hover:border-[#30303c] hover:bg-[#16161b]'
      }`}
    >
      {/* Hover Popup Window */}
      <StagePopover
        stageInfo={agent.stageInfo}
        agentName={agent.name}
        problemTitle={agent.problemTitle}
        isOpen={showPopover}
        placement={popoverPlacement}
        onClose={() => {
          setIsHovered(false);
          setIsPopoverManualOpen(false);
        }}
      />

      <div>
        {/* Top Header: Avatar + Agent Name + Solved Fraction */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Clean Avatar */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-105">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
              {isSolvedSome && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 border-2 border-[#111115]" title="Sub-proofs solved">
                  <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white group-hover:underline transition-colors leading-snug">
                  {agent.name}
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {agent.problemTitle}
              </p>
            </div>
          </div>

          {/* Big Progress Number */}
          <div className="text-right shrink-0">
            <span className={`text-xs font-bold font-mono px-2 py-1 rounded-lg border ${
              isSolvedSome
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-[#1c1c22] text-zinc-300 border-[#262630]'
            }`}>
              {agent.solvedCount}/{agent.totalProblems} solved ({agent.solvedPercentage}%)
            </span>
          </div>
        </div>

        {/* Center: Large Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
            <span>Overall Task Progress</span>
            <span className="font-semibold text-zinc-200">{agent.solvedPercentage}%</span>
          </div>

          <div className="w-full h-2.5 bg-[#1a1a20] rounded-full overflow-hidden p-0.5 border border-[#24242c]">
            <div
              className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{
                width: `${Math.max(agent.solvedPercentage, 3)}%`,
                backgroundColor: '#ffffff',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {agent.description}
        </p>
      </div>

      {/* Bottom: Clickable Stage pill + Inspector trigger */}
      <div className="pt-3 border-t border-[#1e1e26] flex items-center justify-between gap-2">
        {/* Clickable Stage Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverManualOpen(!isPopoverManualOpen);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181820] hover:bg-[#22222a] text-xs font-mono font-semibold text-zinc-200 transition-colors border border-[#262630] group-hover:border-white/40"
          title="Click to view stage details popup"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Stage: {agent.currentStage}/{agent.totalStages}</span>
        </button>

        {/* Inspect Agent Trace trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspect(agent);
          }}
          className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <span>Trace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
