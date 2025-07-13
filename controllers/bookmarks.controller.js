import Bookmark from "../models/bookmark.model.js";

export const createBookmark = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });

    const bookmark = await Bookmark.create({
      user: req.user.id,
      url,
      title,
      description,
      tags,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let filter = { user: req.user.id };

    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    if (tags) filter.tags = { $in: tags.split(",") };

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!bookmark)
      return res.status(404).json({ message: "Bookmark not found" });

    res.status(200).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateBookmark = async (req, res) => {
  try {
    const updated = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Bookmark not found or unauthorized" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const deleted = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Bookmark not found or unauthorized" });

    res.status(200).json({ message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
