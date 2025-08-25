import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertStats } from "./alerts/AlertStats";
import { AlertFilters } from "./alerts/AlertFilters";
import { AlertsList } from "./alerts/AlertsList";
import { ScheduleModal } from "./alerts/ScheduleModal";
import { ContactModal } from "./alerts/ContactModal";
import { sendContactEmail, sendScheduleEmail } from "../services/emailService";

interface AlertItem {
  id: number;
  product: string;
  shelf: string;
  urgency: "high" | "medium" | "low";
  prediction: string;
}

interface AlertsPanelProps {
  alerts: AlertItem[];
  onResolve: (alertId: number) => void;
  onSchedule: (alertId: number, scheduleData: any) => void;
  onContact: (alertId: number, productName: string) => void;
}

export const AlertsPanel = ({ alerts, onResolve, onSchedule, onContact }: AlertsPanelProps) => {
  const [filter, setFilter] = useState("all");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const { toast } = useToast();

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    return alert.urgency === filter;
  });

  const handleResolve = (alertId: number) => {
    onResolve(alertId);
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });
  };

  const handleSchedule = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (scheduleData: any) => {
    onSchedule(scheduleData.alertId, scheduleData);
    
    // Send email notification
    if (selectedAlert) {
      const emailSent = await sendScheduleEmail({
        productName: selectedAlert.product,
        shelf: selectedAlert.shelf,
        date: scheduleData.date,
        time: scheduleData.time,
        priority: scheduleData.priority,
        assignedTo: scheduleData.assignedTo,
        notes: scheduleData.notes
      });

      toast({
        title: emailSent ? "Restock Scheduled & Email Sent" : "Restock Scheduled",
        description: emailSent 
          ? `Restocking scheduled for ${selectedAlert?.product} and notification sent to assigned team member.`
          : `Restocking scheduled for ${selectedAlert?.product}. Email notification failed.`,
      });
    }
  };

  const handleContactClick = (alertId: number, productName: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setContactModalOpen(true);
    }
  };

  const handleContactSubmit = async (contactData: any) => {
    onContact(contactData.alertId, selectedAlert?.product || "");
    
    // Send email to vendor
    if (selectedAlert) {
      const emailSent = await sendContactEmail({
        productName: selectedAlert.product,
        shelf: selectedAlert.shelf,
        urgency: selectedAlert.urgency,
        prediction: selectedAlert.prediction,
        vendorName: contactData.vendorName || "Vendor"
      });

      toast({
        title: emailSent ? "Vendor Contacted Successfully" : "Contact Request Processed",
        description: emailSent 
          ? `Email sent to ${contactData.vendorName} for ${selectedAlert.product} restock.`
          : `Contact request logged for ${selectedAlert.product}. Email delivery failed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <AlertStats alerts={alerts} />
      <AlertFilters filter={filter} setFilter={setFilter} />
      <AlertsList 
        filteredAlerts={filteredAlerts}
        onResolve={handleResolve}
        onSchedule={handleSchedule}
        onContact={handleContactClick}
      />
      
      {selectedAlert && (
        <>
          <ScheduleModal
            isOpen={scheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            onSchedule={handleScheduleSubmit}
            alert={selectedAlert}
          />
          
          <ContactModal
            isOpen={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
            onContact={handleContactSubmit}
            alert={selectedAlert}
          />
        </>
      )}
    </div>
  );
};
