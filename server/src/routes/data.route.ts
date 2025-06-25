import { Hono } from "hono";
import { insertData } from "../controller/data.controller";

const dataRoute = new Hono();

dataRoute.post("/data/rag", insertData);
