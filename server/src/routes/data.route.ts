import { Hono } from "hono";
import { insertData, invokeAgent } from "../controller/data.controller";
import { authMiddleware } from "../middleware/tokenDetector";

const dataRoute = new Hono();

dataRoute.post("/rag", authMiddleware, insertData);
dataRoute.post("/query", authMiddleware, invokeAgent);

export default dataRoute;
