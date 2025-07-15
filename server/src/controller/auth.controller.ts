import {} from "@prisma/client";
import { Context } from "hono";
import { SignUpBodyTypes, SignUpSchema } from "../types/schema/zod.index";

import { HTTPException } from "hono/http-exception";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PrismaClient, User } from "../generated/prisma";

const prisma = new PrismaClient();

export const signup = async (c: Context) => {
  const { email, password, name, apiKey } = await c.req.json<SignUpBodyTypes>();
  try {
    SignUpSchema.parse({ name, email, apiKey, password });

    const isUserExist: boolean =
      (await prisma.user.count({
        where: { email },
      })) > 0;

    if (isUserExist) {
      throw new HTTPException(400, { message: "This email already exist" });
    }

    const hashedPassword: string = bcrypt.hashSync(password, 10);

    const newUser: User = await prisma.user.create({
      data: {
        email,
        name,
        apiKey,
        password: hashedPassword,
      },
    });
  } catch (e: any) {
    throw new HTTPException(500, {
      message: e.message || "An error occurred while logging in",
    });
  }
};
export const login = async (c: Context) => {};
