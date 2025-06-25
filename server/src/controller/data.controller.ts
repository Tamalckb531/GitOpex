import { Context } from "hono";

export const insertData = async (c: Context) => {
  return c.json({ msg: "Hello" });
};
