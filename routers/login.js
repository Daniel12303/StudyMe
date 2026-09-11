import express from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const __dirname = import.meta.dirname;

dotenv.config({ path: path.join(__dirname, "../.env") });

const database_key = process.env.DATABASE_KEY;
const project_url = process.env.DATABASE_URL;

const supabase = createClient(project_url, database_key);

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/login.html"));
});

router.post("/credentials", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) console.log(error.message);
  else {
    res.cookie("access_token", data.session.access_token, { httpOnly: true });
  }

  res.redirect("/");
});

export { router as login };
