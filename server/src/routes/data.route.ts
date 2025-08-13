import { Hono } from "hono";
import {
  checker,
  insertData,
  invokeAgent,
} from "../controller/data.controller";
import { authMiddleware } from "../middleware/tokenDetector";

const dataRoute = new Hono();

dataRoute.post("/rag/profile", authMiddleware, insertData("PROFILE"));
dataRoute.post("/rag/repo", authMiddleware, insertData("REPO"));
dataRoute.post("/rag/repo_file", authMiddleware, insertData("REPO_IN_File"));
dataRoute.post(
  "/rag/repo_folder",
  authMiddleware,
  insertData("REPO_IN_Folder")
);
dataRoute.post("/check", authMiddleware, checker);
dataRoute.post("/query", authMiddleware, invokeAgent);

export default dataRoute;
