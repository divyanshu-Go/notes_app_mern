const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const mongoose = require("mongoose");
const User = require("./Models/user.model");
const Note = require("./Models/notes.model");


mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

// Event listener for successful connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Event listener for disconnection
db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);



app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: true, msg: "FullName is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, msg: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, msg: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      msg: "User already exist",
    });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    msg: "Registration successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, msg: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, msg: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(401).json({ error: true, msg: "User not Found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.status(200).json({
      error: false,
      msg: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      msg: "Invalid Credentials",
    });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.status(404).json({ error: true, msg: "User not Found" });
  }

  return res.status(200).json({
    error: false,
    user: {fullName: isUser.fullName, email:isUser.email, _id:isUser.id, createdOn: isUser.createdOn},
    msg: "User found Successfully",
  });
});

app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res
      .status(200)
      .json({ error: false, notes, msg: "Got ALl Notes Successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
});

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, msg: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: true, msg: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      msg: "Note added successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
      msg: "Internal Server error",
    });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, msg: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, msg: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned !== "undefined") note.isPinned = isPinned;

    await note.save();

    return res
      .status(200)
      .json({ error: false, note, msg: "Note Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, msg: "Note Not Found" });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res
      .status(200)
      .json({ error: false, msg: "Note Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, msg: "Note not found" });
    }

    note.isPinned = isPinned || false;

    await note.save();

    return res
      .status(200)
      .json({ error: false, note, msg: "Note Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Internal Server Error" });
  }
});

app.get("/search-notes/", authenticateToken, async (req, res) => {
  const {user}= req.user;
  const {query}= req.query;

  if(!query){
    return res.status(400).json({error: true, msg: "Search query is Required"})
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        {title: {$regex: new RegExp(query, "i")}},
        {content: {$regex: new RegExp(query, "i")}},
      ],
    });

    return res.json({
      error:false,
      notes:matchingNotes,
      msg:"Notes matching search retrieved successfully"
    })

  } catch (error) {
      return res.status(500).json({
        error:true,
        msg:"Internal Server Error"
      })
  }

});


// Start the server only when MongoDB is connected
const PORT = process.env.PORT || 8000;

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
