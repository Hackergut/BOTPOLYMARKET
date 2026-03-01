import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Brain,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import useStore from '../store/useStore';

const Agents: React.FC = () => {
  const { agents, updateAgents } = useStore();
  
  // Mock data initialization
  useEffect(() => {
    // Initialize with mock data if empty
    if (agents.length === 0) {
      updateAgents([
        { 
          id: '1', 
          name: 'Data Analyst Agent', 
          status: 'online', 
          lastActive: new Date(), 
          confidence: 95 
        },
        { 
          id: '2', 
          name: 'Sentiment Analysis Agent', 
          status: 'processing', 
          lastActive: new Date(Date.now() - 5000), 
          confidence: 87 
        },
        { 
          id: '3', 
          name: 'Risk Management Agent', 
          status: 'online', 
          lastActive: new Date(), 
          confidence: 92 
        },
        { 
          id: '4', 
          name: 'Strategy Selector Agent', 
          status: 'paused', 
          lastActive: new Date(Date.now() - 300000), 
          confidence: 0 
        },
        { 
          id: '5', 
          name: 'Technical Analysis Agent', 
          status: 'error', 
          lastActive: new Date(Date.now() - 10000), 
          confidence: 78 
        },
        { 
          id: '6', 
          name: 'News Scanner Agent', 
          status: 'online', 
          lastActive: new Date(), 
          confidence: 89 
        },
      ]);
    }
  }, []);
  
  const handleAgentAction = (agentId: string, action: 'start' | 'pause' | 'restart') => {
    // Update agent status in store
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      const newStatus = action === 'start' ? 'online' : action === 'pause' ? 'paused' : 'processing';
      updateAgents(agents.map(a => 
        a.id === agentId ? { ...a, status: newStatus, lastActive: new Date() } : a
      ));
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-warning animate-pulse" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-muted-foreground" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'processing':
        return 'warning';
      case 'paused':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Agent Monitoring</h1>
          <p className="text-muted-foreground">Monitor and control your trading agents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-1" />
            Refresh All
          </Button>
        </div>
      </div>
      
      {/* Agent Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-success/10 p-2 mr-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {agents.filter(a => a.status === 'online').length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-warning/10 p-2 mr-3">
              <Activity className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {agents.filter(a => a.status === 'processing').length}
              </p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-muted/10 p-2 mr-3">
              <Pause className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {agents.filter(a => a.status === 'paused').length}
              </p>
              <p className="text-sm text-muted-foreground">Paused</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="rounded-full bg-destructive/10 p-2 mr-3">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {agents.filter(a => a.status === 'error').length}
              </p>
              <p className="text-sm text-muted-foreground">Error</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Agent List */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                <div className="flex items-center">
                  <div className="mr-4">
                    {getStatusIcon(agent.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-muted-foreground mr-3">
                        Confidence: {agent.confidence}%
                      </span>
                      <Badge variant={getStatusVariant(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Last active: {agent.lastActive.toLocaleTimeString()}
                  </span>
                  <div className="flex space-x-1">
                    {agent.status === 'paused' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAgentAction(agent.id, 'start')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {agent.status === 'online' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAgentAction(agent.id, 'pause')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAgentAction(agent.id, 'restart')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Agent Decision Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
              <div>
                <p className="font-medium">Data Analyst Agent</p>
                <p className="text-sm text-muted-foreground">
                  Identified bullish trend in BTC markets with 92% confidence
                </p>
              </div>
              <Badge variant="success">BUY</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
              <div>
                <p className="font-medium">Risk Management Agent</p>
                <p className="text-sm text-muted-foreground">
                  Portfolio exposure approaching limit, recommending reduction
                </p>
              </div>
              <Badge variant="warning">REDUCE</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
              <div>
                <p className="font-medium">Sentiment Analysis Agent</p>
                <p className="text-sm text-muted-foreground">
                  Negative news sentiment detected for political markets
                </p>
              </div>
              <Badge variant="default">MONITOR</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
              <div>
                <p className="font-medium">Technical Analysis Agent</p>
                <p className="text-sm text-muted-foreground">
                  Error processing market data for ETH markets
                </p>
              </div>
              <Badge variant="destructive">ERROR</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agents;