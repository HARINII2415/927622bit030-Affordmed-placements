import { format, subMinutes } from 'date-fns';

// Stock symbols for our mock data
export const STOCK_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'BRK.A'];

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

export interface StockPricePoint {
  timestamp: string;
  price: number;
}

// Generate realistic price movement with some randomness
const generatePriceMovement = (basePrice: number, volatility: number): number => {
  const change = (Math.random() - 0.5) * volatility;
  return basePrice * (1 + change);
};

// Mock stock data with realistic values
const mockStockData: Record<string, { name: string; basePrice: number; volatility: number }> = {
  'AAPL': { name: 'Apple Inc.', basePrice: 187.32, volatility: 0.015 },
  'MSFT': { name: 'Microsoft Corporation', basePrice: 418.35, volatility: 0.012 },
  'GOOGL': { name: 'Alphabet Inc.', basePrice: 154.85, volatility: 0.018 },
  'AMZN': { name: 'Amazon.com, Inc.', basePrice: 178.75, volatility: 0.020 },
  'META': { name: 'Meta Platforms, Inc.', basePrice: 472.22, volatility: 0.025 },
  'TSLA': { name: 'Tesla, Inc.', basePrice: 193.57, volatility: 0.035 },
  'NVDA': { name: 'NVIDIA Corporation', basePrice: 880.18, volatility: 0.028 },
  'BRK.A': { name: 'Berkshire Hathaway Inc.', basePrice: 614340.00, volatility: 0.008 }
};

// Generate historical price data points
const generateHistoricalPrices = (
  symbol: string, 
  minutes: number
): StockPricePoint[] => {
  const data: StockPricePoint[] = [];
  const now = new Date();
  const { basePrice, volatility } = mockStockData[symbol];
  
  let currentPrice = basePrice;
  
  for (let i = minutes; i >= 0; i--) {
    const timestamp = subMinutes(now, i);
    currentPrice = generatePriceMovement(currentPrice, volatility);
    
    data.push({
      timestamp: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return data;
};

// Generate latest stock data
export const getStocks = async (): Promise<StockData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return STOCK_SYMBOLS.map(symbol => {
    const { name, basePrice, volatility } = mockStockData[symbol];
    const currentPrice = generatePriceMovement(basePrice, volatility);
    const previousPrice = basePrice;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;
    
    return {
      symbol,
      name,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: parseFloat((currentPrice * (Math.random() * 1000000000 + 1000000000)).toFixed(2)),
      timestamp: new Date().toISOString()
    };
  });
};

// Get stock price history for a specific stock
export const getStockHistory = async (symbol: string, minutes: number): Promise<StockPricePoint[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return generateHistoricalPrices(symbol, minutes);
};

// Calculate average price for a stock over a period
export const calculateAveragePrice = (priceData: StockPricePoint[]): number => {
  const sum = priceData.reduce((acc, point) => acc + point.price, 0);
  return parseFloat((sum / priceData.length).toFixed(2));
};

// Calculate standard deviation for a stock over a period
export const calculateStandardDeviation = (priceData: StockPricePoint[]): number => {
  const avg = calculateAveragePrice(priceData);
  const squareDiffs = priceData.map(point => Math.pow(point.price - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length;
  return parseFloat(Math.sqrt(avgSquareDiff).toFixed(2));
};

// Calculate correlation between two stocks
export const calculateCorrelation = (stockA: StockPricePoint[], stockB: StockPricePoint[]): number => {
  if (stockA.length !== stockB.length || stockA.length < 2) {
    return 0;
  }
  
  const n = stockA.length;
  
  // Calculate means
  const meanA = stockA.reduce((sum, point) => sum + point.price, 0) / n;
  const meanB = stockB.reduce((sum, point) => sum + point.price, 0) / n;
  
  // Calculate covariance and standard deviations
  let covariance = 0;
  let varA = 0;
  let varB = 0;
  
  for (let i = 0; i < n; i++) {
    const diffA = stockA[i].price - meanA;
    const diffB = stockB[i].price - meanB;
    covariance += diffA * diffB;
    varA += diffA * diffA;
    varB += diffB * diffB;
  }
  
  covariance /= n;
  varA /= n;
  varB /= n;
  
  const stdA = Math.sqrt(varA);
  const stdB = Math.sqrt(varB);
  
  if (stdA === 0 || stdB === 0) {
    return 0;
  }
  
  // Pearson correlation coefficient
  const correlation = covariance / (stdA * stdB);
  
  // Ensure value is within [-1, 1] range due to potential floating point errors
  return Math.max(-1, Math.min(1, parseFloat(correlation.toFixed(2))));
};

// Get correlation matrix for all stocks
export const getCorrelationMatrix = async (minutes: number): Promise<{ symbols: string[], data: number[][] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const stocksData: Record<string, StockPricePoint[]> = {};
  
  // Get historical data for all stocks
  for (const symbol of STOCK_SYMBOLS) {
    stocksData[symbol] = await getStockHistory(symbol, minutes);
  }
  
  // Calculate correlation matrix
  const correlationMatrix: number[][] = [];
  
  for (const symbolA of STOCK_SYMBOLS) {
    const correlationRow: number[] = [];
    
    for (const symbolB of STOCK_SYMBOLS) {
      if (symbolA === symbolB) {
        correlationRow.push(1); // Self correlation is always 1
      } else {
        const correlation = calculateCorrelation(stocksData[symbolA], stocksData[symbolB]);
        correlationRow.push(correlation);
      }
    }
    
    correlationMatrix.push(correlationRow);
  }
  
  return {
    symbols: STOCK_SYMBOLS,
    data: correlationMatrix
  };
};