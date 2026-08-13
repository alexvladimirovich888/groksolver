import React from 'react';
import { X, CheckCircle2, Clock, Zap, Cpu, Terminal, ShieldCheck, FileCode, ChevronRight, Activity } from 'lucide-react';
import { AgentData } from '../types';

interface AgentDetailModalProps {
  agent: AgentData | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#18181d] border border-[#2e2e38] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1f1f26] flex items-center justify-between bg-[#08080a]">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 flex items-center justify-center shrink-0 relative">
              <img
                src={agent.avatarUrl}
                alt={agent.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">{agent.name}</h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-black">
                  Stage {agent.currentStage}/{agent.totalStages}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {agent.problemTitle} • {agent.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a20] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Formula Display Box */}
          <div className="bg-[#121216] border border-[#22222a] rounded-xl p-4 text-center">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
              Core Mathematical Formula & Objective
            </span>
            <p className="text-lg font-mono font-bold text-white tracking-wider">
              {agent.formula}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#121216] border border-[#22222a] rounded-xl p-3">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Sub-Proofs Solved</span>
              <span className="text-base font-mono font-bold text-white">
                {agent.solvedCount} / {agent.totalProblems}
              </span>
            </div>

            <div className="bg-[#121216] border border-[#22222a] rounded-xl p-3">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Proof Efficiency</span>
              <span className="text-base font-mono font-bold text-white">
                {(agent.stageInfo.efficiency * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Key Insights List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Verified Key Proof Insights
            </h4>
            <div className="space-y-2">
              {agent.keyInsights.map((insight, idx) => (
                <div key={idx} className="bg-[#121216] border border-[#22222a] rounded-xl p-3 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 10-Stage Pipeline Deep Verification List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Complete 10-Stage Verification Log
            </h4>

            <div className="bg-[#0e0e12] border border-[#1f1f28] rounded-xl overflow-hidden divide-y divide-[#1c1c24]">
              {agent.stageInfo.subSteps.map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <div key={step.id} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                        isCompleted
                          ? 'bg-white/10 text-white border border-white/20'
                          : isActive
                          ? 'bg-white text-black animate-pulse'
                          : 'bg-[#181820] text-zinc-600'
                      }`}>
                        {step.id}
                      </span>

                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-200 truncate">{step.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{step.detail}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        isCompleted
                          ? 'bg-white/10 text-white'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#181820] text-zinc-600'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1f1f26] bg-[#08080a] flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Powered by Grok 4.6 Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
