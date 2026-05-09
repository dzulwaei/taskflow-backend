/**
 * Task controller.
 * Implements task listing, retrieval, creation, update, and deletion.
 */
import Task from "../models/Task.js";

// Retrieves task list filtered by query params and pagination
export const getTasks = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "all",
      priority = "all",
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 5
    } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (status !== "all") query.status = status;
    if (priority !== "all") query.priority = priority;

    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        limit: limitNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

// Retrieves a single task by ID for the authenticated user
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Creates a new task for the authenticated user
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Title is required");
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Updates an existing task owned by the authenticated user
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Title is required");
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate || null;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// Deletes a task belonging to the authenticated user
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};