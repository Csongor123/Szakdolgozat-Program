const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// --- SQLite DB ---
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "app.db");
const db = new sqlite3.Database(DB_PATH);


db.run("PRAGMA foreign_keys = ON");

// táblák
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT PRIMARY KEY
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      user_name TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_name, lesson_id),
      FOREIGN KEY (user_name) REFERENCES users(name) ON DELETE CASCADE
    )
  `);
});

// --- segédfüggvények ---
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// --- Frontend kiszolgálása ---
app.use(express.static(path.join(__dirname, "public")));

// --- Health  ---
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// --- API: user lista ---
app.get("/api/users", async (req, res) => {
  try {
    const rows = await all(`SELECT name FROM users ORDER BY name ASC`);
    res.json(rows.map(r => r.name));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API: user létrehozás ---
app.post("/api/users", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ error: "Hiányzó név" });

    await run(`INSERT OR IGNORE INTO users(name) VALUES (?)`, [name]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API: user törlés ---
app.delete("/api/users/:name", async (req, res) => {
  try {
    const name = req.params.name;
    await run(`DELETE FROM users WHERE name = ?`, [name]);
    
    await run(`DELETE FROM progress WHERE user_name = ?`, [name]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API: progress lekérés ---
app.get("/api/progress/:user", async (req, res) => {
  try {
    const user = req.params.user;

    const u = await get(`SELECT name FROM users WHERE name=?`, [user]);
    if (!u) return res.json({});

    const rows = await all(
      `SELECT lesson_id, completed FROM progress WHERE user_name=?`,
      [user]
    );

    const result = {};
    rows.forEach(r => {
      result[String(r.lesson_id)] = r.completed === 1;
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API: progress mentés  ---
app.post("/api/progress/:user", async (req, res) => {
  try {
    const user = req.params.user;
    const progress = req.body || {};

    await run(`INSERT OR IGNORE INTO users(name) VALUES (?)`, [user]);

    await run(`DELETE FROM progress WHERE user_name=?`, [user]);

    for (const [lessonId, done] of Object.entries(progress)) {
      if (done === true) {
        await run(
          `INSERT INTO progress(user_name, lesson_id, completed) VALUES (?, ?, 1)`,
          [user, String(lessonId)]
        );
      }
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API: reset progress ---
app.post("/api/progress/:user/reset", async (req, res) => {
  try {
    const user = req.params.user;
    await run(`DELETE FROM progress WHERE user_name=?`, [user]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Fut: http://localhost:" + PORT);
  console.log("Health: http://localhost:" + PORT + "/api/health");
});
