import type { Express } from "express";
import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { classes, bookings, users } from "../db/schema";
import { startOfWeek, endOfWeek } from "date-fns";

export function registerRoutes(app: Express) {
  // Get classes for the current week
  app.get("/api/classes", async (req, res) => {
    try {
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      
      const result = await db.query.classes.findMany({
        where: and(
          gte(classes.startTime, start),
          lte(classes.startTime, end)
        ),
        orderBy: classes.startTime
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

  // Get bookings with user data
  app.get("/api/bookings", async (req, res) => {
    try {
      const result = await db.query.bookings.findMany({
        with: {
          user: true,
          class: true
        }
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const { classId } = req.body;
      const userId = 1; // TODO: Get from session

      const result = await db.insert(bookings).values({
        userId,
        classId,
        status: "confirmed"
      }).returning();

      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Initialize sample classes
  app.post("/api/init-classes", async (req, res) => {
    try {
      const result = await db.insert(classes).values([
        {
          name: "Yoga Flow",
          description: "A dynamic yoga class focusing on fluid movements and breath coordination. Perfect for all levels.",
          instructor: "Sarah Chen",
          capacity: 15,
          startTime: new Date("2024-11-18T09:00:00"),
          endTime: new Date("2024-11-18T10:00:00")
        },
        {
          name: "HIIT Training",
          description: "High-intensity interval training combining cardio and strength exercises for maximum results.",
          instructor: "Marcus Rodriguez",
          capacity: 20,
          startTime: new Date("2024-11-19T17:00:00"),
          endTime: new Date("2024-11-19T18:00:00")
        },
        {
          name: "Pilates Basics",
          description: "Introduction to core-strengthening Pilates movements. Suitable for beginners.",
          instructor: "Emma Thompson",
          capacity: 15,
          startTime: new Date("2024-11-20T12:00:00"),
          endTime: new Date("2024-11-20T13:00:00")
        },
        {
          name: "Strength Training",
          description: "Full-body workout focusing on building strength and muscle endurance.",
          instructor: "James Wilson",
          capacity: 18,
          startTime: new Date("2024-11-21T16:00:00"),
          endTime: new Date("2024-11-21T17:00:00")
        },
        {
          name: "Dance Fitness",
          description: "Fun cardio workout combining dance moves with fitness exercises.",
          instructor: "Maria Garcia",
          capacity: 20,
          startTime: new Date("2024-11-22T18:00:00"),
          endTime: new Date("2024-11-22T19:00:00")
        }
      ]).returning();
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize classes" });
    }
  });
}
