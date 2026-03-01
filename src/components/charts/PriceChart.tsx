import React from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for chart
const generateMockData = () => {
  const data = [];
  let value = 50;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    value += (Math.random() - 0.5) * 5;
    value = Math.max(10, Math.min(90, value)); // Keep between 10-90
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(value.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000
    });
  }
  
  return data;
};

const PriceChart: React.FC = () => {
  const chartData = generateMockData();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Price Chart</CardTitle>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth()+1}/${date.getDate()}`;
                }}
              />
              <YAxis 
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
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00F5A0"
                fill="url(#colorPrice)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00F5A0" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;