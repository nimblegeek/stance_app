import type { Express } from "express";
import { eq, and } from "drizzle-orm";
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
          eq(classes.startTime >= start),
          eq(classes.startTime <= end)
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
}
