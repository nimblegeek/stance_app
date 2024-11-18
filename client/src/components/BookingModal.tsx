import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import type { Class } from "db/schema";
import { format } from "date-fns";
import { mutate } from "swr";

interface BookingModalProps {
  classData: Class | null;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ classData, open, onClose }: BookingModalProps) {
  const { toast } = useToast();

  if (!classData) return null;

  const handleBooking = async () => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: classData.id }),
      });

      if (!response.ok) throw new Error("Failed to book class");

      toast({
        title: "Success!",
        description: "You have successfully booked the class.",
      });

      mutate("/api/bookings");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book the class. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classData.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Instructor</h4>
            <p className="text-sm text-muted-foreground">{classData.instructor}</p>
          </div>

          <div>
            <h4 className="font-medium">Time</h4>
            <p className="text-sm text-muted-foreground">
              {format(new Date(classData.startTime), "PPP p")} - 
              {format(new Date(classData.endTime), "p")}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{classData.description}</p>
          </div>

          <Button onClick={handleBooking} className="w-full">
            Book Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
