import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Brain, Clock, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const weeklyData = [
  { day: "Mon", predicted: 120, actual: 118, accuracy: 98 },
  { day: "Tue", predicted: 95, actual: 92, accuracy: 97 },
  { day: "Wed", predicted: 140, actual: 138, accuracy: 99 },
  { day: "Thu", predicted: 110, actual: 115, accuracy: 95 },
  { day: "Fri", predicted: 180, actual: 175, accuracy: 97 },
  { day: "Sat", predicted: 220, actual: 225, accuracy: 98 },
  { day: "Sun", predicted: 160, actual: 155, accuracy: 97 },
];

const categoryData = [
  { name: "Beverages", value: 35, color: "#3b82f6" },
  { name: "Snacks", value: 25, color: "#10b981" },
  { name: "Dairy", value: 20, color: "#f59e0b" },
  { name: "Bakery", value: 12, color: "#ef4444" },
  { name: "Others", value: 8, color: "#8b5cf6" },
];

export const PredictiveAnalytics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            ML Prediction Accuracy
          </CardTitle>
          <CardDescription>Weekly forecast vs actual restocking needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="predicted" fill="#3b82f6" name="Predicted" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Target className="w-3 h-3 mr-1" />
              97.2% Average Accuracy
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Restock Priority by Category
          </CardTitle>
          <CardDescription>Current priority distribution for restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="flex-1">{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>AI-powered insights for optimal restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Peak Hour Optimization</h4>
              <p className="text-sm text-blue-700">
                Schedule restocking between 2-4 PM to minimize customer disruption. 
                Expected 23% efficiency gain.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Weekend Preparation</h4>
              <p className="text-sm text-green-700">
                Increase beverage inventory by 40% before Friday evening. 
                Historical data shows consistent weekend spikes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Seasonal Adjustment</h4>
              <p className="text-sm text-purple-700">
                Hot beverage demand increasing. Adjust coffee/tea stock levels 
                by 25% for optimal turnover.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
