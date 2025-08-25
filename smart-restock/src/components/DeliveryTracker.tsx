import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, Clock, MapPin, CheckCircle, AlertTriangle, Plus, ShoppingCart, X } from "lucide-react";
import { sendOrderConfirmationEmail } from "@/services/emailService";

interface DeliveryItem {
  id: number;
  productName: string;
  shelf: string;
  quantity: number;
  supplier: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  status: "ordered" | "processing" | "shipped" | "delivered" | "delayed" | "cancelled";
  trackingNumber?: string;
  priority: "low" | "medium" | "high";
  autoOrdered?: boolean;
}

interface Product {
  id: number;
  name: string;
  shelf: string;
  status: "critical" | "low" | "good";
  currentStock: number;
  maxCapacity: number;
}

interface DeliveryTrackerProps {
  products?: Product[];
  onProductUpdate?: (productId: number, newStock: number) => void;
}

export const DeliveryTracker = ({ products = [], onProductUpdate }: DeliveryTrackerProps) => {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([
    {
      id: 1,
      productName: "Coca Cola 12pk",
      shelf: "A3",
      quantity: 48,
      supplier: "Coca Cola Distributor",
      orderDate: "2024-01-10",
      estimatedDelivery: "2024-01-12",
      status: "shipped",
      trackingNumber: "CC123456789",
      priority: "high",
      autoOrdered: true
    },
    {
      id: 2,
      productName: "Wonder Bread",
      shelf: "B7",
      quantity: 24,
      supplier: "Wonder Bread Supplier",
      orderDate: "2024-01-11",
      estimatedDelivery: "2024-01-13",
      status: "processing",
      priority: "medium"
    },
    {
      id: 3,
      productName: "Milk 2% Gallon",
      shelf: "E5",
      quantity: 32,
      supplier: "Dairy Supply Chain",
      orderDate: "2024-01-09",
      estimatedDelivery: "2024-01-11",
      actualDelivery: "2024-01-11",
      status: "delivered",
      trackingNumber: "DSC987654321",
      priority: "high",
      autoOrdered: true
    }
  ]);

  const { toast } = useToast();

  // Auto-order functionality for critical/low stock items
  const handleAutoOrder = async (product: Product) => {
    const orderQuantity = Math.ceil(product.maxCapacity * 0.8); // Order 80% of max capacity
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2); // 2 days delivery

    const newDelivery: DeliveryItem = {
      id: Date.now(),
      productName: product.name,
      shelf: product.shelf,
      quantity: orderQuantity,
      supplier: getSupplierForProduct(product.name),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      status: "ordered",
      priority: product.status === "critical" ? "high" : "medium",
      autoOrdered: true
    };

    setDeliveries(prev => [newDelivery, ...prev]);

    // Send email notification
    await sendOrderConfirmationEmail({
      productName: product.name,
      shelf: product.shelf,
      quantity: orderQuantity,
      urgency: product.status,
      estimatedDelivery: estimatedDelivery.toDateString()
    });

    toast({
      title: "Auto-Order Placed",
      description: `Ordered ${orderQuantity} units of ${product.name} for delivery on ${estimatedDelivery.toDateString()}`,
    });
  };

  const handleManualOrder = () => {
    toast({
      title: "Manual Order",
      description: "Manual ordering form would open here (integrate with your ordering system)",
    });
  };

  const markAsDelivered = (deliveryId: number) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: "delivered" as const,
          actualDelivery: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    }));

    // Update product stock if callback provided
    if (onProductUpdate) {
      const product = products.find(p => p.name === delivery.productName);
      if (product) {
        const newStock = Math.min(product.maxCapacity, product.currentStock + delivery.quantity);
        onProductUpdate(product.id, newStock);
        
        toast({
          title: "Delivery Confirmed",
          description: `Stock updated: ${delivery.productName} now has ${newStock}/${product.maxCapacity} units`,
        });
      }
    } else {
      toast({
        title: "Delivery Confirmed",
        description: "Product has been marked as delivered",
      });
    }
  };

  const cancelOrder = (deliveryId: number) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    if (delivery.status === "delivered") {
      toast({
        title: "Cannot Cancel",
        description: "Order has already been delivered",
        variant: "destructive"
      });
      return;
    }

    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: "cancelled" as const
        };
      }
      return d;
    }));

    toast({
      title: "Order Cancelled",
      description: `Order for ${delivery.productName} has been cancelled`,
      variant: "destructive"
    });
  };

  const getSupplierForProduct = (productName: string): string => {
    const supplierMap: { [key: string]: string } = {
      "Coca Cola 12pk": "Coca Cola Distributor",
      "Wonder Bread": "Wonder Bread Supplier",
      "Tide Pods": "P&G Products",
      "Bananas (lb)": "Fresh Produce Co",
      "Milk 2% Gallon": "Dairy Supply Chain",
      "Doritos Nacho": "Frito-Lay Distribution",
      "Cheerios Family Size": "General Mills",
      "iPhone Chargers": "Electronics Wholesale"
    };
    return supplierMap[productName] || "Generic Supplier";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "default";
      case "shipped": return "secondary";
      case "processing": return "outline";
      case "delayed": return "destructive";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "ordered": return 25;
      case "processing": return 50;
      case "shipped": return 75;
      case "delivered": return 100;
      case "delayed": return 40;
      case "cancelled": return 0;
      default: return 0;
    }
  };

  const criticalProducts = products.filter(p => p.status === "critical" || p.status === "low");
  const pendingDeliveries = deliveries.filter(d => d.status !== "delivered" && d.status !== "cancelled");
  const completedDeliveries = deliveries.filter(d => d.status === "delivered");
  const cancelledDeliveries = deliveries.filter(d => d.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Auto-Order Section for Critical Items */}
      {criticalProducts.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Auto-Order Recommendations
            </CardTitle>
            <CardDescription>
              Products requiring immediate ordering based on AI predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {criticalProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-red-900">{product.name}</strong>
                      <Badge variant="destructive" className="text-xs">
                        {product.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700">
                      Shelf {product.shelf} • Stock: {product.currentStock}/{product.maxCapacity}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleAutoOrder(product)}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Auto-Order
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({completedDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancelled ({cancelledDeliveries.length})
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={handleManualOrder} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Manual Order
          </Button>
        </div>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{delivery.productName}</h3>
                        {delivery.autoOrdered && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Auto-Ordered
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shelf {delivery.shelf} • {delivery.quantity} units • {delivery.supplier}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                      <Badge variant="outline" className={`${
                        delivery.priority === 'high' ? 'border-red-500 text-red-700' :
                        delivery.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                        'border-blue-500 text-blue-700'
                      }`}>
                        {delivery.priority} priority
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Delivery Progress</span>
                        <span>{getStatusProgress(delivery.status)}%</span>
                      </div>
                      <Progress value={getStatusProgress(delivery.status)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span>Ordered: {new Date(delivery.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span>Est. Delivery: {new Date(delivery.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {delivery.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>Tracking: {delivery.trackingNumber}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {delivery.status === "shipped" && (
                        <Button 
                          onClick={() => markAsDelivered(delivery.id)}
                          className="flex-1"
                          size="sm"
                        >
                          Mark as Delivered
                        </Button>
                      )}
                      {delivery.status !== "delivered" && (
                        <Button 
                          onClick={() => cancelOrder(delivery.id)}
                          variant="destructive"
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm opacity-75">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{delivery.productName}</h3>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shelf {delivery.shelf} • {delivery.quantity} units delivered
                      </p>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>Ordered: {new Date(delivery.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Delivered: {delivery.actualDelivery ? new Date(delivery.actualDelivery).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled">
          <div className="grid gap-4">
            {cancelledDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm opacity-60">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg line-through text-muted-foreground">{delivery.productName}</h3>
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shelf {delivery.shelf} • {delivery.quantity} units cancelled
                      </p>
                    </div>
                    <Badge variant="destructive">Cancelled</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>Ordered: {new Date(delivery.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-600" />
                      <span>Cancelled: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
