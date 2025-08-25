import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, TrendingUp, Clock, AlertTriangle, Truck, BarChart3, Zap, MapPin } from "lucide-react";
import { InventoryChart } from "@/components/InventoryChart";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { ProductGrid } from "@/components/ProductGrid";
import { AlertsPanel } from "@/components/AlertsPanel";
import { DeliveryTracker } from "@/components/DeliveryTracker";

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

interface AlertItem {
  id: number;
  product: string;
  shelf: string;
  urgency: "high" | "medium" | "low";
  prediction: string;
  productId: number;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Coca Cola 12pk",
    shelf: "A3",
    currentStock: 12,
    maxCapacity: 48,
    sensor: "RFID",
    status: "critical",
    lastUpdate: "2 min ago",
    prediction: "Stock out in 2 hours"
  },
  {
    id: 2,
    name: "Wonder Bread",
    shelf: "B7",
    currentStock: 8,
    maxCapacity: 24,
    sensor: "Camera",
    status: "low",
    lastUpdate: "5 min ago",
    prediction: "Restock by 3 PM"
  },
  {
    id: 3,
    name: "Tide Pods",
    shelf: "C2",
    currentStock: 15,
    maxCapacity: 20,
    sensor: "RFID",
    status: "good",
    lastUpdate: "1 min ago",
    prediction: "Monitor for weekend"
  },
  {
    id: 4,
    name: "Parle-G Biscuits",
    shelf: "D1",
    currentStock: 5,
    maxCapacity: 30,
    sensor: "Camera",
    status: "critical",
    lastUpdate: "3 min ago",
    prediction: "Popular item - urgent restock"
  },
  {
    id: 5,
    name: "Amul Milk 1L",
    shelf: "E5",
    currentStock: 6,
    maxCapacity: 32,
    sensor: "RFID",
    status: "critical",
    lastUpdate: "1 min ago",
    prediction: "Urgent restock needed"
  },
  {
    id: 6,
    name: "Haldiram's Bhujia",
    shelf: "F8",
    currentStock: 18,
    maxCapacity: 24,
    sensor: "Camera",
    status: "good",
    lastUpdate: "4 min ago",
    prediction: "Restock tomorrow"
  },
  {
    id: 7,
    name: "Britannia Marie Gold",
    shelf: "G1",
    currentStock: 3,
    maxCapacity: 16,
    sensor: "RFID",
    status: "critical",
    lastUpdate: "1 min ago",
    prediction: "Stock out by noon"
  },
  {
    id: 8,
    name: "Tata Tea Premium",
    shelf: "H4",
    currentStock: 22,
    maxCapacity: 30,
    sensor: "Camera",
    status: "good",
    lastUpdate: "2 min ago",
    prediction: "Weekly restock cycle"
  },
  {
    id: 9,
    name: "Maggi 2-Minute Noodles",
    shelf: "I6",
    currentStock: 7,
    maxCapacity: 36,
    sensor: "RFID",
    status: "low",
    lastUpdate: "3 min ago",
    prediction: "High demand item"
  },
  {
    id: 10,
    name: "Patanjali Honey",
    shelf: "J3",
    currentStock: 14,
    maxCapacity: 20,
    sensor: "Camera",
    status: "good",
    lastUpdate: "5 min ago",
    prediction: "Stable inventory"
  },
  {
    id: 11,
    name: "Thums Up 600ml",
    shelf: "K2",
    currentStock: 4,
    maxCapacity: 42,
    sensor: "RFID",
    status: "critical",
    lastUpdate: "1 min ago",
    prediction: "Critical - restock ASAP"
  },
  {
    id: 12,
    name: "Dabur Chyawanprash",
    shelf: "L9",
    currentStock: 11,
    maxCapacity: 18,
    sensor: "Camera",
    status: "good",
    lastUpdate: "4 min ago",
    prediction: "Seasonal demand stable"
  },
  {
    id: 13,
    name: "Mother Dairy Paneer",
    shelf: "M1",
    currentStock: 8,
    maxCapacity: 25,
    sensor: "RFID",
    status: "low",
    lastUpdate: "2 min ago",
    prediction: "Weekend demand spike"
  },
  {
    id: 14,
    name: "Kurkure Masala Munch",
    shelf: "N5",
    currentStock: 16,
    maxCapacity: 20,
    sensor: "Camera",
    status: "good",
    lastUpdate: "6 min ago",
    prediction: "Maintain current level"
  },
  {
    id: 15,
    name: "Colgate Strong Teeth",
    shelf: "O7",
    currentStock: 2,
    maxCapacity: 12,
    sensor: "RFID",
    status: "critical",
    lastUpdate: "1 min ago",
    prediction: "Emergency restock needed"
  },
  {
    id: 16,
    name: "Good Day Cookies",
    shelf: "P4",
    currentStock: 12,
    maxCapacity: 24,
    sensor: "Camera",
    status: "good",
    lastUpdate: "3 min ago",
    prediction: "Popular evening snack"
  },
  {
    id: 17,
    name: "Real Fruit Juice",
    shelf: "Q8",
    currentStock: 6,
    maxCapacity: 20,
    sensor: "RFID",
    status: "low",
    lastUpdate: "2 min ago",
    prediction: "Summer demand increasing"
  },
  {
    id: 18,
    name: "MDH Garam Masala",
    shelf: "R3",
    currentStock: 19,
    maxCapacity: 24,
    sensor: "Camera",
    status: "good",
    lastUpdate: "4 min ago",
    prediction: "Essential cooking item"
  }
];

