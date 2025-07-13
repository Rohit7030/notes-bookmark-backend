import Note from "../models/note.model.js";

export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      tags,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = { user: req.user.id };

    if (q) filter.title = { $regex: q, $options: "i" };
    if (tags) filter.tags = { $in: tags.split(",") };

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found or unauthorized" });

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Note not found or unauthorized" });

    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
