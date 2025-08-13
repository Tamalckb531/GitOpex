import { Hono } from "hono";
import {
  checker,
  insertDataProfile,
  insertDataRepo,
  insertDataRepoFile,
  insertDataRepoFolder,
  invokeAgent,
} from "../controller/data.controller";
import { authMiddleware } from "../middleware/tokenDetector";

const dataRoute = new Hono();

dataRoute.post("/rag/profile", authMiddleware, insertDataProfile);
dataRoute.post("/rag/repo", authMiddleware, insertDataRepo);
dataRoute.post("/rag/repo_file", authMiddleware, insertDataRepoFile);
dataRoute.post("/rag/repo_folder", authMiddleware, insertDataRepoFolder);
dataRoute.post("/check", authMiddleware, checker);
dataRoute.post("/query", authMiddleware, invokeAgent);

export default dataRoute;
