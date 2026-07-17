/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';

interface SupportIssuesProps {
  onBackToHome: () => void;
  transactions: Transaction[];
  userAvatar: string;
}

export default function SupportIssues({ onBackToHome, transactions, userAvatar }: SupportIssuesProps) {
  const [stage, setStage] = useState<'category' | 'form' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Form details
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(transactions[0] || null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [showTxnDropdown, setShowTxnDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ticketId] = useState(() => `SIL-${Math.floor(1000 + Math.random() * 9000)}-X`);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setAttachedFileName(file.name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription) {
      alert('Please include a brief description of the issue.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStage('success');
    }, 1500);
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(`#${ticketId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-made categories mirroring Screenshot 1
  const CATEGORIES = [
    {
      id: 'transaction',
      title: 'Transaction Issue',
      desc: 'Missing funds, transactions pending too long, or unrecognized activity.',
      icon: 'payments'
    },
    {
      id: 'bug',
      title: 'App Bug',
      desc: 'Screen not loading properly, broken buttons, or unexpected crashes.',
      icon: 'bug_report'
    },
    {
      id: 'security',
      title: 'Account & Security',
      desc: 'Login difficulties, suspicious activity, or profile verification issues.',
      icon: 'security'
    },
    {
      id: 'pool',
      title: 'Pool Performance',
      desc: 'Questions regarding ROI calculations, sector cycle dates, or liquidity.',
      icon: 'insights'
    },
    {
      id: 'other',
      title: 'Other',
      desc: 'Anything else that doesn\'t fit the categories above.',
      icon: 'help_outline'
    }
  ];

  return (
    <div className="w-full bg-background-page min-h-screen pb-32">
      
      {/* 1. CATEGORY SELECTION STAGE (Screenshot 1) */}
      {stage === 'category' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Top App Bar */}
          <header className="w-full sticky top-0 z-40 bg-background-card border-b border-white/10 shadow-none flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBackToHome}
                className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-standard active:scale-95 cursor-pointer text-text-primary flex items-center"
              >
                <span className="material-symbols-outlined text-accent-gold">arrow_back</span>
              </button>
              <h1 className="text-xl font-display italic font-bold text-accent-gold">Report an Issue</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden border border-white/10 cursor-pointer hover:scale-105 transition-standard">
                <img 
                  className="w-full h-full object-cover" 
                  src={userAvatar} 
                  alt="User Avatar" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </header>

          {/* Main Area */}
          <main className="max-w-4xl mx-auto px-6 pt-6">
            
            {/* Intro Section */}
            <section className="mb-8 text-left">
              <h2 className="text-3xl md:text-4xl font-display italic text-text-primary mb-2 tracking-tight">What can we help you with?</h2>
              <p className="text-sm text-text-muted font-light leading-relaxed">
                Select a category to start your report. Our team will review your submission and get back to you within 24 hours.
              </p>
            </section>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const isOther = cat.id === 'other';
                return (
                  <div 
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-6 bg-background-card border rounded-3xl cursor-pointer transition-standard hover:border-white/20 active:scale-98 text-left ${
                      isSelected 
                      ? 'border-accent-gold bg-accent-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.05)]' 
                      : 'border-white/10'
                    } ${isOther ? 'md:col-span-2' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-standard ${
                        isSelected 
                        ? 'bg-accent-gold text-black' 
                        : 'bg-white/5 text-accent-gold'
                      }`}>
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h3 className={`text-base font-bold transition-standard ${
                            isSelected ? 'text-accent-gold' : 'text-text-primary'
                          }`}>
                            {cat.title}
                          </h3>
                          {isOther && (
                            <span className="material-symbols-outlined text-text-muted opacity-40 group-hover:opacity-100 transition-standard">
                              chevron_right
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed font-light">{cat.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help Illustration Banner */}
            <section className="mt-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 bg-white/2 rounded-3xl p-6 overflow-hidden relative border border-white/5 text-left">
              <div className="relative z-10">
                <h4 className="text-base font-bold text-text-primary mb-1">Need immediate help?</h4>
                <p className="text-xs text-text-muted mb-4 max-w-sm font-light">
                  Check our knowledge base for instant answers to frequently asked questions.
                </p>
                <button 
                  type="button" 
                  onClick={() => alert('Opening Help Center in a new tab...')}
                  className="px-5 py-2.5 bg-accent-gold hover:opacity-90 text-black font-bold text-[10px] uppercase tracking-[0.15em] rounded-full transition-standard active:scale-95 shadow-md cursor-pointer"
                >
                  Visit Help Center
                </button>
              </div>
              <div className="hidden md:flex justify-end pr-4 pointer-events-none opacity-40">
                <span className="material-symbols-outlined text-7xl text-accent-gold" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              </div>
            </section>
          </main>

          {/* Bottom Sticky Action Bar */}
          <div className="fixed bottom-0 left-0 w-full bg-background-card/90 backdrop-blur-md border-t border-white/10 p-4 z-40 flex justify-center rounded-t-3xl shadow-none">
            <div className="w-full max-w-lg">
              <button 
                disabled={!selectedCategory}
                onClick={() => setStage('form')}
                className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full transition-standard ${
                  selectedCategory 
                  ? 'bg-accent-gold hover:opacity-90 text-black cursor-pointer active:scale-95 shadow-md' 
                  : 'bg-white/5 text-text-muted/40 border border-white/10 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. ISSUE FORM SUBMISSION STAGE (Screenshot 11) */}
      {stage === 'form' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Top App Bar */}
          <header className="w-full sticky top-0 z-40 bg-background-card border-b border-white/10 shadow-none flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStage('category')}
                className="transition-standard hover:bg-white/5 p-2 rounded-full active:scale-95 text-text-primary flex items-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-accent-gold">arrow_back</span>
              </button>
              <h1 className="text-xl font-display italic font-bold text-accent-gold">Report Issue</h1>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-standard">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </header>

          {/* Form container */}
          <main className="max-w-xl mx-auto px-6 pb-32">
            {/* Progress Bar */}
            <div className="mt-6 mb-8 text-left">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">STEP 2 OF 3</span>
                <span className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.2em]">66% COMPLETE</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-gold rounded-full transition-all duration-500 w-2/3"></div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Selected Transaction block */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-bold text-text-primary block tracking-[0.2em] uppercase">Selected Transaction</label>
                <div className="relative">
                  <div 
                    onClick={() => setShowTxnDropdown(!showTxnDropdown)}
                    className="bg-background-card border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:bg-white/2 active:scale-99 transition-standard cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 text-accent-gold flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {selectedTransaction?.poolName.includes('Agri') ? 'agriculture' : 'local_shipping'}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-text-primary">
                          {selectedTransaction?.type === 'PROFIT DISTRIBUTION' ? 'Deposit to ' : 'Transaction with '}
                          {selectedTransaction?.poolName || 'Agriculture Pool'}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5 font-light">
                          {selectedTransaction?.amount || '₦250,000.00'} • {selectedTransaction?.date || 'Oct 24, 2023'}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="text-accent-gold font-bold text-[9px] uppercase tracking-wider hover:bg-white/5 px-3 py-1.5 rounded-lg transition-standard"
                    >
                      CHANGE
                    </button>
                  </div>

                  {/* Transaction Switcher Dropdown */}
                  {showTxnDropdown && (
                    <div className="absolute top-full left-0 w-full bg-background-card border border-white/10 mt-2 rounded-2xl shadow-2xl z-20 overflow-hidden max-h-48 overflow-y-auto no-scrollbar">
                      {transactions.map((t) => (
                        <div 
                          key={t.id}
                          onClick={() => {
                            setSelectedTransaction(t);
                            setShowTxnDropdown(false);
                          }}
                          className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex justify-between items-center text-xs"
                        >
                          <div>
                            <p className="font-bold text-text-primary">{t.type} - {t.poolName}</p>
                            <p className="text-text-muted mt-0.5">{t.date} · {t.id}</p>
                          </div>
                          <span className="font-bold text-accent-gold">{t.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Problem Description TextArea */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-bold text-text-primary block tracking-[0.2em] uppercase" htmlFor="desc-box">Problem Description</label>
                <textarea 
                  id="desc-box"
                  required
                  rows={6}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe what happened in detail..."
                  className="w-full bg-background-card border border-white/10 rounded-2xl p-4 focus:ring-0 focus:border-accent-gold text-sm text-text-primary placeholder:text-text-muted/30 transition-standard outline-none"
                />
                <p className="text-xs text-text-muted italic font-light">Please include any error codes or unusual behavior you observed.</p>
              </div>

              {/* Attachment file area */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-bold text-text-primary block tracking-[0.2em] uppercase">Attachment (Optional)</label>
                <div 
                  onClick={() => document.getElementById('issue-file-upload')?.click()}
                  className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-background-card hover:border-accent-gold/40 hover:bg-white/2 transition-standard cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-4xl mb-2 ${attachedFile ? 'text-accent-gold' : 'text-text-muted'}`}>
                    {attachedFile ? 'check_circle' : 'cloud_upload'}
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {attachedFileName ? attachedFileName : 'Upload screenshot'}
                  </p>
                  <p className="text-xs text-text-muted mt-1 font-light">PNG, JPG up to 10MB</p>
                  <input 
                    id="issue-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Security Protocols Notice */}
              <div className="flex items-start gap-3 p-4 bg-white/2 border border-white/5 rounded-3xl hover:bg-white/5 transition-standard">
                <span className="material-symbols-outlined text-accent-gold" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                <p className="text-xs text-text-muted leading-relaxed text-left font-light">
                  Sila security protocols ensure your financial data remains encrypted. Support agents will never ask for your password or private keys.
                </p>
              </div>

              {/* Bottom Sticky Action Trigger */}
              <div className="fixed bottom-0 left-0 w-full bg-background-card/90 backdrop-blur-md border-t border-white/10 p-4 z-40 flex justify-center rounded-t-3xl shadow-none">
                <div className="w-full max-w-[640px]">
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full shadow-md transition-standard active:scale-95 flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-[0.15em] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                        <span>Submitting Report...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Report</span>
                        <span className="material-symbols-outlined text-base">send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </motion.div>
      )}

      {/* 3. REPORT SUBMITTED SUCCESS (Screenshot 13) */}
      {stage === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center"
        >
          {/* Header */}
          <header className="w-full top-0 sticky z-40 bg-background-card border-b border-white/10 shadow-none flex justify-between items-center px-6 py-4">
            <span className="text-xl font-display italic font-bold text-accent-gold">Sila</span>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3pcAiXMVIjSrKnLpfuRf7XEbOiAM_paRy7JaTGkSFek0vMy-c4o0BgIshYRCj9ikI42qeIQZLs3_p2fAHBoBZq7MjoAie264V53ErfuUJOxhy7372Cwn_obncPKV6N_UykB-UOuqT8LGI5ynBFgD94uLcjbNKh9M2tmMEwyS3ipLGqZz2dA_jvdI78v0olCXtTL1p6goDp3YNANxP6AbS8QGBBdZ7bMOJGe1IBBvMlrYmHP-BLrID" 
                alt="Fintech Manager Portrait" 
                referrerPolicy="no-referrer"
              />
            </div>
          </header>

          {/* Main Success Area */}
          <main className="max-w-xl w-full px-6 py-10 flex flex-col items-center">
            <div className="bg-background-card rounded-3xl border border-white/10 p-8 md:p-12 text-center flex flex-col items-center w-full shadow-none hover:border-white/20 transition-standard">
              
              {/* Gold Success Badge */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-accent-gold/10 rounded-full scale-150 animate-ping"></div>
                <div className="w-20 h-24 bg-white/5 rounded-full flex items-center justify-center text-accent-gold relative z-10">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-2xl md:text-3xl font-display italic text-accent-gold mb-3">
                Report Submitted
              </h1>

              {/* Body */}
              <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed font-light">
                Thank you for your feedback. Our support team will review your report and get back to you within 24 hours.
              </p>

              {/* Ticket ID Chip */}
              <div 
                onClick={copyTicketId}
                className="bg-white/2 border border-white/5 rounded-3xl px-6 py-3 mb-8 inline-flex flex-col items-center gap-1 cursor-pointer hover:bg-white/5 transition-standard active:scale-95"
              >
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                  {copied ? 'Copied to Clipboard!' : 'Ticket ID'}
                </span>
                <span className="text-xl font-display font-bold text-accent-gold tracking-tight">#{ticketId}</span>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => alert(`Reviewing status for Ticket ID #${ticketId}...`)}
                  className="w-full bg-accent-gold hover:opacity-90 text-black font-bold py-4 rounded-full shadow-md transition-standard active:scale-95 cursor-pointer text-[10px] uppercase tracking-[0.15em]"
                >
                  View Ticket Status
                </button>
                <button 
                  onClick={onBackToHome}
                  className="w-full bg-transparent text-accent-gold hover:opacity-80 py-3 rounded-full font-bold transition-standard active:scale-95 cursor-pointer text-[10px] uppercase tracking-[0.15em]"
                >
                  Back to Home
                </button>
              </div>
            </div>

            {/* Support Bento Grid Support items */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
              <div className="bg-background-card p-5 rounded-3xl border border-white/10 flex items-start gap-4 shadow-none hover:bg-white/2 transition-standard cursor-pointer">
                <span className="material-symbols-outlined text-accent-gold mt-0.5">mail</span>
                <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Email Confirmation</p>
                  <p className="text-xs text-text-muted leading-relaxed font-light">We've sent a detailed summary to your registered email address.</p>
                </div>
              </div>

              <div className="bg-background-card p-5 rounded-3xl border border-white/10 flex items-start gap-4 shadow-none hover:bg-white/2 transition-standard cursor-pointer">
                <span className="material-symbols-outlined text-accent-gold mt-0.5">schedule</span>
                <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Response Time</p>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    Average response time for financial issues: <span className="font-bold text-accent-gold">4 hours</span>.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer branding copyright */}
          <footer className="py-6 text-center opacity-40">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Sila Institutional Infrastructure © 2024</p>
          </footer>
        </motion.div>
      )}

    </div>
  );
}
