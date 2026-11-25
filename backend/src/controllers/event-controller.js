import mongoose from "mongoose";
import { Event } from "../models/event-model.js";
import { todayStart } from "../utils/date.js";

const editableFields = ["title", "category", "capacity", "date", "time", "location", "description"];
const protectedFields = ["_id", "createdAt", "updatedAt", "__v"];

function notFound(res) {
  return res.status(404).json({ error: { message: "Event not found" } });
}

export async function getEvents(req, res, next) {
  try {
    const { category, search } = req.query;
    if ([category, search].some((value) => value !== undefined && typeof value !== "string")) {
      return res.status(400).json({ error: { message: "category and search must be strings" } });
    }
    const filter = category ? { category } : {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escaped, $options: "i" };
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return notFound(res);
    }
    const event = await Event.findById(req.params.id);
    if (!event) {
      return notFound(res);
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
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

export async function getUpcomingEvents(req, res, next) {
  try {
    const events = await Event.find({ date: { $gte: todayStart() } }).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);

    const body = req.body ?? {};
    if (typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: { message: "Event body must be an object" } });
    }
    const keys = Object.keys(body);
    if (keys.length === 0) {
      return res.status(400).json({ error: { message: "Body is empty" } });
    }
    const protectedKeys = keys.filter((key) => protectedFields.includes(key));
    if (protectedKeys.length) {
      return res.status(400).json({
        error: { message: `${protectedKeys.join(", ")} cannot be changed` },
      });
    }
    if (keys.some((key) => !editableFields.includes(key))) {
      return res.status(400).json({ error: { message: "Unknown or unsupported update field" } });
    }
    const event = await Event.findByIdAndUpdate(req.params.id, { $set: body }, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return notFound(res);
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return notFound(res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
