import React, { useState } from 'react';
import { scaleLinear } from 'd3-scale';

interface CorrelationHeatmapProps {
  correlationData: {
    symbols: string[];
    data: number[][];
  };
  onSelectStock: (symbol: string) => void;
  averages: Record<string, number>;
  standardDeviations: Record<string, number>;
  loading: boolean;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationData,
  onSelectStock,
  averages,
  standardDeviations,
  loading
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
    value: number;
  } | null>(null);
  
  const [hoveredLabel, setHoveredLabel] = useState<{
    index: number;
    isRow: boolean;
  } | null>(null);
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  const { symbols, data } = correlationData;
  
  // Create a color scale for the correlation values
  const colorScale = scaleLinear<string>()
    .domain([-1, -0.5, 0, 0.5, 1])
    .range(['#ef4444', '#f97316', '#d1d5db', '#22c55e', '#16a34a']);
  
  const getCellColor = (value: number) => {
    return colorScale(value);
  };
  
  const cellSize = 40;
  const labelWidth = 80;
  const totalWidth = labelWidth + (symbols.length * cellSize);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Correlation Heatmap
      </h3>
      
      <div className="overflow-x-auto pb-4">
        <div style={{ width: totalWidth, position: 'relative' }}>
          {/* Color legend */}
          <div className="flex items-center mb-6">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Strong Negative</span>
            <div className="flex h-4 w-48">
              {[-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map((value) => (
                <div
                  key={value}
                  style={{
                    backgroundColor: colorScale(value),
                    width: '11.1%',
                    height: '100%'
                  }}
                ></div>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Strong Positive</span>
          </div>
          
          {/* Top headers */}
          <div style={{ display: 'flex', marginLeft: labelWidth }}>
            {symbols.map((symbol, index) => (
              <div
                key={`col-${index}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-45deg)',
                  fontSize: '0.75rem'
                }}
                className={`font-medium cursor-pointer transition-colors ${
                  hoveredLabel?.index === index && hoveredLabel?.isRow === false
                    ? 'text-blue-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => onSelectStock(symbol)}
                onMouseEnter={() => setHoveredLabel({ index, isRow: false })}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                {symbol}
              </div>
            ))}
          </div>
          
          {/* Rows with labels */}
          {symbols.map((rowSymbol, rowIndex) => (
            <div key={`row-${rowIndex}`} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Row label */}
              <div
                style={{
                  width: labelWidth,
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontSize: '0.75rem'
                }}
                className={`font-medium cursor-pointer transition-colors ${
                  hoveredLabel?.index === rowIndex && hoveredLabel?.isRow
                    ? 'text-blue-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => onSelectStock(rowSymbol)}
                onMouseEnter={() => setHoveredLabel({ index: rowIndex, isRow: true })}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                {rowSymbol}
              </div>
              
              {/* Cells for this row */}
              {data[rowIndex].map((value, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getCellColor(value),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    transition: 'transform 0.15s ease',
                    transform: hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                      ? 'scale(1.05)'
                      : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={value > 0.5 || value < -0.5 ? 'text-white' : 'text-gray-900'}
                >
                  {value.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip for hovering over labels */}
      {hoveredLabel && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {symbols[hoveredLabel.index]} Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average Price</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${averages[symbols[hoveredLabel.index]].toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Standard Deviation</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${standardDeviations[symbols[hoveredLabel.index]].toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Volatility</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {((standardDeviations[symbols[hoveredLabel.index]] / averages[symbols[hoveredLabel.index]]) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tooltip for hovering over cells */}
      {hoveredCell && !hoveredLabel && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {symbols[hoveredCell.row]} & {symbols[hoveredCell.col]} Correlation
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correlation Coefficient</p>
              <p className={`font-medium text-lg ${
                hoveredCell.value > 0.5 ? 'text-green-600 dark:text-green-400' :
                hoveredCell.value < -0.5 ? 'text-red-600 dark:text-red-400' :
                'text-gray-900 dark:text-white'
              }`}>
                {hoveredCell.value.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Interpretation</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {hoveredCell.value > 0.7 ? 'Strong positive correlation' :
                 hoveredCell.value > 0.5 ? 'Moderate positive correlation' :
                 hoveredCell.value > 0.3 ? 'Weak positive correlation' :
                 hoveredCell.value > -0.3 ? 'Little to no correlation' :
                 hoveredCell.value > -0.5 ? 'Weak negative correlation' :
                 hoveredCell.value > -0.7 ? 'Moderate negative correlation' :
                 'Strong negative correlation'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;