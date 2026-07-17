/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pool } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPool?: Pool;
  onDepositSuccess: (amount: number, poolId: string) => void;
}

export default function DepositModal({ isOpen, onClose, selectedPool, onDepositSuccess }: DepositModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amountStr, setAmountStr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('bank');
  const [isSubmitting, setIsUploading] = useState(false);
  const [txnId, setTxnId] = useState('');

  const poolName = selectedPool?.name || 'Agriculture';
  const displayAmount = parseFloat(amountStr || '0');

  const handleContinue = () => {
    if (!amountStr || isNaN(displayAmount) || displayAmount <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Generate random transaction ID
      const randomId = `SIL-DEP-${Math.floor(10000 + Math.random() * 90000)}-${poolName.substring(0, 4).toUpperCase()}-0X${Math.floor(Math.random() * 9)}`;
      setTxnId(randomId);
      setStep(3);
      onDepositSuccess(displayAmount, selectedPool?.id || 'agri');
    }, 1200);
  };

  const formatCurrency = (val: number) => {
    return '₦' + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop backdrop-blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px]"
      />

      {/* Modal Dialog Sheet */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-background-card w-full md:max-w-md rounded-t-3xl md:rounded-3xl border border-white/10 shadow-none flex flex-col overflow-hidden max-h-[90vh] md:max-h-[85vh] z-10"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-background-card">
          <h3 className="text-xl font-display italic font-bold text-accent-gold">
            {step === 1 && 'Deposit Funds'}
            {step === 2 && 'Review Deposit'}
            {step === 3 && 'Success'}
          </h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-white/5 active:scale-95 transition-standard cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Container Content */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          
          {/* STEP 1: INPUT DETAILS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <p className="text-text-muted text-xs mb-2 font-light">How much would you like to deposit?</p>
                <div className="relative inline-block w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-display italic font-bold text-accent-gold">₦</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full bg-transparent border-none text-center text-4xl font-display italic font-bold text-accent-gold focus:ring-0 outline-none select-all placeholder:text-accent-gold/20"
                    autoFocus
                  />
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-3xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-accent-gold shrink-0 mt-0.5">info</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-accent-gold">You'll be part of Cycle 4</p>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed font-light">
                    Funding window closes in 42 days. Returns accrue from start of cycle. Funds can be sourced from bank or mobile money accounts.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 text-left">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-3xl transition-standard cursor-pointer ${
                      paymentMethod === 'bank' 
                      ? 'border-accent-gold bg-accent-gold/5 text-accent-gold shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                      : 'border-white/10 hover:border-accent-gold/40 text-text-muted'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-accent-gold">account_balance</span>
                    <span className="text-xs font-semibold">Bank Transfer</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-3xl transition-standard cursor-pointer ${
                      paymentMethod === 'mobile' 
                      ? 'border-accent-gold bg-accent-gold/5 text-accent-gold shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                      : 'border-white/10 hover:border-accent-gold/40 text-text-muted'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-accent-gold">smartphone</span>
                    <span className="text-xs font-semibold">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleContinue}
                className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full font-bold shadow-md transition-standard active:scale-98 cursor-pointer mt-4 text-[10px] uppercase tracking-[0.15em]"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW DEPOSIT */}
          {step === 2 && (
            <div className="space-y-6 text-left">
              <div className="bg-white/2 border border-white/5 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-light">Amount</span>
                  <span className="font-bold text-text-primary text-base tabular-nums">{formatCurrency(displayAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-light">Destination Pool</span>
                  <div className="flex items-center gap-2 font-bold text-text-primary">
                    <span className="material-symbols-outlined text-accent-gold text-base">agriculture</span>
                    <span>{poolName}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-light">Payment Method</span>
                  <div className="flex items-center gap-2 font-bold text-text-primary">
                    <span className="material-symbols-outlined text-accent-gold text-base">
                      {paymentMethod === 'bank' ? 'account_balance' : 'smartphone'}
                    </span>
                    <span>{paymentMethod === 'bank' ? 'Bank Transfer' : 'Mobile Money'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-light">Investment Cycle</span>
                  <span className="font-bold text-text-primary">Cycle 4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted text-sm font-light">Expected Payout</span>
                  <span className="font-bold text-text-primary">October 2026</span>
                </div>
              </div>

              {/* Disclosure Warning */}
              <div className="bg-white/2 border border-white/5 rounded-3xl p-4 flex gap-3">
                <span className="material-symbols-outlined text-accent-gold shrink-0">warning</span>
                <p className="text-xs text-text-muted leading-relaxed font-light">
                  <strong className="text-accent-gold font-bold">Disclosure:</strong> Withdrawals are reserve-based and may queue if fully deployed. Ensure this matches your liquidity profile.
                </p>
              </div>

              {/* Confirm / Back Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isSubmitting}
                  onClick={handleConfirm}
                  className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full font-bold shadow-md transition-standard active:scale-98 cursor-pointer flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.15em]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Deposit</span>
                  )}
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="w-full text-accent-gold hover:opacity-80 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-standard cursor-pointer"
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center space-y-8 py-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-accent-gold/15 rounded-full animate-ping"></div>
                <div className="relative w-full h-full bg-accent-gold text-black rounded-full flex items-center justify-center shadow-md transition-standard">
                  <span className="material-symbols-outlined text-5xl">check</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display italic font-bold text-accent-gold">Deposit Successful</h2>
                <p className="text-sm text-text-muted max-w-[280px] mx-auto leading-relaxed font-light">
                  Your funds have been allocated to the {poolName} Pool (Cycle 4).
                </p>
              </div>

              {/* Txn ID Card */}
              <div className="bg-white/2 border border-white/5 rounded-3xl p-4 flex flex-col gap-1 transition-standard hover:border-accent-gold/20">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">TRANSACTION ID</p>
                <p className="text-sm font-display font-bold text-accent-gold break-all">{txnId}</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full font-bold shadow-md transition-standard active:scale-98 cursor-pointer text-[10px] uppercase tracking-[0.15em]"
              >
                View my position
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
