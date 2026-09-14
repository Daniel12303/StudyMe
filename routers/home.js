import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";

import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const database_key = process.env.DATABASE_KEY;
const project_url = process.env.DATABASE_URL;
const supabase = createClient(project_url, database_key);
const __dirname = import.meta.dirname;

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "../static")));

router.get("/", async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) res.redirect("/login");

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    res.clearCookie("access_token");
    res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "../static/home.html"));
});

router.get("/error/:error", async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) res.redirect("/login");

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    res.clearCookie("access_token");
    res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "../static/home.html"));
});

router.get("/getSubjects", async (req, res) => {
  const token = req.cookies.access_token;
  const response = await supabase.auth.getUser(token);

  if (response.error) console.log(response.error.message);

  const uid = response.data.user.id;

  const { data, error } = await supabase
    .from("subjects")
    .select()
    .eq("uid", uid);

  if (error) console.log(error.message);

  res.send(data[0].subjects);
});

router.post("/createNew", async (req, res) => {
  const body = req.body;
  const title = req.body.subject_title;
  const description = req.body.subject_description;

  const token = req.cookies.access_token;
  const { data, error } = await supabase.auth.getUser(token);

  const uid = data.user.id;

  const response = await supabase.from("subjects").select().eq("uid", uid);

  if (response.error) console.log(response.error.message);

  if (response.data.length == 0) {
    const subject_object = {
      subjects: [
        {
          subject_name: title,
          description: description,
        },
      ],
    };

    const subject_json = JSON.stringify(subject_object);

    const { error } = await supabase
      .from("subjects")
      .insert({ uid: uid, subjects: subject_object });

    if (error) console.log(error.message);
  } else {
    let subject_list = response.data[0]["subjects"];

    subject_list.subjects.forEach((subject) => {
      if (title == subject.subject_name)
        res.redirect("/error/Name%20Already%20Taken");
    });

    const new_subject = {
      subject_name: title,
      description: description,
    };

    subject_list.subjects.push(new_subject);
    const { error } = await supabase
      .from("subjects")
      .update({ subjects: subject_list })
      .eq("uid", uid);
  }

  res.redirect("/");
});

export { router as home };
