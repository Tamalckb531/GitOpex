import { Hono } from "hono";
import { insertData, invokeAgent } from "../controller/data.controller";
import { authMiddleware } from "../middleware/tokenDetector";

const dataRoute = new Hono();

dataRoute.post("/rag/profile", authMiddleware, insertData);
dataRoute.post("/rag/repo", authMiddleware, insertData);
dataRoute.post("/rag/repo_file", authMiddleware, insertData);
dataRoute.post("/rag/repo_folder", authMiddleware, insertData);
dataRoute.post("/check", authMiddleware, insertData);
dataRoute.post("/query", authMiddleware, invokeAgent);

export default dataRoute;
