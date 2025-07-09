import { Hono } from "hono";
import { insertData, invokeAgent } from "../controller/data.controller";

const dataRoute = new Hono();

dataRoute.post("/rag", insertData);
dataRoute.post("/query", invokeAgent);

export default dataRoute;
