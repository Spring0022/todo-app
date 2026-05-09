const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 先ほど作成した MySQL 接続済みの db オブジェクトを読み込む
const db = require("./db");

// 【Read】一覧取得
app.get("/api/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// 【Create】追加
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  // SQLのカラム名が 'task' の場合はここを 'task' に書き換えてください
  db.execute(
    "INSERT INTO todos (text) VALUES (?)",
    [text],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ id: result.insertId, text: text });
    },
  );
});

// 【Update】更新（テキストと完了状態）
app.put("/api/todos/:id", (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  db.execute(
    "UPDATE todos SET text = ? WHERE id = ?",
    [text, Number(id)],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Updated" });
    },
  );
});

// 【Delete】削除
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  db.execute("DELETE FROM todos WHERE id = ?", [Number(id)], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
