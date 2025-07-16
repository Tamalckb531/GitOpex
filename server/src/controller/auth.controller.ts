import { Context } from "hono";
import { SignUpBodyTypes, SignUpSchema } from "../types/schema/zod.index";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcryptjs";
import { PrismaClient, User } from "../generated/prisma";
import { encryptApiKey } from "../libs/encryptions";
import jwt from "jsonwebtoken";

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

    const encryptedApiKey: string = encryptApiKey(apiKey, c.env.ENCRYPTION_KEY);

    const newUser: User = await prisma.user.create({
      data: {
        email,
        name,
        apiKey: encryptedApiKey,
        password: hashedPassword,
      },
    });

    if (!c.env.JWT_SECRET_KEY) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in the environment variables"
      );
    }

    const token: string = jwt.sign(
      {
        id: newUser.id,
      },
      c.env.JWT_SECRET_KEY
    );

    const { password: pass, apiKey: key, ...user } = newUser;

    setCookie(c, "access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });

    return c.json({
      msg: "Logged in successfully",
      user: user,
    });
  } catch (e: any) {
    throw new HTTPException(500, {
      message: e.message || "An error occurred while logging in",
    });
  }
};
export const login = async (c: Context) => {};

//? sadfj
