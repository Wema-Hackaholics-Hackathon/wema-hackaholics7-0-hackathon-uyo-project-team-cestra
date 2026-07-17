/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ScreenId, 
  Pool, 
  Position, 
  Transaction, 
  INITIAL_POOLS, 
  INITIAL_POSITIONS, 
  INITIAL_TRANSACTIONS 
} from './types';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import PoolDetails from './components/PoolDetails';
import SupportIssues from './components/SupportIssues';
import DepositModal from './components/DepositModal';
import TransactionDetailsModal from './components/TransactionDetailsModal';

export default function App() {
  // Global Navigation Screen state
  const [screen, setScreen] = useState<ScreenId>('signup');
  
  // Data State
  const [pools, setPools] = useState<Pool[]>(INITIAL_POOLS);
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  // Balance State (linked to deposit actions)
  const [totalBalance, setTotalBalance] = useState<number>(10500000.00); // ₦10,500,000 portfolio initial sum
  const [unallocatedFunds, setUnallocatedFunds] = useState<number>(245000.00); // ₦245,000.00 initial free wallet balance

  // Selection states for Modals & drilldowns
  const [selectedPool, setSelectedPool] = useState<Pool | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  
  // Interactive Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);

  // Default premium avatars used inside screenshots
  const userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBY0U__iZPxbTQj-QHqVzvbQR0ugKo2I2Sv8Ti7YhgHtzRTUYYwAGtE2iRZLiqna3WgFbOs2-P95j5gqSEHQJ8eiYI7_JPS19pu90jFxwVOkv8pugUGZ_YCrUaeZjnUZGsWFjtWLAyb6rGcCRansTg7XWfnDIS2M-OHYvNn2rqvusZpVqeFzWj73--9Nl0kDMX4U8Dvkr4vVTIjgrPzuygwOoJcDwg6WfgK-SRzYFJkONzk2Uk21YZi";

  // Handles completion of a real deposit inside the step modal
  const handleDepositSuccess = (amount: number, poolId: string) => {
    // 1. Deduct from unallocated funds if possible, otherwise simulate account funding
    if (unallocatedFunds >= amount) {
      setUnallocatedFunds(prev => prev - amount);
    } else {
      // Direct external transfer simulation increases total portfolio immediately
      setTotalBalance(prev => prev + amount);
    }

    // 2. Add position or top-up existing
    const matchingPool = pools.find(p => p.id === poolId);
    const existingPositionIndex = positions.findIndex(pos => pos.poolId === poolId);

    if (existingPositionIndex > -1) {
      const updatedPositions = [...positions];
      const prevAmt = updatedPositions[existingPositionIndex].amountNum;
      const newAmt = prevAmt + amount;
      updatedPositions[existingPositionIndex] = {
        ...updatedPositions[existingPositionIndex],
        amountNum: newAmt,
        amount: '₦' + newAmt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      };
      setPositions(updatedPositions);
    } else {
      const newPos: Position = {
        id: `pos-${Math.floor(Math.random() * 9000 + 1000)}`,
        poolId: poolId,
        sector: matchingPool?.sector || 'Custom Sector',
        cycle: 'Cycle 4',
        amount: '₦' + amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
        amountNum: amount,
        status: 'Active',
        roi: '+₦0',
        roiNum: 0,
        maturityDate: 'Oct 2026'
      };
      setPositions([newPos, ...positions]);
    }

    // 3. Log a new transaction audit record
    const newTxn: Transaction = {
      id: `TXN_SIL_${Math.floor(9000000 + Math.random() * 900000)}`,
      type: 'DEPOSIT',
      poolName: matchingPool?.title || 'Sector Pool',
      amount: '₦' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      amountNum: amount,
      date: 'Today',
      time: 'Just Now',
      status: 'Successful',
      source: 'Bank Transfer',
      reference: `REF-${Math.floor(100 + Math.random() * 899)}-DEP-0${Math.floor(Math.random() * 9)}`,
      progress: {
        initiatedTime: 'Just Now',
        processedTime: 'Just Now',
        completedTime: 'Just Now'
      }
    };
    setTransactions([newTxn, ...transactions]);
  };

  const navigateToPoolDetails = (pool: Pool) => {
    setSelectedPool(pool);
    setScreen('pool-details');
  };

  const navigateToTransactionDetails = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsTxnModalOpen(true);
  };

  const handleOpenSupport = () => {
    setScreen('report-category');
  };

  return (
    <div className="relative min-h-screen bg-background-page text-text-primary overflow-x-hidden selection:bg-accent-emerald/20">
      
      {/* Screen Routing transitions */}
      <AnimatePresence mode="wait">
        
        {/* Onboarding Flow: Signup, Identity check, photo, and live face scan */}
        {(screen === 'signup' || screen === 'verify-identity' || screen === 'upload-photo' || screen === 'face-verification') && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OnboardingFlow 
              initialStage={screen as any}
              onComplete={() => setScreen('dashboard')} 
            />
          </motion.div>
        )}

        {/* Dashboard layout (Home, Pools, Wallet, Activity, Profile tabs) */}
        {screen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard 
              pools={pools}
              positions={positions}
              transactions={transactions}
              userAvatar={userAvatar}
              onOpenSupport={handleOpenSupport}
              onSelectPool={navigateToPoolDetails}
              onSelectTransaction={navigateToTransactionDetails}
              totalBalance={totalBalance}
              unallocatedFunds={unallocatedFunds}
              setTotalBalance={setTotalBalance}
              setUnallocatedFunds={setUnallocatedFunds}
            />
          </motion.div>
        )}

        {/* Sector Pool details screen */}
        {screen === 'pool-details' && selectedPool && (
          <motion.div
            key="pool-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <PoolDetails 
              pool={selectedPool}
              userAvatar={userAvatar}
              onBack={() => setScreen('dashboard')}
              onOpenDeposit={() => setIsDepositModalOpen(true)}
            />
          </motion.div>
        )}

        {/* Support categories, ticket submission & success flow */}
        {(screen === 'report-category' || screen === 'report-form' || screen === 'report-success') && (
          <motion.div
            key="support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SupportIssues 
              userAvatar={userAvatar}
              transactions={transactions}
              onBackToHome={() => setScreen('dashboard')}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Global Interactive Modals */}
      
      {/* Deposit step-by-step modal drawer */}
      <AnimatePresence>
        {isDepositModalOpen && (
          <DepositModal 
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            selectedPool={selectedPool}
            onDepositSuccess={handleDepositSuccess}
          />
        )}
      </AnimatePresence>

      {/* Transaction Details modal drawer */}
      <AnimatePresence>
        {isTxnModalOpen && selectedTransaction && (
          <TransactionDetailsModal 
            isOpen={isTxnModalOpen}
            onClose={() => setIsTxnModalOpen(false)}
            transaction={selectedTransaction}
            onReportIssue={() => {
              // Redirect straight to support category selection stage
              setScreen('report-category');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
