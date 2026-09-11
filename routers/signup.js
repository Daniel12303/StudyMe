import express from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const __dirname = import.meta.dirname;

dotenv.config({ path: path.join(__dirname, "../.env") });

const database_key = process.env.DATABASE_KEY;
const project_url = process.env.DATABASE_URL;

const supabase = createClient(project_url, database_key);

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/signup.html"));
});

router.post("/credentials", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: password,
  });

  if (error) console.log(error.message);

  res.redirect("/login");
});

export { router as signup };
