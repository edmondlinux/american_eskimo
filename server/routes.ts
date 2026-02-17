import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendInquiryEmail, generateAdminEmailHtml, generateUserEmailHtml } from "./email";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "puppies",
    allowed_formats: ["jpg", "png", "jpeg"],
  } as any,
});

const upload = multer({ storage: uploadStorage });

function parseBool(v: unknown): boolean | undefined {
  if (v === undefined) return undefined;
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  return undefined;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Image Upload Route
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: (req.file as any).path });
  });

  // Auth placeholder
  app.get("/api/me", async (_req, res) => {
    const user = await storage.getCurrentUser();
    res.json(user);
  });

  // Puppies
  app.get(api.puppies.list.path, async (req, res) => {
    const availableOnly = parseBool((req.query as any)?.availableOnly);
    const rows = await storage.listPuppies({ availableOnly });
    // Use the actual imageUrl from the database if present, otherwise fallback to placeholder
    const withImages = rows.map(p => ({
      ...p,
      imageUrl: p.imageUrl || "/images/puppy-card.jpg"
    }));
    res.json(withImages);
  });

  app.get(api.puppies.get.path, async (req, res) => {
    const puppy = await storage.getPuppy(String(req.params.id));
    if (!puppy) {
      return res.status(404).json({ message: "Puppy not found" });
    }
    res.json({
      ...puppy,
      imageUrl: puppy.imageUrl || "/images/puppy-card.jpg"
    });
  });

  app.post(api.puppies.create.path, async (req, res) => {
    try {
      const input = api.puppies.create.input.parse(req.body);
      const created = await storage.createPuppy(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.put(api.puppies.update.path, async (req, res) => {
    try {
      const updates = api.puppies.update.input.parse(req.body);
      const updated = await storage.updatePuppy(String(req.params.id), updates);
      if (!updated) {
        return res.status(404).json({ message: "Puppy not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.delete(api.puppies.delete.path, async (req, res) => {
    const ok = await storage.deletePuppy(String(req.params.id));
    if (!ok) {
      return res.status(404).json({ message: "Puppy not found" });
    }
    res.status(204).send();
  });

  // Inquiries
  app.get(api.inquiries.list.path, async (_req, res) => {
    const rows = await storage.listInquiries();
    res.json(rows);
  });

  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const created = await storage.createInquiry(input);

      // Send emails asynchronously
      (async () => {
        try {
          const puppy = input.selectedPuppyId ? await storage.getPuppy(input.selectedPuppyId) : null;
          const puppyName = puppy ? puppy.name : null;

          // Notify Admin
          if (process.env.ADMIN_EMAIL) {
            await sendInquiryEmail({
              to: process.env.ADMIN_EMAIL,
              subject: `New Inquiry from ${input.fullName}`,
              content: generateAdminEmailHtml(input, puppyName),
            });
          }

          // Notify User
          await sendInquiryEmail({
            to: input.email,
            subject: "We've received your inquiry — American Eskimo",
            content: generateUserEmailHtml(input, puppyName),
          });
        } catch (emailErr) {
          console.error("Failed to send inquiry emails:", emailErr);
        }
      })();

      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  // Reviews
  app.get(api.reviews.list.path, async (_req, res) => {
    const rows = await storage.listReviews();
    res.json(rows);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const input = api.reviews.create.input.parse(req.body);
      const created = await storage.createReview(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.put(api.reviews.update.path, async (req, res) => {
    try {
      const updates = api.reviews.update.input.parse(req.body);
      const updated = await storage.updateReview(String(req.params.id), updates);
      if (!updated) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.delete(api.reviews.delete.path, async (req, res) => {
    const ok = await storage.deleteReview(String(req.params.id));
    if (!ok) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(204).send();
  });

  return httpServer;
}
