import { Hono } from "hono";
import { login, signup } from "../controller/auth.controller";

const authRoute = new Hono();

authRoute.post("/signup", signup);
authRoute.post("/login", login);

export default authRoute;
