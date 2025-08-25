import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface AlertFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export const AlertFilters = ({ filter, setFilter }: AlertFiltersProps) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        All Active
      </Button>
      <Button 
        variant={filter === "high" ? "destructive" : "outline"}
        onClick={() => setFilter("high")}
      >
        Critical
      </Button>
      <Button 
        variant={filter === "medium" ? "secondary" : "outline"}
        onClick={() => setFilter("medium")}
      >
        Medium
      </Button>
      <Button 
        variant={filter === "low" ? "default" : "outline"}
        onClick={() => setFilter("low")}
      >
        Low Priority
      </Button>
    </div>
  );
};
