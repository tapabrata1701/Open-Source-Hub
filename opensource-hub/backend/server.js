require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const rateLimit = require("express-rate-limit");

const User = require("./models/User");
const Project = require("./models/Project");

const app = express();

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX || 200), // Limit each IP; allow higher for local dev
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// We need rawBody for Webhook Signature Verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (
        req.originalUrl.startsWith("/api/webhooks") ||
        req.originalUrl === "/webhook"
      ) {
        req.rawBody = buf.toString();
      }
    },
  }),
);
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "oshub-secret-dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/oshub")
  .then(() => console.log("MongoDB Connected to OSHub DB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- Passport GitHub Configuration ---
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          (process.env.BACKEND_URL || "http://localhost:5000") +
          "/api/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const extractedAvatar =
            profile._json?.avatar_url || profile.photos?.[0]?.value;
          const extractedEmail =
            profile.emails?.[0]?.value ||
            profile._json?.email ||
            `${profile.username}@github.com`;
          const extractedName =
            profile.displayName || profile._json?.name || profile.username;

          let user = await User.findOne({ githubUsername: profile.username });
          if (!user) {
            user = await User.create({
              name: extractedName,
              email: extractedEmail,
              githubUsername: profile.username,
              avatar_url: extractedAvatar,
              role: "user", // Default role
            });
          } else {
            // Automatically update the avatar if it's new or missing to fix placeholder bugs
            if (extractedAvatar && user.avatar_url !== extractedAvatar) {
              user.avatar_url = extractedAvatar;
              await user.save();
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

// --- Auth Middleware ---
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  res.status(403).json({ error: "Access denied: Admins only" });
};

// Webhook Handler Function
const handleGitHubWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    // Secure Verification
    if (signature && secret && req.rawBody) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");
      try {
        if (
          !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
        ) {
          return res.status(403).send("Forbidden: Invalid Signature");
        }
      } catch (e) {
        return res.status(403).send("Forbidden: Crypto Buffer Mismatch length");
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(401).send("Unauthorized: Missing signature or secret");
    }

    // Process various GitHub events for scoring
    const event = req.headers["x-github-event"];
    const payload = req.body;
    let githubUsername = "";
    let scoreToAdd = 0;

    if (event === "push") {
      githubUsername = payload.pusher && payload.pusher.name;
      scoreToAdd = 10;
    } else if (event === "pull_request") {
      githubUsername = payload.sender && payload.sender.login;
      if (payload.action === "opened") {
        scoreToAdd = 20;
      } else if (
        payload.action === "closed" &&
        payload.pull_request &&
        payload.pull_request.merged
      ) {
        scoreToAdd = 30;
      }
    } else if (event === "issues") {
      githubUsername = payload.sender && payload.sender.login;
      if (payload.action === "opened") {
        scoreToAdd = 5;
      }
    } else if (event === "watch" || event === "star") {
      githubUsername = payload.sender && payload.sender.login;
      if (payload.action === "started" || payload.action === "created") {
        scoreToAdd = 2;
      }
    }

    if (githubUsername && scoreToAdd > 0) {
      const user = await User.findOne({ githubUsername });
      if (user) {
        user.totalScore = (user.totalScore || 0) + scoreToAdd;
        await user.save();
        console.log(
          `Updated score for ${githubUsername} -> +${scoreToAdd} (total: ${user.totalScore})`,
        );
      } else {
        console.log(`User ${githubUsername} not found for scoring.`);
      }
    }

    res.status(200).send("Webhook Received");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// --- API ROUTES ---

// Root route
app.get("/", (req, res) => {
  res.json({ message: "OSHub Backend is running" });
});

// Auth Routes
app.get(
  "/api/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/profile`,
    );
  },
);

app.get("/api/auth/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  try {
    const user = await User.findById(req.user._id).populate(
      "selectedProjects",
      "title author githubUrl desc documentationLink discordLink",
    );
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    // Remove invalid project refs automatically (cleanup)
    const validProjectIds = user.selectedProjects.map((p) => p._id);
    if (user.selectedProjects.length > 0) {
      user.selectedProjects = user.selectedProjects.filter(Boolean);
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/auth/me", isAuthenticated, async (req, res) => {
  try {
    const allowed = ["name", "number", "year", "branch", "section"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).populate(
      "selectedProjects",
      "title author githubUrl desc documentationLink discordLink",
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "participants",
      "name avatar_url",
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", isAdmin, async (req, res) => {
  try {
    const {
      title,
      author,
      githubUrl,
      desc,
      language,
      documentationLink,
      discordLink,
    } = req.body;
    const newProject = new Project({
      title,
      author,
      githubUrl,
      desc,
      language,
      documentationLink,
      discordLink,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects/:id/join", isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Check if already participant
    if (project.participants.includes(req.user._id)) {
      return res.status(400).json({ error: "Already joined this project" });
    }

    project.participants.push(req.user._id);
    await project.save();

    // Add to user's selectedProjects
    const user = await User.findById(req.user._id);
    if (!user.selectedProjects.includes(project._id)) {
      user.selectedProjects.push(project._id);
      await user.save();
    }

    res.json({ message: "Successfully joined project!", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects/:id/leave", isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.participants = project.participants.filter(
      (uid) => uid.toString() !== req.user._id.toString(),
    );
    await project.save();

    const user = await User.findById(req.user._id);
    user.selectedProjects = user.selectedProjects.filter(
      (pid) => pid.toString() !== project._id.toString(),
    );
    await user.save();

    res.json({ message: "Left project", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", isAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalScore: -1 })
      .limit(50)
      .select("name githubUsername totalScore avatar_url rank");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GitHub Webhook Receiver
app.post("/api/webhooks/github", handleGitHubWebhook);

// Alternative webhook route for convenience
app.post("/webhook", handleGitHubWebhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`OSHub Backend running on port ${PORT}`);
});
