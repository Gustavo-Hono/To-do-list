import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

env.config();

const db = new pg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
})

db.connect()

async function getItems() {
  const result = await db.query("SELECT * FROM items")
  console.log("_------------------")
  const data = result.rows
  console.log(data)
  return data
}


app.get("/",async (req, res) => {
  let items = await getItems()
  // console.log(143504)
  // console.log(items)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  console.log(2459320)
  console.log(req.body)
  const {newItem} = req.body;
  const result = await db.query("INSERT INTO items(title) VALUES ($1)", [newItem])
  res.redirect("/");
});

app.post("/edit",async (req, res) => {
  console.log(req.body)
  let { updatedItemId, updatedItemTitle} = req.body
  updatedItemId = parseInt(updatedItemId)
  const result = await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId])
  res.redirect("/")
});

app.post("/delete",async (req, res) => {
  console.log(req.body)
  const id = parseInt(req.body.deleteItemId)
  const result = await db.query("DELETE FROM items WHERE id=$1", [id])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
