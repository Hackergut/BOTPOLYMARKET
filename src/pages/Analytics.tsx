import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import PerformanceChart from '../components/charts/PerformanceChart';
import AllocationChart from '../components/charts/AllocationChart';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Analytics</h1>
        <p className="text-muted-foreground">Detailed performance metrics and insights</p>
      </div>

      <PerformanceChart />
      <AllocationChart />
    </div>
  );
};

export default Analytics;