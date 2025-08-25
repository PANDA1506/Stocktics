import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Package, Wifi, Camera, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScheduleModal } from "./alerts/ScheduleModal";
import { sendScheduleEmail } from "@/services/emailService";

interface Product {
  id: number;
  name: string;
  shelf: string;
  currentStock: number;
  maxCapacity: number;
  sensor: "RFID" | "Camera";
  status: "critical" | "low" | "good";
  lastUpdate: string;
  prediction: string;
}

interface ProductGridProps {
  products: Product[];
  onProductUpdate?: (productId: number, updates: Partial<Product>) => void;
}

export const ProductGrid = ({ products, onProductUpdate }: ProductGridProps) => {
  const [filter, setFilter] = useState("all");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    if (filter === "critical") return product.status === "critical";
    if (filter === "low") return product.status === "low";
    if (filter === "good") return product.status === "good";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "low": return "secondary";
      case "good": return "default";
      default: return "default";
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const handleScheduleClick = (product: Product) => {
    setSelectedProduct(product);
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (scheduleData: any) => {
    if (!selectedProduct) return;

    // Send email notification
    const emailSent = await sendScheduleEmail({
      productName: selectedProduct.name,
      shelf: selectedProduct.shelf,
      date: scheduleData.date,
      time: scheduleData.time,
      priority: scheduleData.priority,
      assignedTo: scheduleData.assignedTo,
      notes: scheduleData.notes
    });

    // Update product if callback provided
    if (onProductUpdate) {
      onProductUpdate(selectedProduct.id, {
        lastUpdate: "Scheduled for restock",
        prediction: `Restock scheduled for ${scheduleData.date} at ${scheduleData.time}`
      });
    }

    toast({
      title: emailSent ? "Restock Scheduled & Email Sent" : "Restock Scheduled",
      description: emailSent 
        ? `Restocking scheduled for ${selectedProduct.name} and notification sent to ${scheduleData.assignedTo}.`
        : `Restocking scheduled for ${selectedProduct.name}. Email notification failed.`,
    });

    setScheduleModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          All Products ({products.length})
        </Button>
        <Button 
          variant={filter === "critical" ? "destructive" : "outline"}
          onClick={() => setFilter("critical")}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Critical ({products.filter(p => p.status === "critical").length})
        </Button>
        <Button 
          variant={filter === "low" ? "secondary" : "outline"}
          onClick={() => setFilter("low")}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Low Stock ({products.filter(p => p.status === "low").length})
        </Button>
        <Button 
          variant={filter === "good" ? "default" : "outline"}
          onClick={() => setFilter("good")}
          className="flex items-center gap-2"
        >
          Good Stock ({products.filter(p => p.status === "good").length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Shelf {product.shelf}</p>
                </div>
                <Badge variant={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stock Level</span>
                    <span className="font-medium">
                      {product.currentStock}/{product.maxCapacity}
                    </span>
                  </div>
                  <Progress 
                    value={getStockPercentage(product.currentStock, product.maxCapacity)} 
                    className="h-2"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {product.sensor === "RFID" ? (
                    <Wifi className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Camera className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-muted-foreground">
                    {product.sensor} • Updated {product.lastUpdate}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border">
                  <p className="text-sm font-medium text-slate-700">
                    ML Prediction:
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {product.prediction}
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleScheduleClick(product)}
                >
                  Schedule Restock
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <ScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setSelectedProduct(null);
          }}
          onSchedule={handleScheduleSubmit}
          alert={{
            id: selectedProduct.id,
            product: selectedProduct.name,
            shelf: selectedProduct.shelf,
            urgency: selectedProduct.status === "critical" ? "high" as const : 
                     selectedProduct.status === "low" ? "medium" as const : "low" as const,
            prediction: selectedProduct.prediction
          }}
        />
      )}
    </div>
  );
};
