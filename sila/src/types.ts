/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId =
  | 'signup'
  | 'verify-identity'
  | 'upload-photo'
  | 'face-verification'
  | 'dashboard'
  | 'pool-details'
  | 'transaction-details'
  | 'report-category'
  | 'report-form'
  | 'report-success';

export type TabId = 'home' | 'pools' | 'wallet' | 'activity' | 'profile';

export interface Pool {
  id: string;
  name: string;
  title: string;
  roi: string;
  description: string;
  totalLiquidity: string;
  totalLiquidityNum: number;
  utilization: number;
  availableLiquidity: string;
  onLoan: string;
  sector: string;
  emoji: string;
  historyRoi?: string;
  image?: string;
}

export interface Position {
  id: string;
  poolId: string;
  sector: string;
  cycle: string;
  amount: string;
  amountNum: number;
  status: 'Active' | 'Withdrawal Requested';
  roi: string;
  roiNum: number;
  maturityDate: string;
}

export interface Transaction {
  id: string;
  type: string;
  poolName: string;
  amount: string;
  amountNum: number;
  date: string;
  time: string;
  status: 'Successful' | 'Pending' | 'Failed';
  source: string;
  reference: string;
  progress: {
    initiatedTime: string;
    processedTime: string;
    completedTime: string;
  };
}

export interface LoanApplication {
  sector: string;
  amount: number;
  purpose: string;
  timeline: string;
  rationale: string;
  status: 'Submitted' | 'Under Review' | 'Verification' | 'Disbursement';
  date: string;
  time: string;
}

// Initial/default mock data mirroring the exact visual states of the screenshots
export const INITIAL_POOLS: Pool[] = [
  {
    id: 'agri',
    name: 'Agriculture',
    title: 'Agriculture — Farm Machinery',
    roi: '12.8%',
    description: 'Funding equipment for smallholder grain farmers to increase harvest yields across the North-Central region.',
    totalLiquidity: '₦850,000,000',
    totalLiquidityNum: 850400000,
    utilization: 86,
    availableLiquidity: '₦120.2M',
    onLoan: '₦730.2M',
    sector: 'Agriculture',
    emoji: '🌾',
    historyRoi: '12.5% ROI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Y7nSOdzK26MTI11njvFuu60WcLzhXBqUARCek3DNU7e809IBI8LBe9E44MoyI2LzcCe0DAdyN-oNE6inWwXrhBV8axZWz5jGOpOs2NbnRb-cffhXHwN_apn3yGSysXVniTKOuO5RXaa40pyd6gMvBDYEs412bsQ-othvoQHxQFoyZxzITKBOKYa7-ycEfNbJyTAzbcXhBoFwk0vVk68UWCBNmkyv7daLu1wIIsql6CQsP3buTAua'
  },
  {
    id: 'logi',
    name: 'Logistics',
    title: 'Logistics — Cold Chain',
    roi: '14.5%',
    description: 'Refrigerated transport for perishables ensuring food security and reducing post-harvest losses in transit.',
    totalLiquidity: '₦1,200,000,000',
    totalLiquidityNum: 1200000000,
    utilization: 45,
    availableLiquidity: '₦660.0M',
    onLoan: '₦540.0M',
    sector: 'Logistics',
    emoji: '🚚',
    historyRoi: '14.2% ROI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Y7nSOdzK26MTI11njvFuu60WcLzhXBqUARCek3DNU7e809IBI8LBe9E44MoyI2LzcCe0DAdyN-oNE6inWwXrhBV8axZWz5jGOpOs2NbnRb-cffhXHwN_apn3yGSysXVniTKOuO5RXaa40pyd6gMvBDYEs412bsQ-othvoQHxQFoyZxzITKBOKYa7-ycEfNbJyTAzbcXhBoFwk0vVk68UWCBNmkyv7daLu1wIIsql6CQsP3buTAua'
  },
  {
    id: 'const',
    name: 'Construction',
    title: 'Construction — Housing',
    roi: '11.2%',
    description: 'Providing building materials and inventory financing for affordable housing projects in suburban hubs.',
    totalLiquidity: '₦2,100,000,000',
    totalLiquidityNum: 2100000000,
    utilization: 90,
    availableLiquidity: '₦210.0M',
    onLoan: '₦1,890.0M',
    sector: 'Real Estate',
    emoji: '🏢',
    historyRoi: '11.2% ROI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPzI5fx356TOSYSpNfCoO_-Ni5YAgU2ptJoiaPKdSpx1BxtfbGWCChJQ2dvxqKfF6AKDPYKmbCE1lpuhjTbi1ItSbwtVJRA8nFnJTjbHd8Yxdk_BiX4JEguARqgwwoVjELLR5UcoKhWYvYqqKb_tWvfjSwuChhmBMyDHyIYDgxeKnvO3ybbF5dJjqJHI73WaKBDNVQmLaJVCeA3GRHXj3lOsNZ23jA9IA-1ScgVrCAlvLF5ik94sNy'
  },
  {
    id: 'retail',
    name: 'Retail/FMCG',
    title: 'Retail/FMCG — Consumer Goods',
    roi: '11.0%',
    description: 'Inventory financing for consumer staples and fast-moving retail products distributed to urban hubs.',
    totalLiquidity: '₦450,000,000',
    totalLiquidityNum: 450000000,
    utilization: 85,
    availableLiquidity: '₦67.5M',
    onLoan: '₦382.5M',
    sector: 'Retail',
    emoji: '🛒',
    historyRoi: '11% Hist. ROI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Y7nSOdzK26MTI11njvFuu60WcLzhXBqUARCek3DNU7e809IBI8LBe9E44MoyI2LzcCe0DAdyN-oNE6inWwXrhBV8axZWz5jGOpOs2NbnRb-cffhXHwN_apn3yGSysXVniTKOuO5RXaa40pyd6gMvBDYEs412bsQ-othvoQHxQFoyZxzITKBOKYa7-ycEfNbJyTAzbcXhBoFwk0vVk68UWCBNmkyv7daLu1wIIsql6CQsP3buTAua'
  },
  {
    id: 'const-complex',
    name: 'Construction Complex',
    title: 'Construction Complex — Towers',
    roi: '14.0%',
    description: 'Commercial real estate construction in major Lagos financial sectors.',
    totalLiquidity: '₦1,200,000,000',
    totalLiquidityNum: 1200000000,
    utilization: 62,
    availableLiquidity: '₦456.0M',
    onLoan: '₦744.0M',
    sector: 'Real Estate',
    emoji: '🏗️',
    historyRoi: '14% Hist. ROI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPzI5fx356TOSYSpNfCoO_-Ni5YAgU2ptJoiaPKdSpx1BxtfbGWCChJQ2dvxqKfF6AKDPYKmbCE1lpuhjTbi1ItSbwtVJRA8nFnJTjbHd8Yxdk_BiX4JEguARqgwwoVjELLR5UcoKhWYvYqqKb_tWvfjSwuChhmBMyDHyIYDgxeKnvO3ybbF5dJjqJHI73WaKBDNVQmLaJVCeA3GRHXj3lOsNZ23jA9IA-1ScgVrCAlvLF5ik94sNy'
  }
];

