import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { AlertItem } from "./AlertItem";

interface AlertItem {
  id: number;
  product: string;
  shelf: string;
  urgency: "high" | "medium" | "low";
  prediction: string;
}

interface AlertsListProps {
  filteredAlerts: AlertItem[];
  onResolve: (alertId: number) => void;
  onSchedule: (alert: AlertItem) => void;
  onContact: (alertId: number, productName: string) => void;
}

export const AlertsList = ({ filteredAlerts, onResolve, onSchedule, onContact }: AlertsListProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
        <CardDescription>
          Showing {filteredAlerts.length} active alerts requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No active alerts for this filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={onResolve}
              onSchedule={onSchedule}
              onContact={onContact}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
