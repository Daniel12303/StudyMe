import express from "express";

import { signup } from "./routers/signup.js";
import { login } from "./routers/login.js";
import { home } from "./routers/home.js";

const app = express();

app.use("/signup", signup);
app.use("/login", login);
app.use("/", home);

export default app;

app.listen(5000, () => [console.log("Listening at Port 5000")]);
