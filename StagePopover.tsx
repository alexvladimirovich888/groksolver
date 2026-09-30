import React, { useState } from 'react';
import { X, Clock, Zap, CheckCircle2, Circle, AlertCircle, Play, ChevronRight, Terminal } from 'lucide-react';
import { StageInfo, SubStep } from '../types';

interface StagePopoverProps {
  stageInfo: StageInfo;
  agentName: string;
  problemTitle: string;
  onClose: () => void;
  isOpen: boolean;
  placement?: 'top' | 'bottom';
}

export const StagePopover: React.FC<StagePopoverProps> = ({
  stageInfo,
  agentName,
  problemTitle,
  onClose,
  isOpen,
  placement = 'top',
}) => {
  const [activeStepHover, setActiveStepHover] = useState<SubStep | null>(null);

  if (!isOpen) return null;

  const isBottom = placement === 'bottom';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-50 left-1/2 -translate-x-1/2 w-[340px] xs:w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] bg-[#141418] border border-[#2c2c36] rounded-2xl shadow-2xl shadow-black/90 p-4 text-zinc-100 backdrop-blur-md transition-all duration-200 pointer-events-auto ${
        isBottom
          ? 'top-full mt-3 animate-in fade-in slide-in-from-top-2'
          : 'bottom-full mb-3 animate-in fade-in slide-in-from-bottom-2'
      }`}
      onMouseLeave={() => {
        // Optional subtle delay or smooth leave
      }}
    >
      {/* Grok chat bubble arrow */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#141418] rotate-45 ${
          isBottom
            ? '-top-2 border-l border-t border-[#2c2c36]'
            : '-bottom-2 border-r border-b border-[#2c2c36]'
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#22222a] pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-white text-black">
              Stage {stageInfo.stageNumber}/{stageInfo.totalStages}
            </span>
            <span className="text-xs text-zinc-400 font-medium truncate max-w-[200px]">
              {problemTitle}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white leading-snug">
            "{stageInfo.title}"
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#22222a] transition-colors"
          title="Close Popup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Key Info Pill Bar */}
      <div className="bg-[#0b0b0e] border border-[#22222a] rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{stageInfo.elapsedTime}</span>
        </div>
        <span className="text-zinc-600">•</span>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <span>{stageInfo.stepsTaken.toLocaleString()} steps</span>
        </div>
        <span className="text-zinc-600">•</span>
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <span>{(stageInfo.efficiency * 100).toFixed(1)}% eff</span>
        </div>
      </div>

      {/* Mini Visual: 10-step timeline (colored dots) */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 mb-2">
          <span>10-Stage Verification Pipeline</span>
          <span className="font-mono text-zinc-500">
            {stageInfo.subSteps.filter(s => s.status === 'completed').length}/10 Verified
          </span>
        </div>

        <div className="grid grid-cols-10 gap-1 bg-[#0b0b0e] p-2 rounded-xl border border-[#22222a]">
          {stageInfo.subSteps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div
                key={step.id}
                onMouseEnter={() => setActiveStepHover(step)}
                onMouseLeave={() => setActiveStepHover(null)}
                className={`relative group h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : isActive
                    ? 'bg-white text-black animate-pulse border border-white shadow-sm shadow-white/30 font-bold'
                    : 'bg-[#1a1a20] text-zinc-600 border border-transparent hover:border-zinc-500'
                }`}
                title={`Step ${step.id}: ${step.name}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isActive ? (
                  <Play className="w-3 h-3 fill-current" />
                ) : (
                  <span className="text-[10px] font-mono font-bold">{step.id}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step / Hovered Step Detail Box */}
      {activeStepHover ? (
        <div className="bg-[#0b0b0e] border border-white/30 rounded-xl p-2.5 text-xs text-zinc-300 font-mono animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-white font-bold mb-1">
            <span>Step {activeStepHover.id}: {activeStepHover.name}</span>
            <span className="text-[10px] uppercase">{activeStepHover.status}</span>
          </div>
          <p className="text-zinc-400 text-[11px] font-sans">
            {activeStepHover.detail || 'Step verification under execution.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#0b0b0e] border border-[#22222a] rounded-xl p-2.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
            <Terminal className="w-3 h-3 text-white" />
            <span className="font-semibold text-zinc-300">Active Mathematical Theorem Focus:</span>
          </div>
          <p className="text-zinc-200 text-xs font-sans pl-4 border-l-2 border-white">
            {stageInfo.currentTheorem}
          </p>
        </div>
      )}

      {/* Footer hint */}
      <div className="mt-3 pt-2 border-t border-[#22222a] flex items-center justify-between text-[10px] text-zinc-500">
        <span>Hover step dots for detail</span>
        <button
          onClick={onClose}
          className="text-white hover:underline font-semibold"
        >
          Close popup
        </button>
      </div>
    </div>
  );
};
