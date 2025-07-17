import { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  let userId: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded: any = jwt.verify(token, c.env.JWT_SECRET_KEY);
      userId = decoded.id;
    } catch (err) {
      userId = null;
    }
  }

  c.set("userId", userId);

  await next();
};
