import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// Mock data for performance chart
const generatePerformanceData = () => {
  const data = [];
  let equity = 10000; // Starting equity
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random daily P&L
    const dailyPnL = (Math.random() - 0.3) * 200; // Bias slightly negative
    equity += dailyPnL;
    
    data.push({
      date: date.toISOString().split('T')[0],
      equity: parseFloat(equity.toFixed(2)),
      dailyPnL: parseFloat(dailyPnL.toFixed(2)),
      trades: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
};

const PerformanceChart: React.FC = () => {
  const chartData = generatePerformanceData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth()+1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                yAxisId="left"
                domain={['auto', 'auto']} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={['auto', 'auto']} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)'
                }}
                formatter={(value, name) => {
                  if (name === 'equity') {
                    return [`$${parseFloat(value as string).toLocaleString()}`, 'Equity'];
                  }
                  return [`$${value}`, name === 'dailyPnL' ? 'Daily P&L' : 'Trades'];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="equity"
                stroke="#00D5FF"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                name="Equity"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="dailyPnL"
                stroke="#FF3CAC"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4 }}
                name="Daily P&L"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;