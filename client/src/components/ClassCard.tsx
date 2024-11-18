import { format } from "date-fns";
import { Card } from "./ui/card";
import { Avatar, AvatarGroup } from "./ui/avatar";
import { Progress } from "./ui/progress";
import type { Class } from "db/schema";
import type { BookingWithClass } from "../lib/types";
import { User } from "lucide-react";

interface ClassCardProps {
  classData: Class;
  bookings?: BookingWithClass[];
  onClick?: () => void;
  compact?: boolean;
}

export default function ClassCard({ 
  classData, 
  bookings = [], 
  onClick,
  compact = false 
}: ClassCardProps) {
  const bookedCount = bookings.length;
  const capacityPercentage = (bookedCount / classData.capacity) * 100;
  const remainingSpots = classData.capacity - bookedCount;

  const startTime = new Date(classData.startTime);
  const endTime = new Date(classData.endTime);

  if (compact) {
    return (
      <Card
        className="p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-sm">{classData.name}</h4>
            <p className="text-xs text-muted-foreground">
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{classData.instructor}</p>
          <AvatarGroup className="justify-end">
            {bookings.slice(0, 3).map((booking, idx) => (
              <Avatar
                key={booking.id || idx}
                className="w-6 h-6 border-2 border-background"
                src={booking.user?.avatarUrl}
                fallback={<User className="w-4 h-4" />}
              />
            ))}
          </AvatarGroup>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{classData.name}</h3>
          <p className="text-sm text-muted-foreground">
            {format(startTime, "EEEE, MMMM d")}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{classData.instructor}</p>
          <p className="text-xs text-muted-foreground">Instructor</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {remainingSpots} spots remaining
          </span>
          <span className="font-medium">
            {bookedCount}/{classData.capacity}
          </span>
        </div>
        
        <Progress value={capacityPercentage} className="h-2" />

        <div className="flex justify-between items-center pt-2">
          <p className="text-sm text-muted-foreground">Attendees</p>
          <AvatarGroup>
            {bookings.slice(0, 5).map((booking, idx) => (
              <Avatar
                key={booking.id || idx}
                className="w-8 h-8 border-2 border-background"
                src={booking.user?.avatarUrl}
                fallback={<User className="w-4 h-4" />}
              />
            ))}
            {bookedCount > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                +{bookedCount - 5}
              </div>
            )}
          </AvatarGroup>
        </div>
      </div>
    </Card>
  );
}