const predictions = [
  "Stock out in 2 hours",
  "Restock by 3 PM",
  "Monitor for weekend",
  "Stable until Thursday",
  "Urgent restock needed",
  "Restock tomorrow",
  "Stock out by noon",
  "Weekly restock cycle",
  "Restock by evening",
  "Stable inventory",
  "Critical - restock ASAP",
  "Restock next week",
  "Weekend demand spike",
  "Maintain current level",
  "Emergency restock needed",
  "Monitor closely",
  "Seasonal demand increase",
  "Normal consumption rate",
  "Peak hours approaching",
  "Bulk purchase detected"
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate alerts from products
  useEffect(() => {
    const newAlerts: AlertItem[] = products
      .filter(product => product.status === "critical" || product.status === "low")
      .map(product => ({
        id: product.id,
        product: product.name,
        shelf: product.shelf,
        urgency: product.status === "critical" ? "high" as const : 
                 product.status === "low" ? "medium" as const : "low" as const,
        prediction: product.prediction,
        productId: product.id
      }));
    setAlerts(newAlerts);
  }, [products]);

  // Simulate product data changes every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => 
        prevProducts.map(product => {
          // Simulate stock changes (-3 to +2 units)
          const stockChange = Math.floor(Math.random() * 6) - 3;
          let newStock = Math.max(0, Math.min(product.maxCapacity, product.currentStock + stockChange));
          
          // Determine new status based on stock percentage
          const stockPercentage = (newStock / product.maxCapacity) * 100;
          let newStatus: "critical" | "low" | "good" = "good";
          if (stockPercentage <= 20) {
            newStatus = "critical";
          } else if (stockPercentage <= 40) {
            newStatus = "low";
          }

          // Random prediction
          const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];

          // Random sensor (occasionally switch)
          const shouldSwitchSensor = Math.random() < 0.1; // 10% chance
          const newSensor = shouldSwitchSensor ? (product.sensor === "RFID" ? "Camera" : "RFID") : product.sensor;

          return {
            ...product,
            currentStock: newStock,
            status: newStatus,
            sensor: newSensor,
            lastUpdate: "Just now",
            prediction: randomPrediction
          };
        })
      );
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = (alertId: number) => {
    // Remove alert
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    
    // Update product status to good and increase stock
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === alertId 
          ? { 
              ...product, 
              status: "good" as const,
              currentStock: Math.min(product.maxCapacity, product.currentStock + Math.floor(product.maxCapacity * 0.7)),
              lastUpdate: "Just resolved",
              prediction: "Recently restocked"
            }
          : product
      )
    );
  };

  const handleScheduleAlert = (alertId: number, scheduleData: any) => {
    console.log('Alert scheduled:', alertId, scheduleData);
    // In a real app, this would integrate with a scheduling system
  };

  const handleContactVendor = (alertId: number, productName: string) => {
    console.log('Vendor contacted for:', productName);
    // This would integrate with email/notification system
  };

  const handleProductStockUpdate = (productId: number, newStock: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { 
              ...product, 
              currentStock: newStock,
              status: newStock <= product.maxCapacity * 0.2 ? "critical" as const :
                     newStock <= product.maxCapacity * 0.4 ? "low" as const :
                     "good" as const,
              lastUpdate: "Just updated",
              prediction: "Stock updated from delivery"
            }
          : product
      )
    );
  };

  const handleProductUpdate = (productId: number, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, ...updates }
          : product
      )
    );
  };

  const stats = [
    { title: "Products Monitored", value: products.length.toString(), icon: Package, change: "+12%" },
    { title: "Prediction Accuracy", value: "94.2%", icon: TrendingUp, change: "+2.1%" },
    { title: "Avg Restock Time", value: "23 min", icon: Clock, change: "-15%" },
    { title: "Stock Efficiency", value: "97.8%", icon: BarChart3, change: "+5.2%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Stocktics
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Predictive Shelf Refill System | {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Active
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <MapPin className="w-3 h-3 mr-1" />
              Store #1247
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 h-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InventoryChart />
              </div>
              <div className="space-y-4">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Critical Alerts</CardTitle>
                    <CardDescription>Immediate attention required</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => (
                      <Alert key={alert.id} className={`border-l-4 ${
                        alert.urgency === 'high' ? 'border-l-red-500 bg-red-50' :
                        alert.urgency === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                        'border-l-blue-500 bg-blue-50'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>{alert.product}</strong> (Shelf {alert.shelf})
                          <br />
                          <span className="text-muted-foreground">{alert.prediction}</span>
                        </AlertDescription>
                      </Alert>
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="products">
            <ProductGrid 
              products={products} 
              onProductUpdate={handleProductUpdate}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel 
              alerts={alerts} 
              onResolve={handleResolveAlert}
              onSchedule={handleScheduleAlert}
              onContact={handleContactVendor}
            />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryTracker 
              products={products}
              onProductUpdate={handleProductStockUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
