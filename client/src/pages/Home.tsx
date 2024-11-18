import { useState } from "react";
import useSWR from "swr";
import WeeklyCalendar from "../components/WeeklyCalendar";
import NavBar from "../components/NavBar";
import BookingModal from "../components/BookingModal";
import type { Class } from "db/schema";

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const { data: classes } = useSWR<Class[]>("/api/classes");

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Class Schedule</h1>
            <p className="text-muted-foreground mt-2">
              Book your favorite classes for the week
            </p>
          </div>
          
          <WeeklyCalendar 
            classes={classes || []} 
            onClassSelect={setSelectedClass}
          />
        </div>
      </main>

      <BookingModal
        classData={selectedClass}
        open={!!selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  );
}
