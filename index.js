import express from "express";

import { signup } from "./routers/signup.js";
import { login } from "./routers/login.js";
import { home } from "./routers/home.js";
import { subject } from "./routers/subject.js";

const app = express();

app.use("/signup", signup);
app.use("/login", login);
app.use("/subject", subject);
app.use("/", home);

export default app;

app.listen(5000, () => [console.log("Listening at Port 5000")]);
