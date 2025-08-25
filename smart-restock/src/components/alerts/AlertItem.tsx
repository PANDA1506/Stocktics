import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Calendar } from "lucide-react";

interface AlertItemProps {
  alert: {
    id: number;
    product: string;
    shelf: string;
    urgency: "high" | "medium" | "low";
    prediction: string;
  };
  onResolve: (alertId: number) => void;
  onSchedule: (alert: AlertItemProps['alert']) => void;
  onContact: (alertId: number, productName: string) => void;
}

export const AlertItem = ({ alert, onResolve, onSchedule, onContact }: AlertItemProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getAlertStyle = (urgency: string) => {
    switch (urgency) {
      case "high": return "border-l-red-500 bg-red-50";
      case "medium": return "border-l-yellow-500 bg-yellow-50";
      case "low": return "border-l-blue-500 bg-blue-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <Alert className={`border-l-4 ${getAlertStyle(alert.urgency)}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-slate-900">{alert.product}</strong>
              <Badge variant={getUrgencyColor(alert.urgency)} className="text-xs">
                {alert.urgency.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">Shelf {alert.shelf}</span>
            </div>
            <p className="text-sm text-muted-foreground">{alert.prediction}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onSchedule(alert)}
              className="flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              Schedule
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onContact(alert.id, alert.product)}
              className="flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              Contact
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onResolve(alert.id)}
            >
              Resolve
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
