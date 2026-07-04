export interface PricePoint {
  date: string;
  price: number;
}

export interface NearbyMarket {
  id: string;
  name: string;
  distance: number; // km
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
}

// Generate a year of daily prices for ST25 Rice
const generatePriceData = (): PricePoint[] => {
  const data: PricePoint[] = [];
  let currentPrice = 650; // Starting price $650/t
  const startDate = new Date('2025-07-04');
  
  for (let i = 0; i <= 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Add some random walk volatility
    const change = (Math.random() - 0.45) * 12; // Slight upward bias
    currentPrice = Math.max(500, Math.min(1000, currentPrice + change));
    
    // Add seasonal dips/spikes (e.g., harvest season dip)
    if (i > 90 && i < 120) currentPrice -= 1.5; // Harvest season
    if (i > 300 && i < 330) currentPrice += 2;  // High demand season
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return data;
};

export const historicalPriceData = generatePriceData();

export const currentMarketInfo = {
  cropName: 'Rice (ST25)',
  currentPrice: 785.40, // $/ton
  todaysChange: 12.50,
  todaysChangePct: 1.6,
  todaysHigh: 792.00,
  todaysLow: 775.20,
  marketStatus: 'Stable',
  lastUpdated: new Date().toISOString(),
  expectedYield: 4.2, // t/ha
};

export const marketTrends = {
  weekly: 'Strong Upward',
  monthly: 'Stable',
  seasonal: 'Approaching Peak Demand',
  volatility: 'Low',
  demand: 'Increasing',
  supply: 'Moderate',
  direction: 'Rising'
};

export const aiRecommendation = {
  action: 'WAIT 7 DAYS',
  confidence: 88,
  explanation: 'Upcoming mid-season festival is expected to drive up demand for premium rice. Our models predict a price increase before stabilizing.',
  predictedPriceNextWeek: 825.00,
  predictedPriceNextMonth: 790.00,
};

export const nearbyMarkets: NearbyMarket[] = [
  { id: 'm1', name: 'Can Tho Central Hub', distance: 12, currentPrice: 785.40, trend: 'up' },
  { id: 'm2', name: 'Long Xuyen Port', distance: 45, currentPrice: 792.10, trend: 'up' },
  { id: 'm3', name: 'Vinh Long Local', distance: 28, currentPrice: 768.50, trend: 'stable' },
  { id: 'm4', name: 'Ho Chi Minh Export Terminal', distance: 140, currentPrice: 835.00, trend: 'up' },
];

export const historicalSummary = {
  highestPrice: 845.20,
  lowestPrice: 620.10,
  averagePrice: 712.80,
  yearlyChange: 14.5, // %
};
