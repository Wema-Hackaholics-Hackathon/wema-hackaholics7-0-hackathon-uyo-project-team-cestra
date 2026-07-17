/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pool, Position, Transaction, LoanApplication, TabId } from '../types';

interface DashboardProps {
  pools: Pool[];
  positions: Position[];
  transactions: Transaction[];
  onOpenSupport: () => void;
  onSelectPool: (pool: Pool) => void;
  onSelectTransaction: (txn: Transaction) => void;
  userAvatar: string;
  totalBalance: number;
  unallocatedFunds: number;
  setTotalBalance: React.Dispatch<React.SetStateAction<number>>;
  setUnallocatedFunds: React.Dispatch<React.SetStateAction<number>>;
}

export default function Dashboard({
  pools,
  positions,
  transactions,
  onOpenSupport,
  onSelectPool,
  onSelectTransaction,
  userAvatar,
  totalBalance,
  unallocatedFunds,
  setTotalBalance,
  setUnallocatedFunds
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  
  // Wallet Currency Exchanger State
  const [usdInput, setUsdInput] = useState('1');
  const [nairaResult, setNairaResult] = useState(1550.00);

  // Business Loan Application Form State
  const [loanSector, setLoanSector] = useState('Agriculture & Supply Chain');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanTimeline, setLoanTimeline] = useState('6 Months');
  const [loanRationale, setLoanRationale] = useState('');
  const [loanList, setLoanApplications] = useState<LoanApplication[]>([]);
  const [showLoanSubmitSuccess, setShowLoanSuccess] = useState(false);

  // Expanded Active Positions State
  const [expandedPositionId, setExpandedPositionId] = useState<string | null>(null);

  // Dynamic calculations based on user actions
  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleUsdChange = (val: string) => {
    setUsdInput(val);
    const usd = parseFloat(val);
    if (!isNaN(usd) && usd >= 0) {
      setNairaResult(usd * 1550);
    } else {
      setNairaResult(0);
    }
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(loanAmount);
    if (!amt || amt <= 0 || !loanPurpose || !loanRationale) {
      alert('Please fill out all fields of the loan application.');
      return;
    }

    const newApp: LoanApplication = {
      sector: loanSector,
      amount: amt,
      purpose: loanPurpose,
      timeline: loanTimeline,
      rationale: loanRationale,
      status: 'Submitted',
      date: 'Oct 24, 2023',
      time: '10:45 AM'
    };

    setLoanApplications([newApp, ...loanList]);
    setShowLoanSuccess(true);
    setLoanAmount('');
    setLoanPurpose('');
    setLoanRationale('');

    setTimeout(() => {
      setShowLoanSuccess(false);
    }, 4000);
  };

  // Filter pools list based on search query and optional category filter
  const filteredPools = pools.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter ? p.sector.toLowerCase() === selectedFilter.toLowerCase() : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-background-page min-h-screen pb-32 text-text-primary">
      
      {/* Top Header */}
      <header className="w-full sticky top-0 z-40 bg-background-page/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 cursor-pointer hover:ring-2 hover:ring-accent-gold/20 transition-standard">
            <img 
              className="w-full h-full object-cover" 
              src={userAvatar} 
              alt="User avatar" 
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-lg font-display tracking-widest font-bold text-accent-gold flex items-center gap-1.5 uppercase">Sila</span>
        </div>
        <button 
          onClick={onOpenSupport}
          className="w-10 h-10 flex items-center justify-center rounded-full text-text-primary hover:bg-white/5 hover:text-accent-gold transition-standard active:scale-90"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main Tab Screen Area */}
      <main className="max-w-[1120px] mx-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME TAB */}
          {activeTab === 'home' && (
            <motion.div 
              key="home-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Portfolio Balance Hero Card */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">PORTFOLIO BALANCE</p>
                  <h2 className="text-4xl md:text-5xl font-display italic font-bold text-text-primary tabular-nums mt-1.5">{formatNaira(totalBalance)}</h2>
                  <div className="flex items-center gap-1.5 text-accent-gold text-xs font-light tracking-wide mt-2">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>+₦660,400 ROI · Across {positions.length} active positions</span>
                  </div>
                </div>
                
                {/* Simulated Quick Action button triggers the general deposit flow */}
                <button 
                  onClick={() => onSelectPool(pools[0])}
                  className="bg-accent-gold hover:opacity-90 text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2 shadow-lg active:scale-95 transition-standard cursor-pointer w-fit"
                >
                  <span className="material-symbols-outlined text-sm font-black">add</span>
                  Deposit Funds
                </button>
              </div>

              {/* Bento Grid: Active Positions & Cycle Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left block - Active Positions Summarized */}
                <div className="bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm col-span-2 text-left transition-standard">
                  <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Active Positions</h3>
                  <div className="space-y-2">
                    {positions.map((pos) => {
                      const associatedPool = pools.find(p => p.id === pos.poolId);
                      return (
                        <div 
                          key={pos.id}
                          onClick={() => associatedPool && onSelectPool(associatedPool)}
                          className="group flex items-center justify-between py-3.5 px-4 -mx-4 rounded-2xl hover:bg-white/2 cursor-pointer transition-standard"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 text-accent-gold rounded-2xl flex items-center justify-center transition-standard group-hover:scale-105">
                              <span className="material-symbols-outlined text-2xl">
                                {pos.sector === 'Agriculture' ? 'agriculture' : 'local_shipping'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary group-hover:text-accent-gold transition-standard">
                                {pos.sector} Pool
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">{pos.cycle} • Maturity {pos.maturityDate}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-text-primary group-hover:text-accent-gold transition-standard tabular-nums">
                            {pos.amount}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right block - Current Cycle Status */}
                <div className="bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm overflow-hidden relative text-left transition-standard">
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Cycle 4 Status</h3>
                    <p className="text-xs text-text-muted leading-relaxed font-light mb-6">Open for new deposits across all sector pools.</p>
                    
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-display font-bold text-accent-gold tabular-nums">42</span>
                      <span className="text-text-muted text-xs font-light">days left</span>
                    </div>

                    <div className="w-full bg-white/5 rounded-full h-1 mb-4">
                      <div className="bg-accent-gold h-1 rounded-full w-2/3"></div>
                    </div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em]">68% Capacity reached</p>
                  </div>
                  <div className="absolute bottom-[-15px] right-[-15px] opacity-5 pointer-events-none text-accent-gold">
                    <span className="material-symbols-outlined text-9xl">update</span>
                  </div>
                </div>

              </div>

              {/* Informative Help Card */}
              <div className="bg-white/2 p-5 rounded-3xl border border-white/5 flex items-start gap-4 text-left">
                <span className="material-symbols-outlined text-accent-gold text-2xl">verified_user</span>
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">High-Trust Fintech Safeguard</h4>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    Sila’s sector pools are governed by strict institutional liquidity reserve rules. Principal is protected at a 1:1 ratio with physical commodity and supply-chain leases.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: POOLS TAB (Screenshot 12) */}
          {activeTab === 'pools' && (
            <motion.div 
              key="pools-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-display italic text-text-primary tracking-tight">Liquidity Pools</h1>
                <p className="text-sm text-text-muted mt-2 leading-relaxed max-w-xl font-light">
                  Access high-yield opportunities in vital economic sectors. Every pool is backed by real-world assets and institutional-grade risk assessment.
                </p>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-grow md:flex-grow-0">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
                  <input 
                    type="text"
                    placeholder="Search sectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-background-card border border-white/10 text-text-primary placeholder:text-text-muted/40 text-sm focus:outline-none focus:border-accent-gold transition-standard rounded-full"
                  />
                </div>
                
                {/* Horizontal Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Agriculture', 'Logistics', 'Real Estate', 'Retail'].map((cat) => {
                    const isSelected = (!selectedFilter && cat === 'All') || (selectedFilter === cat);
                    return (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat === 'All' ? null : cat)}
                        className={`px-5 py-2 text-[10px] font-bold uppercase tracking-wider border rounded-full transition-standard whitespace-nowrap cursor-pointer ${
                          isSelected 
                          ? 'bg-accent-gold border-accent-gold text-black shadow-md' 
                          : 'bg-background-card border-white/10 hover:bg-white/5 text-text-primary'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pool Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPools.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => onSelectPool(p)}
                    className="bg-background-card rounded-3xl p-6 border border-white/10 flex flex-col h-full hover:border-white/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-standard active:scale-98 cursor-pointer text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-2xl bg-white/5 text-accent-gold">
                        <span className="material-symbols-outlined text-[28px]">{p.emoji}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">ROI (ANNUAL)</span>
                        <span className="text-lg font-display italic font-bold text-accent-gold">{p.roi}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-text-primary mb-1.5">{p.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed mb-6 flex-grow font-light">{p.description}</p>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-bold text-text-muted uppercase mb-1 tracking-widest">TOTAL LIQUIDITY</p>
                          <p className="text-sm font-bold text-text-primary tabular-nums">{p.totalLiquidity}</p>
                        </div>
                        <div className="w-24 h-10 flex items-end gap-1 pointer-events-none">
                          <div className="w-full bg-accent-gold/10 h-[30%] rounded-sm"></div>
                          <div className="w-full bg-accent-gold/10 h-[50%] rounded-sm"></div>
                          <div className="w-full bg-accent-gold/10 h-[40%] rounded-sm"></div>
                          <div className="w-full bg-accent-gold/15 h-[70%] rounded-sm"></div>
                          <div className="w-full bg-accent-gold h-[100%] rounded-sm"></div>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-accent-gold h-full rounded-full" style={{ width: `${p.utilization}%` }}></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPool(p);
                        }}
                        className="flex-1 bg-accent-gold hover:opacity-90 text-black text-[10px] font-bold uppercase tracking-[0.15em] py-3 rounded-full transition-standard shadow-md active:scale-95 cursor-pointer"
                      >
                        DEPOSIT
                      </button>
                      <button 
                        type="button"
                        className="px-4 border border-white/10 text-text-muted hover:bg-white/5 hover:text-white rounded-full transition-standard active:scale-95 flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">info</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-5 bg-white/2 border border-white/5 rounded-3xl flex items-start gap-4">
                <span className="material-symbols-outlined text-accent-gold">verified_user</span>
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-1">Institutional Guardrails</h4>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    All pools are audited bi-monthly by Sila’s risk committee. Principal protection is active for this cycle across all Agriculture and Logistics sectors. Historical performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WALLET TAB (Screenshot 8) */}
          {activeTab === 'wallet' && (
            <motion.div 
              key="wallet-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {/* Wallet Fund Balance Display */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Unallocated Funds</p>
                  <h2 className="text-4xl md:text-5xl font-display italic font-bold text-text-primary mt-1.5 tabular-nums">{formatNaira(unallocatedFunds)}</h2>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setUnallocatedFunds(prev => prev + 100000);
                      setTotalBalance(prev => prev + 100000);
                      alert('Simulated: Added ₦100,000.00 to account.');
                    }}
                    className="bg-accent-gold hover:opacity-90 text-black text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-full flex items-center gap-1.5 transition-standard active:scale-95 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Fund Account
                  </button>
                  <button 
                    onClick={() => alert('Opening allocation settings...')}
                    className="bg-transparent hover:bg-white/5 border border-white/10 text-text-primary text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-full flex items-center gap-1.5 transition-standard active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">account_tree</span>
                    Allocate to Envelopes
                  </button>
                </div>
              </div>

              {/* Envelope Distribution chart block */}
              <div className="bg-background-card rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Envelope Distribution</span>
                  <span className="text-xs font-mono font-bold text-accent-gold">₦1,200,000.00 Total</span>
                </div>
                
                {/* Horizontal Segmented Bar chart */}
                <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                  <div className="bg-accent-gold w-[45%]" title="Agriculture (45%)"></div>
                  <div className="bg-white/40 w-[30%]" title="Tech (30%)"></div>
                  <div className="bg-white/10 w-[25%]" title="Manufacturing (25%)"></div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-gold"></div>
                    <span className="text-xs font-light text-text-primary">Agric (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
                    <span className="text-xs font-light text-text-primary">Tech (30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                    <span className="text-xs font-light text-text-primary">Mfg (25%)</span>
                  </div>
                </div>
              </div>

              {/* Exchanger & Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Currency Exchange tool card */}
                <div className="md:col-span-2 bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-white/20 transition-standard">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-text-primary">Currency Exchange</h3>
                      <span className="text-[9px] font-mono text-text-muted tracking-widest uppercase">Updated 2 mins ago</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* USD Box input */}
                      <div className="flex items-center gap-2 bg-white/2 px-4 py-3 rounded-2xl border border-white/5 flex-1">
                        <span className="material-symbols-outlined text-accent-gold text-base">payments</span>
                        <input 
                          type="number"
                          value={usdInput}
                          onChange={(e) => handleUsdChange(e.target.value)}
                          className="bg-transparent border-none text-sm font-bold text-text-primary outline-none focus:ring-0 w-full p-0"
                          placeholder="1"
                        />
                        <span className="text-xs text-text-muted font-bold">USD</span>
                      </div>

                      <span className="material-symbols-outlined text-text-muted transition-standard">compare_arrows</span>

                      {/* NGN Display result */}
                      <div className="flex items-center gap-2 bg-white/2 px-4 py-3 rounded-2xl border border-white/5 flex-1 select-all cursor-default">
                        <span className="material-symbols-outlined text-accent-gold text-base">account_balance_wallet</span>
                        <span className="text-sm font-bold text-text-primary tabular-nums">
                          {nairaResult.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-text-muted font-bold">NGN</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 pt-4 gap-4">
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed font-light">Secure the best rate for your USD-backed liquidity pool investments.</p>
                    <button 
                      onClick={() => {
                        const usdAmount = parseFloat(usdInput);
                        if (!usdAmount || usdAmount <= 0) return;
                        alert(`Simulated exchange of $${usdAmount} USD completed!`);
                      }}
                      className="bg-accent-gold hover:opacity-90 text-black text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full active:scale-95 transition-standard cursor-pointer"
                    >
                      Buy USD
                    </button>
                  </div>
                </div>

                {/* Portfolio stats card */}
                <div className="bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-white/20 transition-standard">
                  <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Portfolio Performance</h3>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-muted font-light">Yield Earned</span>
                      <span className="font-bold text-accent-gold">+₦12,450.00</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-accent-gold h-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => setActiveTab('activity')}
                      className="text-accent-gold hover:opacity-80 font-bold text-[10px] uppercase tracking-[0.15em] flex items-center gap-1 transition-standard"
                    >
                      View Statement
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                </div>

              </div>

              <hr className="border-white/10 my-4" />

              {/* LOAN APPLICATION FORM (Screenshot 8 lower half) */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-display italic text-text-primary tracking-tight">Business Loan Application</h2>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed font-light">Apply for sector-based liquidity for your business operations.</p>
                  </div>
                  <div className="hidden md:flex bg-background-card border border-white/10 p-3 px-4 rounded-2xl items-center gap-3 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Credit Score</span>
                      <span className="text-xs font-bold text-text-primary">Institutional A+</span>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <span className="material-symbols-outlined text-accent-gold">verified</span>
                  </div>
                </div>

                {/* Submit Application success Toast */}
                {showLoanSubmitSuccess && (
                  <div className="p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-2xl text-accent-gold text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Loan application submitted successfully! Review details in status tracker.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form Block */}
                  <div className="lg:col-span-2 bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm hover:border-white/20 transition-standard">
                    <form onSubmit={handleLoanSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-text-primary">Target Sector Pool</label>
                          <select 
                            value={loanSector}
                            onChange={(e) => setLoanSector(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-white/10 bg-background-page text-sm focus:border-accent-gold focus:ring-0 outline-none transition-standard text-text-primary cursor-pointer"
                          >
                            <option>Agriculture & Supply Chain</option>
                            <option>Tech Infrastructure</option>
                            <option>Manufacturing & Export</option>
                          </select>
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-text-primary">Funding Amount (₦)</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 5,000,000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-white/10 bg-background-page text-sm focus:border-accent-gold focus:ring-0 outline-none transition-standard text-text-primary placeholder:text-text-muted/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-text-primary">Primary Purpose</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Grain Processing Equipment"
                            value={loanPurpose}
                            onChange={(e) => setLoanPurpose(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-white/10 bg-background-page text-sm focus:border-accent-gold focus:ring-0 outline-none transition-standard text-text-primary placeholder:text-text-muted/30"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-text-primary">Repayment Timeline</label>
                          <select 
                            value={loanTimeline}
                            onChange={(e) => setLoanTimeline(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-white/10 bg-background-page text-sm focus:border-accent-gold focus:ring-0 outline-none transition-standard text-text-primary cursor-pointer"
                          >
                            <option>6 Months</option>
                            <option>12 Months</option>
                            <option>24 Months</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-text-primary">Business Rationale & Impact</label>
                        <textarea 
                          rows={4}
                          value={loanRationale}
                          onChange={(e) => setLoanRationale(e.target.value)}
                          placeholder="Describe how this liquidity will drive growth and your strategy for repayment..."
                          className="w-full p-4 rounded-xl border border-white/10 bg-background-page text-sm focus:border-accent-gold focus:ring-0 outline-none transition-standard text-text-primary placeholder:text-text-muted/30"
                        />
                      </div>

                      <div className="pt-2 text-left">
                        <button 
                          type="submit"
                          className="bg-accent-gold hover:opacity-90 text-black px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] flex items-center gap-1.5 transition-standard active:scale-95 shadow-md cursor-pointer"
                        >
                          Submit Application
                          <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Sidebar Tracker */}
                  <div className="space-y-6">
                    <div className="bg-background-card border border-white/10 rounded-3xl p-6 shadow-sm text-left hover:border-white/20 transition-standard">
                      <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Status Tracker</h3>
                      
                      <div className="space-y-6 relative">
                        {/* Vertical line connection */}
                        <div className="absolute left-[11px] top-1.5 bottom-1.5 w-0.5 bg-white/5"></div>

                        {/* Step 1: Active check */}
                        <div className="flex gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-black text-[14px] font-black">check</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">Submitted</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Oct 24, 2023 • 10:45 AM</p>
                          </div>
                        </div>

                        {/* Step 2: Under Review */}
                        <div className="flex gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center"></div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">Under Review</p>
                            <p className="text-[10px] text-text-muted mt-0.5">In progress with risk team</p>
                            <span className="inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold uppercase rounded mt-1.5">
                              Amber Phase
                            </span>
                          </div>
                        </div>

                        {/* Step 3: Verification (Pending) */}
                        <div className="flex gap-4 relative z-10 opacity-55">
                          <div className="w-6 h-6 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center"></div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">Verification</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Pending review completion</p>
                          </div>
                        </div>

                        {/* Step 4: Disbursement (Pending) */}
                        <div className="flex gap-4 relative z-10 opacity-55">
                          <div className="w-6 h-6 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center"></div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">Disbursement</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Final treasury approval</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Support Card */}
                    <div 
                      onClick={onOpenSupport}
                      className="bg-white/2 border border-white/5 p-6 rounded-3xl flex flex-col gap-2 hover:bg-white/5 transition-standard active:scale-[0.99] cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-2xl text-accent-gold">help_outline</span>
                      <h4 className="text-sm font-bold text-text-primary">Need assistance?</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed font-light">
                        Our institutional account managers are available 24/7 to guide you through the vetting process.
                      </p>
                      <button className="text-accent-gold text-xs font-bold underline text-left hover:no-underline cursor-pointer">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: ACTIVITY / PORTFOLIO & POSITIONS (Screenshot 9) */}
          {activeTab === 'activity' && (
            <motion.div 
              key="activity-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {/* Portfolio Values Header */}
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">TOTAL PORTFOLIO VALUE</p>
                <h2 className="text-4xl md:text-5xl font-display italic font-bold text-text-primary mt-1.5 tabular-nums">{formatNaira(totalBalance)}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-accent-gold bg-accent-gold/10 border border-accent-gold/20 px-3 py-1 rounded-full text-xs font-light">
                    <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                    +₦660,400 ROI
                  </span>
                  <span className="text-xs text-text-muted font-light">Across {positions.length} active positions</span>
                </div>
              </div>

              {/* Bento Grid - Allocations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-sm">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">LIQUIDITY RESERVE</p>
                  <p className="text-2xl font-display italic font-bold text-text-primary mt-2">₦120M</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed font-light">Available for immediate withdrawals</p>
                </div>
                <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-sm md:col-span-2">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">ALLOCATION BY SECTOR</p>
                  
                  {/* Segmented bar representation matching active positions */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex mt-4">
                    <div className="h-full bg-accent-gold w-[23.8%]"></div>
                    <div className="h-full bg-white/20 w-[76.2%]"></div>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-gold"></span>
                      <span className="text-xs font-light text-text-primary">Agriculture (24%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                      <span className="text-xs font-light text-text-primary">Logistics (76%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Positions expand list */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-[0.2em]">Your Positions</h3>
                
                <div className="space-y-3">
                  {positions.map((pos) => {
                    const isExpanded = expandedPositionId === pos.id;
                    return (
                      <div 
                        key={pos.id}
                        className={`bg-background-card border rounded-3xl p-5 shadow-sm transition-all duration-300 ${
                          isExpanded ? 'border-accent-gold ring-1 ring-accent-gold/40' : 'border-white/10'
                        }`}
                      >
                        <div 
                          onClick={() => setExpandedPositionId(isExpanded ? null : pos.id)}
                          className="flex justify-between items-start cursor-pointer"
                        >
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 text-accent-gold flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-2xl">
                                {pos.sector === 'Agriculture' ? 'agriculture' : 'local_shipping'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-text-primary">{pos.sector}</h4>
                              <p className="text-xs text-text-muted mt-0.5 font-light">{pos.cycle}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-bold text-text-primary tabular-nums">{pos.amount}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mt-1.5 ${
                              pos.status === 'Active' 
                              ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {pos.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">TOTAL ROI</p>
                            <p className="text-sm font-bold text-accent-gold tabular-nums mt-0.5">{pos.roi}</p>
                          </div>
                          <button 
                            onClick={() => setExpandedPositionId(isExpanded ? null : pos.id)}
                            className="text-text-muted p-1 rounded-full hover:bg-white/5 hover:text-white flex items-center transition-transform cursor-pointer"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          >
                            <span className="material-symbols-outlined text-base">expand_more</span>
                          </button>
                        </div>

                        {/* Collapsible Detail view (Screenshot 9 Position expanded area) */}
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-5 pt-5 border-t border-white/5 space-y-4 text-left"
                          >
                            <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex gap-3 text-xs text-text-muted leading-relaxed font-light">
                              <span className="material-symbols-outlined text-accent-gold shrink-0 text-base">info</span>
                              <p>
                                <strong>Explainer:</strong> Withdrawal requests are fulfilled immediately from reserve (₦120M available) or at cycle close. Funds will clear back to your Unallocated Balance.
                              </p>
                            </div>
                            
                            {pos.status === 'Active' ? (
                              <button 
                                onClick={() => {
                                  alert('Simulated: Withdrawal request submitted successfully!');
                                  pos.status = 'Withdrawal Requested';
                                  setExpandedPositionId(null);
                                }}
                                className="w-full py-3 bg-accent-gold hover:opacity-90 text-black font-bold text-xs uppercase tracking-[0.15em] rounded-full transition-standard shadow active:scale-98 cursor-pointer"
                              >
                                Request Withdrawal
                              </button>
                            ) : (
                              <button 
                                disabled
                                className="w-full py-3 bg-white/5 text-text-muted border border-white/10 font-bold text-xs uppercase tracking-[0.15em] rounded-full cursor-not-allowed text-center"
                              >
                                Request Pending
                              </button>
                            )}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent transaction receipts triggers details view */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-[0.2em]">Completed profit distributions</h3>
                <div className="divide-y divide-white/5">
                  {transactions.map((txn) => (
                    <div 
                      key={txn.id}
                      onClick={() => onSelectTransaction(txn)}
                      className="py-3.5 flex justify-between items-center hover:bg-white/2 px-3 -mx-3 rounded-2xl transition-standard cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 text-accent-gold flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {txn.poolName.includes('Agri') ? 'agriculture' : 'local_shipping'}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-text-primary">{txn.type}</p>
                          <p className="text-xs text-text-muted mt-0.5 font-light">{txn.date} · {txn.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent-gold tabular-nums">{txn.amount}</p>
                        <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mt-0.5">{txn.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left max-w-md mx-auto"
            >
              {/* User Avatar details card */}
              <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-4 shadow-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    src={userAvatar} 
                    alt="User Profile" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Bass Cee</h2>
                <p className="text-[9px] text-black mt-1 uppercase tracking-widest font-bold bg-accent-gold px-3 py-1 rounded-full">Tier 2 Verified</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-white/5 text-left">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Joined Since</span>
                    <span className="text-sm font-semibold text-text-primary mt-0.5 block">October 2023</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">ID Documents</span>
                    <span className="text-sm font-semibold text-text-primary mt-0.5 block">BVN & NIN Matched</span>
                  </div>
                </div>
              </div>

              {/* Profile options */}
              <div className="bg-background-card border border-white/10 rounded-3xl shadow-sm overflow-hidden">
                <button 
                  onClick={onOpenSupport}
                  className="w-full p-4 border-b border-white/5 hover:bg-white/2 flex items-center justify-between text-sm font-semibold text-text-primary transition-standard text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-gold text-xl">support_agent</span>
                    <span>Submit Help Support Report</span>
                  </div>
                  <span className="material-symbols-outlined text-text-muted">chevron_right</span>
                </button>

                <button 
                  onClick={() => alert('Opening Account Security settings...')}
                  className="w-full p-4 border-b border-white/5 hover:bg-white/2 flex items-center justify-between text-sm font-semibold text-text-primary transition-standard text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-gold text-xl">shield_person</span>
                    <span>Account Security Settings</span>
                  </div>
                  <span className="material-symbols-outlined text-text-muted">chevron_right</span>
                </button>

                <button 
                  onClick={() => alert('Sila Terms, licenses, and privacy agreements.')}
                  className="w-full p-4 hover:bg-white/2 flex items-center justify-between text-sm font-semibold text-text-primary transition-standard text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-gold text-xl">gavel</span>
                    <span>Legal Agreements & Disclosures</span>
                  </div>
                  <span className="material-symbols-outlined text-text-muted">chevron_right</span>
                </button>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-transparent hover:bg-status-error/10 text-status-error border border-status-error/20 font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-standard active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign Out of Account
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Sticky Tab Navigation Bar (Screenshot 3 & Screenshot 9 & Screenshot 12 bottom bar) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-6 bg-background-card/90 backdrop-blur-md border-t border-white/10 z-40 rounded-t-3xl shadow-none">
        
        {/* Home Tab */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-standard active:scale-90 cursor-pointer ${
            activeTab === 'home' 
            ? 'bg-white/5 text-accent-gold font-bold' 
            : 'text-text-muted hover:text-accent-gold'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Home</span>
        </button>

        {/* Pools Tab */}
        <button 
          onClick={() => setActiveTab('pools')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-standard active:scale-90 cursor-pointer ${
            activeTab === 'pools' 
            ? 'bg-white/5 text-accent-gold font-bold' 
            : 'text-text-muted hover:text-accent-gold'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'pools' ? "'FILL' 1" : "'FILL' 0" }}>waves</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Pools</span>
        </button>

        {/* Wallet Tab */}
        <button 
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-standard active:scale-90 cursor-pointer ${
            activeTab === 'wallet' 
            ? 'bg-white/5 text-accent-gold font-bold' 
            : 'text-text-muted hover:text-accent-gold'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'wallet' ? "'FILL' 1" : "'FILL' 0" }}>account_balance_wallet</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Wallet</span>
        </button>

        {/* Activity Tab */}
        <button 
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-standard active:scale-90 cursor-pointer ${
            activeTab === 'activity' 
            ? 'bg-white/5 text-accent-gold font-bold' 
            : 'text-text-muted hover:text-accent-gold'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'activity' ? "'FILL' 1" : "'FILL' 0" }}>history</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Activity</span>
        </button>

        {/* Profile Tab */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-standard active:scale-90 cursor-pointer ${
            activeTab === 'profile' 
            ? 'bg-white/5 text-accent-gold font-bold' 
            : 'text-text-muted hover:text-accent-gold'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-1">Profile</span>
        </button>

      </nav>

    </div>
  );
}
