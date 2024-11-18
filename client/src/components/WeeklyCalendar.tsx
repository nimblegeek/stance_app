import { useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card } from "./ui/card";
import { Avatar, AvatarGroup } from "./ui/avatar";
import { Progress } from "./ui/progress";
import type { Class } from "db/schema";
import useSWR from "swr";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface WeeklyCalendarProps {
  classes: Class[];
  onClassSelect: (classData: Class) => void;
}

export default function WeeklyCalendar({ classes, onClassSelect }: WeeklyCalendarProps) {
  const startDate = useMemo(() => startOfWeek(new Date()), []);
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(startDate, i)),
    [startDate]
  );

  const { data: bookings } = useSWR("/api/bookings");

  const getClassesForDay = (date: Date) => {
    return classes.filter(c => 
      format(new Date(c.startTime), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getBookingsForClass = (classId: string) => {
    return bookings?.filter(b => b.classId === classId) || [];
  };

  const getCapacityColor = (bookedCount: number, capacity: number) => {
    const percentage = (bookedCount / capacity) * 100;
    if (bookedCount >= capacity) return "bg-red-200";
    if (percentage >= 80) return "bg-yellow-200";
    return "bg-green-200";
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="space-y-2">
          <div className="text-center">
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-sm text-muted-foreground">{format(day, "d")}</div>
          </div>
          
          <div className="space-y-2">
            {getClassesForDay(day).map((classItem) => {
              const classBookings = getBookingsForClass(classItem.id);
              const bookedCount = classBookings.length;
              const remainingSpots = classItem.capacity - bookedCount;
              
              return (
                <Card
                  key={classItem.id}
                  className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${getCapacityColor(bookedCount, classItem.capacity)}`}
                  onClick={() => onClassSelect(classItem)}
                >
                  <div className="text-sm font-medium mb-1">{classItem.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {format(new Date(classItem.startTime), "HH:mm")}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Progress 
                      value={(bookedCount / classItem.capacity) * 100} 
                      className="h-1.5" 
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {remainingSpots} left
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AvatarGroup className="-space-x-2">
                              {classBookings.slice(0, 3).map((booking) => (
                                <Avatar
                                  key={booking.id}
                                  className="w-6 h-6 border-2 border-background ring-2 ring-background"
                                  src={booking.user?.avatarUrl}
                                  fallback={<User className="w-3 h-3" />}
                                />
                              ))}
                              {bookedCount > 3 && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-[10px] font-medium text-primary-foreground border-2 border-background ring-2 ring-background">
                                  +{bookedCount - 3}
                                </div>
                              )}
                            </AvatarGroup>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{bookedCount} attendees</p>
                            <p className="text-xs text-muted-foreground">
                              {remainingSpots} spots remaining
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
