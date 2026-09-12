import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { signup } from "./routers/signup.js";
import { login } from "./routers/login.js";
import { createClient } from "@supabase/supabase-js";

const __dirname = import.meta.dirname;

const database_key = process.env.DATABASE_KEY;
const project_url = process.env.DATABASE_URL;
const supabase = createClient(project_url, database_key);

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/signup", signup);
app.use("/login", login);

app.get("/", async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) res.redirect("/login");

  const { data, error } = await supabase.auth.getUser(token);
  res.sendFile(path.join(__dirname, "/static/home.html"));
});

export default app;

app.listen(5000, () => [console.log("Listening at Port 5000")]);
