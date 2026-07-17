/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pool } from '../types';

interface PoolDetailsProps {
  pool: Pool;
  onBack: () => void;
  onOpenDeposit: () => void;
  userAvatar: string;
}

export default function PoolDetails({ pool, onBack, onOpenDeposit, userAvatar }: PoolDetailsProps) {
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Deposit Volume Over Time data points (C1 to C6)
  const depositVolumeData = [
    { cycle: 'C1', value: 140, amount: '₦120.4M' },
    { cycle: 'C2', value: 120, amount: '₦210.1M' },
    { cycle: 'C3', value: 100, amount: '₦340.8M' },
    { cycle: 'C4', value: 95, amount: '₦510.2M' },
    { cycle: 'C5', value: 60, amount: '₦720.0M' },
    { cycle: 'C6', value: 55, amount: '₦850.4M' }
  ];

  // Sector Demand bar data
  const sectorDemandData = [
    { label: 'C1', borrowing: 30, repayment: 20 },
    { label: 'C2', borrowing: 45, repayment: 35 },
    { label: 'C3', borrowing: 60, repayment: 50 },
    { label: 'C4', borrowing: 85, repayment: 70 }
  ];

  return (
    <div className="w-full bg-background-page min-h-screen pb-40">
      
      {/* Top App Bar Header */}
      <header className="w-full sticky top-0 z-40 bg-background-card border-b border-white/10 shadow-none flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="material-symbols-outlined text-text-primary hover:bg-white/5 p-2 rounded-full transition-standard active:scale-95 cursor-pointer"
          >
            arrow_back
          </button>
          <span className="text-xl font-display italic font-bold text-accent-gold flex items-center gap-1.5">
            Sila
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-text-muted hover:bg-white/5 p-2 rounded-full cursor-pointer transition-standard">
            notifications
          </span>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer hover:ring-2 hover:ring-accent-gold/20 transition-standard">
            <img 
              className="w-full h-full object-cover" 
              src={userAvatar} 
              alt="User profile avatar" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-6 space-y-10">
        
        {/* Header Title Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{pool.emoji}</span>
                <h2 className="text-3xl md:text-4xl font-display italic text-text-primary tracking-tight">
                  {pool.title}
                </h2>
              </div>
              <p className="text-sm text-text-muted max-w-2xl leading-relaxed font-light">
                {pool.description}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-accent-gold/10 text-accent-gold px-4 py-2 rounded-full border border-accent-gold/20 hover:bg-accent-gold/25 transition-standard cursor-default">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Cycle 4 · Ends in 42 days</span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background-card border border-white/10 p-5 rounded-3xl shadow-none transition-standard cursor-default text-left">
            <p className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">Total Deposited</p>
            <p className="text-xl md:text-2xl font-bold text-text-primary">{pool.totalLiquidity}</p>
          </div>
          <div className="bg-background-card border border-white/10 p-5 rounded-3xl shadow-none transition-standard cursor-default text-left">
            <p className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">Available Liquidity</p>
            <p className="text-xl md:text-2xl font-bold text-text-primary">{pool.availableLiquidity}</p>
          </div>
          <div className="bg-background-card border border-white/10 p-5 rounded-3xl shadow-none transition-standard cursor-default text-left">
            <p className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">On Loan</p>
            <p className="text-xl md:text-2xl font-bold text-text-primary">{pool.onLoan}</p>
          </div>
          <div className="bg-background-card border border-white/10 p-5 rounded-3xl shadow-none transition-standard cursor-default text-left">
            <p className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">Avg ROI</p>
            <p className="text-xl md:text-2xl font-display italic font-bold text-accent-gold">{pool.roi}</p>
          </div>
        </section>

        {/* Bento Grid section: Liquidity & Activity */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Liquidity utilization */}
          <div className="md:col-span-1 bg-background-card border border-white/10 p-6 rounded-3xl shadow-none flex flex-col justify-between hover:border-white/20 transition-standard text-left">
            <h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-6">Liquidity Utilization</h3>
            <div className="relative flex flex-col items-center justify-center py-4">
              <div className="text-center mb-4">
                <span className="text-3xl font-display italic font-bold text-accent-gold tabular-nums">86%</span>
                <p className="text-xs text-text-muted mt-0.5 font-light">Deployed Capital</p>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-accent-gold transition-all duration-1000 ease-out" style={{ width: '86%' }}></div>
              </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mt-4 text-center font-light">
              ₦730.2M of ₦850.4M currently out on active leases.
            </p>
          </div>

          {/* Recent Activity feed */}
          <div className="md:col-span-2 bg-background-card border border-white/10 p-6 rounded-3xl shadow-none hover:border-white/20 transition-standard text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Recent Activity</h3>
              <button className="text-accent-gold font-bold text-[10px] uppercase tracking-wider hover:opacity-80 rounded-full px-2 py-1 transition-standard cursor-pointer">
                View All
              </button>
            </div>
            
            <div className="divide-y divide-white/5">
              <div className="py-4 flex justify-between items-center group cursor-pointer hover:bg-white/2 px-2 -mx-2 rounded-2xl transition-standard">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-standard">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Loan repaid</p>
                    <p className="text-xs text-text-muted mt-0.5 font-light">Cycle 4 Lease • Farmer Group ID-402</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-gold tabular-nums">₦2,400,000</p>
                  <p className="text-[10px] text-text-muted mt-0.5 font-light">3 days ago</p>
                </div>
              </div>

              <div className="py-4 flex justify-between items-center group cursor-pointer hover:bg-white/2 px-2 -mx-2 rounded-2xl transition-standard">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-standard">
                    <span className="material-symbols-outlined text-[20px]">input</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">New deposit</p>
                    <p className="text-xs text-text-muted mt-0.5 font-light">Institutional Account • 0x...F2D1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary tabular-nums">₦50,000</p>
                  <p className="text-[10px] text-text-muted mt-0.5 font-light">4 days ago</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Deposit volume line chart */}
          <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-none hover:border-white/20 transition-standard text-left">
            <h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-6">Deposit Volume over Time</h3>
            <div className="h-48 w-full relative flex items-end justify-between pt-4 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pt-4 transition-standard" preserveAspectRatio="none" viewBox="0 0 400 150">
                {/* SVG gradient fill */}
                <defs>
                  <linearGradient id="chart-grad-details" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                
                {/* Line path matching Screenshot 6 */}
                <path 
                  d="M0 140 L80 120 L160 100 L240 60 L320 30 L400 10" 
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="2.5" 
                  vectorEffect="non-scaling-stroke"
                />
                <path 
                  d="M0 140 L80 120 L160 100 L240 60 L320 30 L400 10 L400 150 L0 150 Z" 
                  fill="url(#chart-grad-details)" 
                />

                {/* Plot points for interaction */}
                {depositVolumeData.map((d, index) => {
                  const cx = (index / 5) * 400;
                  const cy = [140, 120, 100, 60, 30, 10][index];
                  return (
                    <circle 
                      key={index}
                      cx={cx}
                      cy={cy}
                      r={activeChartPoint === index ? 6 : 4}
                      fill={activeChartPoint === index ? "#D4AF37" : "#111111"}
                      stroke="#D4AF37"
                      strokeWidth="2"
                      className="cursor-pointer transition-standard"
                      onMouseEnter={() => setActiveChartPoint(index)}
                      onMouseLeave={() => setActiveChartPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Chart Tooltip Overlay */}
              {activeChartPoint !== null && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-accent-gold text-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow font-bold flex items-center gap-1.5 transition-standard">
                  <span>{depositVolumeData[activeChartPoint].cycle}:</span>
                  <span className="font-bold tabular-nums">{depositVolumeData[activeChartPoint].amount}</span>
                </div>
              )}

              {/* Bottom cycle axis */}
              <div className="absolute bottom-1 left-0 w-full flex justify-between text-[10px] text-text-muted font-bold px-2">
                <span>C1</span><span>C2</span><span>C3</span><span>C4</span><span>C5</span><span>C6</span>
              </div>
            </div>
          </div>

          {/* Bar Chart: Sector demand */}
          <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-none hover:border-white/20 transition-standard text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Sector Demand</h3>
              <div className="flex gap-4 text-[9px] font-bold text-text-muted">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-accent-gold"></div>
                  <span>BORROWING</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white/10 border border-white/20"></div>
                  <span>REPAYMENT</span>
                </div>
              </div>
            </div>

            {/* Interactive Bars container */}
            <div className="h-48 w-full flex items-end justify-around gap-4 pb-4">
              {sectorDemandData.map((d, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-1.5 w-full h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip on hover */}
                  {hoveredBar === index && (
                    <div className="absolute -top-4 bg-gray-900 text-white text-[10px] py-0.5 px-2 rounded font-semibold whitespace-nowrap shadow z-10">
                      B: {d.borrowing}% | R: {d.repayment}%
                    </div>
                  )}

                  <div className="flex items-end gap-1.5 w-full justify-center">
                    <div 
                      className="w-3 md:w-5 bg-accent-gold rounded-t-sm transition-all duration-500 origin-bottom group-hover:brightness-110" 
                      style={{ height: `${d.borrowing}%` }}
                    />
                    <div 
                      className="w-3 md:w-5 bg-white/10 border-t border-x border-white/20 rounded-t-sm transition-all duration-500 origin-bottom group-hover:bg-white/20" 
                      style={{ height: `${d.repayment}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted group-hover:text-accent-gold transition-standard">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-background-card/90 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col items-center gap-2 rounded-t-3xl shadow-none">
        <button 
          onClick={onOpenDeposit}
          className="w-full max-w-lg bg-accent-gold hover:opacity-90 text-black py-4 px-10 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-md flex items-center justify-center gap-2 group transition-standard cursor-pointer"
        >
          <span className="material-symbols-outlined transition-standard group-hover:rotate-90">add_circle</span>
          Deposit into this pool
        </button>
        <p className="text-[11px] text-text-muted text-center max-w-xs leading-relaxed font-light">
          Withdrawals available from reserve or next cycle close in 42 days.
        </p>
      </div>

    </div>
  );
}
