import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Package } from "lucide-react";

const data = [
  { time: "6:00", current: 95, predicted: 92, optimal: 85 },
  { time: "8:00", current: 78, predicted: 75, optimal: 85 },
  { time: "10:00", current: 65, predicted: 62, optimal: 85 },
  { time: "12:00", current: 45, predicted: 42, optimal: 85 },
  { time: "14:00", current: 38, predicted: 35, optimal: 85 },
  { time: "16:00", current: 52, predicted: 55, optimal: 85 },
  { time: "18:00", current: 68, predicted: 72, optimal: 85 },
  { time: "20:00", current: 82, predicted: 85, optimal: 85 },
];

export const InventoryChart = () => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Real-Time Inventory Levels
            </CardTitle>
            <CardDescription>Current vs Predicted Stock Levels</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            +12% efficiency
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                label={{ value: 'Stock %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#currentGradient)"
                name="Current Stock"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#predictedGradient)"
                strokeDasharray="5 5"
                name="Predicted"
              />
              <Line
                type="monotone"
                dataKey="optimal"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={false}
                name="Optimal Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Current Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>ML Prediction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Optimal Level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
