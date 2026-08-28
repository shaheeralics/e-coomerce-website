'use client';

import React, { useState } from 'react';
import { TrendingUp, ShoppingBag, Users, ChevronUp, Activity } from 'lucide-react';

interface RevenuePoint {
  date: string;
  amount: number;
}

interface TopProduct {
  name: string;
  quantity: number;
}

interface ChartsProps {
  revenueTrend: RevenuePoint[];
  topProducts: TopProduct[];
  kpis: {
    totalSales: number;
    activeOrders: number;
    totalCustomers: number;
  };
}

export default function DashboardCharts({ revenueTrend, topProducts, kpis }: ChartsProps) {
  // Line Chart Interactive Tooltip State
  const [activePoint, setActivePoint] = useState<{
    index: number;
    date: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  // SVG dimensions for Line Chart
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Max value of revenue points for scale mapping
  const maxAmount = Math.max(...revenueTrend.map(p => p.amount), 100);
  // Round maxAmount to a clean number for intervals
  const roundedMax = Math.ceil(maxAmount / 100) * 100;

  // Map data coordinates to SVG space
  const points = revenueTrend.map((p, index) => {
    const x = padding.left + (index / (revenueTrend.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - (p.amount / (roundedMax || 1)) * chartHeight;
    return { x, y, date: p.date, amount: p.amount, index };
  });

  // Build the SVG path string for the line
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Build the SVG path string for the area fill
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  // Bar Chart calculations
  const maxQuantity = Math.max(...topProducts.map(p => p.quantity), 1);

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Styled KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* KPI Card 1: Total Sales */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 flex items-center justify-between shadow-xs select-none">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Total Sales
            </span>
            <h3 className="text-3xl font-black text-white">Rs. {kpis.totalSales.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Real-time Gross</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-900 border border-neutral-850">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* KPI Card 2: Active Orders */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 flex items-center justify-between shadow-xs select-none">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Active Orders
            </span>
            <h3 className="text-3xl font-black text-white">{kpis.activeOrders}</h3>
            <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              <span>Processing Queue</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-900 border border-neutral-850">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* KPI Card 3: Total Customers */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 flex items-center justify-between shadow-xs select-none">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Total Customers
            </span>
            <h3 className="text-3xl font-black text-white">{kpis.totalCustomers}</h3>
            <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-450 uppercase tracking-widest">
              <span>Registered Accounts</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-900 border border-neutral-850">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 2. Visualizations Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Revenue Trend Area Chart */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 space-y-6 relative flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Revenue Trend</h3>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Daily gross revenue over the last 7 calendar days</p>
          </div>

          <div className="relative w-full h-[220px]">
            {/* Custom SVG Line Chart */}
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Area Gradient Fill */}
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding.top + chartHeight * ratio;
                const value = Math.round(roundedMax * (1 - ratio));
                return (
                  <g key={i} className="opacity-40">
                    <line 
                      x1={padding.left} 
                      y1={y} 
                      x2={svgWidth - padding.right} 
                      y2={y} 
                      stroke="#262626" 
                      strokeDasharray="4 4"
                    />
                    <text 
                      x={padding.left - 10} 
                      y={y + 3} 
                      fill="#737373" 
                      fontSize="9" 
                      fontWeight="bold"
                      textAnchor="end"
                      className="font-sans"
                    >
                      Rs. {value}
                    </text>
                  </g>
                );
              })}

              {/* X-axis date labels */}
              {points.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={svgHeight - 10}
                  fill="#737373"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-sans"
                >
                  {p.date}
                </text>
              ))}

              {/* The Area Path */}
              {areaPath && (
                <path d={areaPath} fill="url(#areaGrad)" className="animate-fade-in" />
              )}

              {/* The Line Path */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  className="animate-draw-line"
                />
              )}

              {/* Dots on top of the line */}
              {points.map((p, i) => {
                const isActive = activePoint?.index === p.index;
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 5 : 3.5}
                    fill={isActive ? '#ffffff' : '#0a0a0a'}
                    stroke={isActive ? '#0a0a0a' : '#ffffff'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => {
                      setActivePoint({
                        index: p.index,
                        date: p.date,
                        amount: p.amount,
                        x: p.x,
                        y: p.y
                      });
                    }}
                    onMouseLeave={() => setActivePoint(null)}
                  />
                );
              })}
            </svg>

            {/* Interactive Tooltip popup overlay */}
            {activePoint && (
              <div 
                className="absolute z-10 bg-neutral-900 border border-neutral-800 px-3 py-2 text-[10px] uppercase font-bold text-white shadow-xl pointer-events-none rounded-none"
                style={{
                  left: `${(activePoint.x / svgWidth) * 100}%`,
                  top: `${(activePoint.y / svgHeight) * 100 - 18}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="text-[8px] text-neutral-400 leading-none mb-1 font-mono tracking-wider">{activePoint.date}</div>
                <div className="text-white leading-none font-black text-xs">Rs. {activePoint.amount.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Top Selling Products Bar Chart */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Top Selling Products</h3>
            <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Best-selling items sorted by total quantity sold</p>
          </div>

          <div className="space-y-4 py-2">
            {topProducts.length === 0 ? (
              <div className="text-center py-10 text-[10px] text-neutral-500 uppercase tracking-widest border border-dashed border-neutral-900">
                No Sales Data Available
              </div>
            ) : (
              topProducts.map((prod, index) => {
                const percentage = (prod.quantity / maxQuantity) * 100;
                return (
                  <div key={index} className="space-y-1.5 group select-none">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-neutral-350 truncate pr-2 max-w-[200px]" title={prod.name}>
                        {index + 1}. {prod.name}
                      </span>
                      <span className="text-white font-black">{prod.quantity} sold</span>
                    </div>

                    <div className="relative w-full h-3.5 bg-neutral-900 border border-neutral-850">
                      {/* Bar Fill */}
                      <div 
                        className="h-full bg-gradient-to-r from-neutral-800 to-white transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
