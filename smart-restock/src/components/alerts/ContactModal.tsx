import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Building2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContact: (contactData: any) => void;
  alert: {
    id: number;
    product: string;
    shelf: string;
    urgency: "high" | "medium" | "low";
    prediction: string;
  };
}

export const ContactModal = ({ isOpen, onClose, onContact, alert }: ContactModalProps) => {
  const [contactData, setContactData] = useState({
    vendor: "",
    message: "",
    priority: alert.urgency as "high" | "medium" | "low"
  });

  const vendors = [
    { value: "coca-cola", label: "Coca Cola Distributor", contact: "orders@cocacola-dist.com" },
    { value: "wonder-bread", label: "Wonder Bread Supplier", contact: "restock@wonderbread.com" },
    { value: "pg", label: "P&G Products", contact: "wholesale@pg.com" },
    { value: "fresh-produce", label: "Fresh Produce Co", contact: "orders@freshproduce.com" },
    { value: "dairy", label: "Dairy Supply Chain", contact: "urgent@dairychain.com" },
    { value: "frito-lay", label: "Frito-Lay Distribution", contact: "restock@fritolay.com" },
    { value: "general-mills", label: "General Mills", contact: "orders@generalmills.com" },
    { value: "electronics", label: "Electronics Wholesale", contact: "tech@electronicswholesale.com" },
    { value: "britannia", label: "Britannia Industries", contact: "orders@britannia.com" },
    { value: "parle", label: "Parle Products", contact: "supply@parle.com" },
    { value: "amul", label: "Amul Dairy", contact: "restock@amul.com" },
    { value: "tata", label: "Tata Consumer Products", contact: "orders@tata.com" },
    { value: "haldiram", label: "Haldiram's", contact: "wholesale@haldirams.com" },
    { value: "patanjali", label: "Patanjali Ayurved", contact: "orders@patanjali.com" }
  ];

  const handleSubmit = () => {
    const selectedVendor = vendors.find(v => v.value === contactData.vendor);
    onContact({
      alertId: alert.id,
      ...contactData,
      vendorEmail: selectedVendor?.contact,
      vendorName: selectedVendor?.label
    });
    onClose();
    setContactData({
      vendor: "",
      message: "",
      priority: alert.urgency
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Vendor
          </DialogTitle>
          <DialogDescription>
            Request restock for <strong>{alert.product}</strong> on shelf {alert.shelf}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Select Vendor</Label>
            <Select value={contactData.vendor} onValueChange={(value) => setContactData(prev => ({ ...prev, vendor: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose vendor..." />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.value} value={vendor.value}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {vendor.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Request Priority</Label>
            <Select value={contactData.priority} onValueChange={(value: "high" | "medium" | "low") => setContactData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority - Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Vendor</Label>
            <Textarea
              id="message"
              placeholder="Add specific requirements, quantity needed, or special instructions for the vendor..."
              value={contactData.message}
              onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border">
            <p className="text-sm font-medium text-slate-700 mb-1">Current Situation:</p>
            <p className="text-sm text-slate-600">{alert.prediction}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!contactData.vendor}
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Send to Vendor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
