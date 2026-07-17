/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';

interface OnboardingFlowProps {
  onComplete: () => void;
  initialStage?: 'signup' | 'verify-identity' | 'upload-photo' | 'face-verification';
}

export default function OnboardingFlow({ onComplete, initialStage = 'signup' }: OnboardingFlowProps) {
  const [stage, setStage] = useState<'signup' | 'verify-identity' | 'upload-photo' | 'face-verification'>(initialStage);
  
  // Signup State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Verification States
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [consent, setConsent] = useState(false);
  
  // Photo State
  const [photoSelected, setPhotoSelected] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Live scan simulation State
  const [scanProgress, setScanProgress] = useState(0);
  const [scanInstructions, setInstructionText] = useState('Blink to confirm you are a real person.');
  const [scanFinished, setScanFinished] = useState(false);
  const [faceMeshPoints, setFaceMeshPoints] = useState<{ x: number; y: number }[]>([]);

  // Generate simulated face mesh points on load for the face scan step
  useEffect(() => {
    if (stage === 'face-verification') {
      const points = Array.from({ length: 18 }, () => ({
        x: 35 + Math.random() * 30,
        y: 35 + Math.random() * 40,
      }));
      setFaceMeshPoints(points);

      // Jitter points over time
      const interval = setInterval(() => {
        setFaceMeshPoints(prev =>
          prev.map(pt => ({
            x: pt.x + (Math.random() * 2 - 1),
            y: pt.y + (Math.random() * 2 - 1),
          }))
        );
      }, 600);

      // Progress animation
      setScanProgress(0);
      setScanFinished(false);
      setInstructionText('Blink to confirm you are a real person.');

      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          const next = prev + Math.floor(Math.random() * 8) + 3;
          if (next >= 100) {
            clearInterval(progressInterval);
            setScanFinished(true);
            setInstructionText('Face Match Successful');
            return 100;
          }
          if (next > 35 && next < 70) {
            setInstructionText('Keep steady...');
          } else if (next >= 70 && next < 95) {
            setInstructionText('Verification in progress...');
          }
          return next;
        });
      }, 350);

      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    }
  }, [stage]);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email || !password || password !== confirmPassword) {
      alert('Please fill out all fields correctly. Passwords must match.');
      return;
    }
    setStage('verify-identity');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Please accept the data privacy consent to proceed.');
      return;
    }
    if (bvn.length < 11 && nin.length < 11) {
      alert('Please enter a valid 11-digit BVN or NIN.');
      return;
    }
    setStage('upload-photo');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoSelected(true);
      setPhotoPreviewUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDYNZtcmkd4wtuwhftR5BaxJ8jaLopZSJ-rGziRquVrLko0roCRo8BPCl70ycS-D2hAmduIPgPXLumZrLP27Qdlg67NFcPSg6Tn60qwHvs0wSNdtckVOlulcGIj3PTQefKXuB65G1A3SNN-D9Sgv-hfuVFDT1EtNkWh5cpQavT-7ZXRlDvP66Hz4vhWiisYa_mpTy6noXcR_BgZpLiagqusraYayYZadtAXllIXORXrNtuJMIq75Ggp');
      setShowPreviewModal(true);
    }
  };

  const confirmPhotoUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowPreviewModal(false);
      setStage('face-verification');
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 min-h-[90vh]">
      
      {/* 1. SIGNUP STAGE */}
      {stage === 'signup' && (
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-lg z-10"
        >
          {/* Logo and Brand Identity (Editorial style) */}
          <header className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-accent-gold rounded-full"></div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-text-primary">SILA</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display italic text-white tracking-tight leading-tight">The Art of Liquidity</h1>
            <p className="text-xs text-text-muted mt-3 max-w-xs leading-relaxed font-light italic">
              Secure, institutional-grade liquidity management and investment for the digital age.
            </p>
          </header>

          {/* Stepper Indicator */}
          <nav className="flex items-center justify-center mb-8 w-full px-4">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center text-black font-bold ring-4 ring-accent-gold/20">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-gold mt-2">Account</span>
              </div>
              <div className="w-16 h-px bg-white/10"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-background-card border border-white/10 flex items-center justify-center text-white/40 font-bold">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mt-2">Verify Email</span>
              </div>
            </div>
          </nav>

          {/* Signup Card */}
          <section className="bg-background-card border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Phone Number (Your Account Number)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/30">
                    <span className="material-symbols-outlined text-xl">phone</span>
                  </span>
                  <input 
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-standard hover:bg-[#1c1c1c]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/30">
                    <span className="material-symbols-outlined text-xl">alternate_email</span>
                  </span>
                  <input 
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#161616] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-standard hover:bg-[#1c1c1c]"
                  />
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/30">
                      <span className="material-symbols-outlined text-xl">lock</span>
                    </span>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-standard hover:bg-[#1c1c1c]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/30">
                      <span className="material-symbols-outlined text-xl">lock_clock</span>
                    </span>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-standard hover:bg-[#1c1c1c]"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Message */}
              <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl border border-white/5 transition-standard">
                <span className="material-symbols-outlined text-accent-gold">verified_user</span>
                <p className="text-xs text-text-muted leading-relaxed font-light">
                  Your data is encrypted with AES-256 and protected by secure, institutional-grade protocols.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-4">
                <button 
                  type="submit"
                  className="w-full bg-accent-gold hover:opacity-90 text-black font-bold py-4 rounded-full shadow-lg transition-standard active:scale-98 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-standard">arrow_forward</span>
                </button>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setStage('verify-identity')}
                    className="inline-block text-xs font-medium tracking-[0.1em] text-accent-gold uppercase hover:opacity-80 underline decoration-white/20 underline-offset-4 transition-standard cursor-pointer"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Footer Links */}
          <footer className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center pb-8">
            <a className="text-[9px] font-bold text-text-muted hover:text-white uppercase tracking-[0.2em]" href="#">Terms of Service</a>
            <a className="text-[9px] font-bold text-text-muted hover:text-white uppercase tracking-[0.2em]" href="#">Privacy Policy</a>
            <a className="text-[9px] font-bold text-text-muted hover:text-white uppercase tracking-[0.2em]" href="#">Help Center</a>
          </footer>
        </motion.main>
      )}

      {/* 2. IDENTITY VERIFICATION STAGE */}
      {stage === 'verify-identity' && (
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          {/* Top Back Nav */}
          <div className="w-full flex justify-start mb-6">
            <button 
              onClick={() => setStage('signup')}
              className="flex items-center text-text-primary font-semibold hover:text-accent-gold transition-standard cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">arrow_back</span>
              Back
            </button>
          </div>

          {/* Step Indicator */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">STEP 2 OF 3</span>
              <span className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.2em]">IDENTITY VERIFICATION</span>
            </div>
            <div className="w-full h-px bg-white/10">
              <div className="h-full bg-accent-gold w-2/3 transition-all duration-1000"></div>
            </div>
          </div>

          {/* Bento Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {/* Left Info Panel */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-2xl transition-standard">
                <div className="flex items-center gap-3 mb-4 text-accent-gold">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                  <h2 className="text-2xl font-display italic text-text-primary">Verify Your Identity</h2>
                </div>
                <p className="text-xs text-text-muted mb-6 leading-relaxed font-light">
                  Providing both your BVN and NIN will upgrade you to <span className="font-bold text-accent-gold">Tier 2</span> automatically. Use one for <span className="font-bold text-white">Tier 1</span> access.
                </p>

                {/* Tier Benefits */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-standard cursor-default">
                    <span className="material-symbols-outlined text-accent-gold">check_circle</span>
                    <div>
                      <p className="text-[10px] font-bold text-text-primary uppercase tracking-[0.1em]">Tier 1 Benefits</p>
                      <p className="text-xs text-text-muted mt-0.5 font-light">Daily limit: ₦50,000. Balance: ₦300,000.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-standard cursor-default">
                    <span className="material-symbols-outlined text-accent-gold font-bold">stars</span>
                    <div>
                      <p className="text-[10px] font-bold text-text-primary uppercase tracking-[0.1em]">Tier 2 Benefits</p>
                      <p className="text-xs text-text-muted mt-0.5 font-light">Daily limit: ₦200,000. Balance: Unlimited.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Assurance */}
              <div className="p-5 flex items-center gap-4 border border-white/5 rounded-3xl bg-white/2">
                <span className="material-symbols-outlined text-text-muted text-[36px]" style={{ fontVariationSettings: "'wght' 200" }}>shield_lock</span>
                <p className="text-xs text-text-muted leading-relaxed font-light italic">
                  Your data is encrypted with 256-bit SSL technology. We never share your sensitive financial information with third parties.
                </p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:col-span-7">
              <div className="bg-background-card border border-white/10 p-6 rounded-3xl shadow-2xl transition-standard">
                <form onSubmit={handleVerifySubmit} className="space-y-6">
                  {/* BVN */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-primary block uppercase tracking-[0.2em]" htmlFor="bvn">BANK VERIFICATION NUMBER (BVN)</label>
                    <div className="relative">
                      <input 
                        id="bvn"
                        type="text"
                        maxLength={11}
                        placeholder="Enter 11-digit BVN"
                        value={bvn}
                        onChange={(e) => setBvn(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-5 py-3.5 rounded-full bg-[#161616] border border-white/10 focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 outline-none transition-standard font-body-md text-sm text-text-primary placeholder:text-text-muted"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined text-text-muted cursor-help hover:text-accent-gold" title="Dial *565*0# on your registered phone number">help_outline</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted font-light">Enter BVN to access Tier 1 features.</p>
                  </div>

                  {/* NIN */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-primary block uppercase tracking-[0.2em]" htmlFor="nin">NATIONAL IDENTITY NUMBER (NIN)</label>
                    <input 
                      id="nin"
                      type="text"
                      maxLength={11}
                      placeholder="Enter 11-digit NIN"
                      value={nin}
                      onChange={(e) => setNin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-5 py-3.5 rounded-full bg-[#161616] border border-white/10 focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 outline-none transition-standard font-body-md text-sm text-text-primary placeholder:text-text-muted"
                    />
                    <p className="text-xs text-text-muted font-light">Provide both BVN & NIN for automatic Tier 2 upgrade.</p>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 cursor-pointer transition-standard">
                    <input 
                      id="consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded text-accent-gold focus:ring-accent-gold border-white/10 cursor-pointer"
                    />
                    <label className="text-xs text-text-primary cursor-pointer select-none leading-relaxed font-light" htmlFor="consent">
                      I authorize Sila to verify my identity details against the relevant databases. I understand that my data is handled securely according to the <a className="text-accent-gold underline hover:opacity-85" href="#">Privacy Policy</a>.
                    </label>
                  </div>

                  {/* Action Button */}
                  <button 
                    type="submit"
                    className="w-full bg-accent-gold hover:opacity-90 text-black font-bold py-4 rounded-full shadow-lg transition-standard active:scale-98 flex justify-center items-center gap-2 group cursor-pointer"
                  >
                    <span>Verify Identity</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-standard">arrow_forward</span>
                  </button>
                </form>
              </div>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-75 transition-standard">
                <div className="flex items-center gap-1.5 text-[9px] text-text-primary font-bold tracking-[0.1em]">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span>PCI DSS COMPLIANT</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-text-primary font-bold tracking-[0.1em]">
                  <span className="material-symbols-outlined text-[18px]">lock_person</span>
                  <span>NDPR CERTIFIED</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-text-primary font-bold tracking-[0.1em]">
                  <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                  <span>CBN LICENSED</span>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      )}

      {/* 3. UPLOAD PHOTO STAGE */}
      {stage === 'upload-photo' && (
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-2xl flex flex-col"
        >
          {/* Header */}
          <div className="w-full flex justify-between items-center h-16 border-b border-white/10 mb-6">
            <button 
              onClick={() => setStage('verify-identity')}
              className="flex items-center text-text-primary font-semibold hover:text-accent-gold transition-standard cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">arrow_back</span>
              Back
            </button>
            <button 
              onClick={() => setStage('signup')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-text-muted hover:text-white hover:rotate-90 transition-standard cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-gold text-black flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <div className="w-12 md:w-16 h-px bg-accent-gold"></div>
              <div className="w-8 h-8 rounded-full bg-accent-gold text-black flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <div className="w-12 md:w-16 h-px bg-accent-gold"></div>
              <div className="w-8 h-8 rounded-full bg-accent-gold text-black flex items-center justify-center font-bold text-sm">3</div>
              <div className="w-12 md:w-16 h-px bg-white/10"></div>
              <div className="w-8 h-8 rounded-full bg-background-card text-text-muted border border-white/10 flex items-center justify-center font-bold text-xs">4</div>
            </div>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] hidden md:block">STEP 3 OF 4</span>
          </div>

          {/* Heading Section */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-display italic text-text-primary mb-2 tracking-tight">Upload a clear photo for identity matching</h1>
            <p className="text-sm text-text-muted font-light leading-relaxed">This will be matched against your identity documents to ensure secure, institutional-grade account access.</p>
          </header>

          {/* Interaction Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Upload Dropzone */}
            <div className="md:col-span-2">
              <div 
                onClick={() => document.getElementById('file-upload-input')?.click()}
                className="border border-dashed border-white/10 bg-background-card p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/2 hover:border-accent-gold rounded-3xl transition-standard group min-h-[280px]"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-105 transition-standard text-accent-gold">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Tap to upload or take photo</h3>
                <p className="text-xs text-text-muted max-w-xs leading-relaxed font-light">
                  Supports JPEG or PNG formats. Ensure your face is fully lit, clearly visible, with no hats or glasses.
                </p>
                <input 
                  id="file-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Visual Guidelines Card 1 */}
            <div className="bg-background-card border border-white/10 rounded-2xl p-4 flex items-start gap-4 cursor-default">
              <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined text-2xl">light_mode</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-0.5">Optimal Lighting</h3>
                <p className="text-xs text-text-muted leading-relaxed font-light">Position yourself in a brightly lit environment with light sources facing you.</p>
              </div>
            </div>

            {/* Visual Guidelines Card 2 */}
            <div className="bg-background-card border border-white/10 rounded-2xl p-4 flex items-start gap-4 cursor-default">
              <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-accent-gold">
                <span className="material-symbols-outlined text-2xl">frame_person</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-0.5">Frame Centered</h3>
                <p className="text-xs text-text-muted leading-relaxed font-light">Look directly into the lens. Keep your face completely inside the frame.</p>
              </div>
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl mb-8 border border-white/5">
            <span className="material-symbols-outlined text-accent-gold">verified_user</span>
            <p className="text-xs text-accent-gold font-light leading-relaxed">
              Biometric verification is fully encrypted and used solely for one-time compliance matching.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-3">
            <button 
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="w-full bg-accent-gold hover:opacity-90 text-black py-4 rounded-full font-bold shadow-lg transition-standard active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Upload Photo</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-standard">arrow_forward</span>
            </button>
            <button 
              onClick={() => setStage('face-verification')}
              className="w-full bg-transparent text-text-muted py-3 rounded-full hover:bg-white/5 hover:text-white transition-standard cursor-pointer text-sm font-medium"
            >
              I don't have a camera
            </button>
          </div>

          {/* Photo Preview Modal */}
          {showPreviewModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background-card border border-white/10 rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <span className="text-base font-bold text-text-primary">Preview Biometric Photo</span>
                  <button 
                    onClick={() => setShowPreviewModal(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-text-muted hover:text-white"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="relative aspect-square w-full bg-black/40">
                  <img 
                    src={photoPreviewUrl} 
                    alt="Preview" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <button 
                    disabled={isUploading}
                    onClick={confirmPhotoUpload}
                    className="w-full bg-accent-gold text-black py-4 rounded-full font-bold active:scale-95 transition-standard hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Analyze Photo</span>
                    )}
                  </button>
                  <button 
                    disabled={isUploading}
                    onClick={() => setShowPreviewModal(false)}
                    className="w-full py-3 text-text-muted font-medium hover:bg-white/5 hover:text-white transition-standard rounded-full cursor-pointer text-sm"
                  >
                    Retake Photo
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.main>
      )}

      {/* 4. FACE VERIFICATION STAGE */}
      {stage === 'face-verification' && (
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-md flex flex-col items-center justify-center"
        >
          {/* Top Bar */}
          <div className="w-full flex justify-between items-center h-16 mb-4">
            <button 
              onClick={() => setStage('upload-photo')}
              className="flex items-center text-text-primary font-semibold hover:text-accent-gold transition-standard cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2">arrow_back</span>
              Back
            </button>
            <span className="text-[9px] font-bold text-text-muted px-3 py-1.5 bg-white/5 border border-white/5 rounded-full uppercase tracking-wider">Step 4 of 4</span>
          </div>

          {/* Instructional Header */}
          <div className="text-center mb-6 w-full">
            <h2 className="text-3xl font-display italic text-text-primary mb-1">Live Face Scan</h2>
            <p className="text-xs text-text-muted font-light">Position your head inside the scanner region to confirm identity.</p>
          </div>

          {/* Circular Camera Viewfinder Section */}
          <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
            {/* Viewfinder Circular frame */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-black">
              {/* Mock camera image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-65 grayscale"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUSI_oKRGtc1pIb_XZSvKgzLhg1eK_Y0oR-9lyEquhWaM_NOngiu3VaNWgBISCPcQZUQfUO59yDj7-y39bh-1UpIIUdpovlle8ZweoXMoqSeHn6PHerENrCIER0Q4VKxdhGHTRU4UtesquB5nfB7q3JsS_BrmcuYn1wtH9ckv03KPXD8i8zfRmLNQFjA2vaDcanMkC8ds_LK6aA8qBaZ0PwnThsyasy-esAbbxEnY_8USuwcBNkUvv')` }}
              ></div>

              {/* Laser Scanner Line (Editorial Gold) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <div className="scanner-line w-full h-0.5 bg-gradient-to-b from-accent-gold/20 to-accent-gold absolute top-0"></div>
              </div>

              {/* Simulated Face Mesh Points (Editorial gold-white sparkles) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {faceMeshPoints.map((pt, index) => (
                  <div 
                    key={index}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className="absolute w-1 h-1 bg-accent-gold rounded-full shadow-[0_0_4px_#D4AF37] transition-all duration-300"
                  ></div>
                ))}
              </div>

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]"></div>
            </div>

            {/* Circular Progress Border SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -m-1" viewBox="0 0 100 100">
              <circle className="text-white/5" cx="50" cy="50" fill="transparent" r="47.5" stroke="currentColor" strokeWidth="1" />
              <motion.circle 
                className="text-accent-gold" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="47.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                strokeDasharray="298"
                strokeDashoffset={298 - (scanProgress / 100) * 298}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>

            {/* Badge Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-accent-gold text-black text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-md">
              LIVE SCAN
            </div>
          </div>

          {/* Feedback Instructions Card */}
          <div className="w-full mt-6 bg-background-card border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined text-accent-gold text-2xl ${scanFinished ? '' : 'animate-pulse'}`}>
                  {scanFinished ? 'check_circle' : 'visibility'}
                </span>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-text-primary transition-standard">{scanInstructions}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-gold transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-accent-gold tabular-nums">{Math.round(scanProgress)}%</span>
                </div>
              </div>
            </div>

            {/* Safety Disclaimer */}
            <div className="flex gap-2.5 items-start p-3 bg-white/2 rounded-2xl border border-white/5">
              <span className="material-symbols-outlined text-text-muted text-[18px]">verified_user</span>
              <p className="text-[10px] text-text-muted leading-relaxed font-light">
                Biometric credentials are proofed securely against government record databases via encrypted channel APIs. No images are permanently stored.
              </p>
            </div>
          </div>

          {/* Bottom Complete Button */}
          <div className="w-full mt-8">
            <button 
              disabled={!scanFinished}
              onClick={onComplete}
              className={`w-full py-4 text-sm font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                scanFinished 
                ? 'bg-accent-gold text-black shadow-lg active:scale-98 hover:opacity-90' 
                : 'bg-white/5 text-text-muted border border-white/10 cursor-not-allowed'
              }`}
            >
              {scanFinished ? (
                <>
                  <span>Proceed to Institutional Platform</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-standard">arrow_forward</span>
                </>
              ) : (
                <>
                  <span>Authenticating biometric profile...</span>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-accent-gold rounded-full animate-spin"></div>
                </>
              )}
            </button>
            <p className="text-center text-xs text-text-muted mt-4">
              Biometric issue? <a className="text-accent-gold font-semibold hover:underline" href="#">Use email backup code</a>
            </p>
          </div>
        </motion.main>
      )}

    </div>
  );
}
