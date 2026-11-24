import mongoose from "mongoose";
import { Event } from "../models/event-model.js";

export async function getEvents(req, res, next) {
  try {
    const { category } = req.query;
    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ error: { message: "category must be a string" } });
    }
    const filter = category ? { category } : {};
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const body = req.body ?? {};
    if (typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: { message: "Event body must be an object" } });
    }
    const { title, category, capacity, date, time, location, description } = body;
    const event = await Event.create({
      title, category, capacity, date, time, location, description,
    });
    res.status(201).json(event);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}
