import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Bell, CheckCircle } from "lucide-react";

interface AlertItem {
  id: number;
  product: string;
  shelf: string;
  urgency: "high" | "medium" | "low";
  prediction: string;
}

interface AlertStatsProps {
  alerts: AlertItem[];
}

export const AlertStats = ({ alerts }: AlertStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.urgency === "high").length}
              </p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.urgency === "medium").length}
              </p>
              <p className="text-sm text-muted-foreground">Medium</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {alerts.filter(a => a.urgency === "low").length}
              </p>
              <p className="text-sm text-muted-foreground">Low Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">Total Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
