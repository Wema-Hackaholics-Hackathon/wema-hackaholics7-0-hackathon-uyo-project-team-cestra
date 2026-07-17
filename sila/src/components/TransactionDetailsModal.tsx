/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Transaction } from '../types';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onReportIssue: () => void;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  onReportIssue
}: TransactionDetailsModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadReceipt = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Receipt downloaded successfully!\nFile: Sila-Receipt-${transaction.id}.pdf`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px]"
      />

      {/* Slide-up dialog */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-background-card w-full md:max-w-md rounded-t-3xl md:rounded-3xl border border-white/10 shadow-none flex flex-col overflow-hidden max-h-[90vh] z-10"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-background-card">
          <h3 className="text-xl font-display italic font-bold text-accent-gold">Transaction Details</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-white/5 active:scale-95 transition-standard cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-6 text-left">
          
          {/* Main summary header */}
          <div className="flex flex-col items-center text-center space-y-3 pb-4">
            <div className="w-14 h-14 rounded-full bg-white/5 text-accent-gold flex items-center justify-center shadow-none">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {transaction.poolName.includes('Agri') ? 'agriculture' : 'local_shipping'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-display italic font-bold text-accent-gold tabular-nums">{transaction.amount}</h2>
              <span className="inline-flex items-center gap-1 bg-accent-gold/10 text-accent-gold px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1.5 border border-accent-gold/20 shadow-none">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="bg-white/2 border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-y-4 text-xs">
              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Transaction Type</p>
                <p className="font-bold text-text-primary mt-1">{transaction.type}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Source</p>
                <p className="font-bold text-text-primary mt-1">{transaction.source}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Completed Date & Time</p>
                <p className="font-bold text-text-primary mt-1">{transaction.date} · {transaction.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Reference Number</p>
                <p className="font-mono font-bold text-text-primary mt-1 text-xs select-all">{transaction.reference}</p>
              </div>
            </div>
          </div>

          {/* Live Progress Stepper checklist (Screenshot 4) */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Processing Progress</h4>
            
            <div className="space-y-4 relative pl-8">
              {/* Vertical timeline connector */}
              <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-white/10"></div>

              {/* Progress 1: Initiated */}
              <div className="flex flex-col relative z-10">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-accent-gold text-black flex items-center justify-center shadow-none">
                  <span className="material-symbols-outlined text-[12px] font-black">check</span>
                </div>
                <p className="text-xs font-bold text-text-primary">Initiated</p>
                <p className="text-[10px] text-text-muted mt-0.5 font-light">{transaction.progress.initiatedTime}</p>
              </div>

              {/* Progress 2: Processed */}
              <div className="flex flex-col relative z-10">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-accent-gold text-black flex items-center justify-center shadow-none">
                  <span className="material-symbols-outlined text-[12px] font-black">check</span>
                </div>
                <p className="text-xs font-bold text-text-primary">Processed</p>
                <p className="text-[10px] text-text-muted mt-0.5 font-light">{transaction.progress.processedTime}</p>
              </div>

              {/* Progress 3: Completed */}
              <div className="flex flex-col relative z-10">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-accent-gold text-black flex items-center justify-center shadow-none">
                  <span className="material-symbols-outlined text-[12px] font-black">check</span>
                </div>
                <p className="text-xs font-bold text-text-primary">Completed</p>
                <p className="text-[10px] text-text-muted mt-0.5 font-light">{transaction.progress.completedTime}</p>
              </div>
            </div>
          </div>

          {/* Bottom Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button 
              disabled={downloading}
              onClick={handleDownloadReceipt}
              className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full font-bold shadow-md transition-standard active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-[10px] uppercase tracking-[0.15em]"
            >
              {downloading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  <span>Download Receipt</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                onClose();
                onReportIssue();
              }}
              className="w-full text-accent-gold hover:opacity-85 py-2.5 rounded-full font-bold transition-standard active:scale-95 cursor-pointer text-center text-[10px] uppercase tracking-[0.1em]"
            >
              Report an Issue
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