export const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos1',
    poolId: 'agri',
    sector: 'Agriculture',
    cycle: 'Cycle 3',
    amount: '₦2,500,000',
    amountNum: 2500000,
    status: 'Active',
    roi: '+₦120,400',
    roiNum: 120400,
    maturityDate: 'Oct 2025'
  },
  {
    id: 'pos2',
    poolId: 'logi',
    sector: 'Logistics',
    cycle: 'Cycle 2',
    amount: '₦8,000,000',
    amountNum: 8000000,
    status: 'Withdrawal Requested',
    roi: '+₦540,000',
    roiNum: 540000,
    maturityDate: 'Dec 2025'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN_SIL_9845210',
    type: 'PROFIT DISTRIBUTION',
    poolName: 'Agriculture Pool',
    amount: '₦12,450.00',
    amountNum: 12450,
    date: 'Oct 24, 2023',
    time: '10:45 AM',
    status: 'Successful',
    source: 'Agriculture Pool',
    reference: 'REF-450-AGRI-02',
    progress: {
      initiatedTime: 'Oct 24, 2023 · 10:40 AM',
      processedTime: 'Oct 24, 2023 · 10:43 AM',
      completedTime: 'Oct 24, 2023 · 10:45 AM'
    }
  },
  {
    id: 'TXN_SIL_9845211',
    type: 'DEPOSIT',
    poolName: 'Agriculture Pool',
    amount: '₦250,000.00',
    amountNum: 250000,
    date: 'Oct 24, 2023',
    time: '09:12 AM',
    status: 'Successful',
    source: 'Bank Transfer',
    reference: 'REF-250-AGRI-01',
    progress: {
      initiatedTime: 'Oct 24, 2023 · 09:05 AM',
      processedTime: 'Oct 24, 2023 · 09:08 AM',
      completedTime: 'Oct 24, 2023 · 09:12 AM'
    }
  }
];
