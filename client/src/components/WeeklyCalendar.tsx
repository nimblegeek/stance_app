import { useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card } from "./ui/card";
import { Avatar, AvatarGroup } from "./ui/avatar";
import type { Class } from "db/schema";
import useSWR from "swr";

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

  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="space-y-2">
          <div className="text-center">
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-sm text-muted-foreground">{format(day, "d")}</div>
          </div>
          
          <div className="space-y-2">
            {getClassesForDay(day).map((classItem) => (
              <Card
                key={classItem.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onClassSelect(classItem)}
              >
                <div className="text-sm font-medium">{classItem.name}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(classItem.startTime), "HH:mm")}
                </div>
                <AvatarGroup>
                  {getBookingsForClass(classItem.id).map((booking) => (
                    <Avatar
                      key={booking.id}
                      className="w-6 h-6"
                      src={booking.user?.avatarUrl}
                    />
                  ))}
                </AvatarGroup>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
