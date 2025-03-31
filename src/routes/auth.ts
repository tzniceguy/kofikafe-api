import "dotenv/config";
import { Elysia, t } from "elysia";
import { db } from "../database";
import { userTable } from "../database/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "@elysiajs/jwt";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "auth",
      secret: process.env.JWT_SECRET,
    }),
  )
  .post(
    "/register",
    async ({ body }) => {
      try {
        const { firstName, lastName, phoneNumber, email, password } = body;

        //ensure all required fields are provided
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
          return {
            sucess: false,
            message: "Please provide all required fields",
            status: 400,
          };
        }

        //checking for existing user using email or phone number
        const existingUser = await db
          .select()
          .from(userTable)
          .where(
            or(
              eq(userTable.email, email.toLowerCase()),
              eq(userTable.phoneNumber, phoneNumber),
            ),
          )
          .limit(1);
        if (existingUser.length > 0) {
          //determine which field caused the confict
          const conflictField =
            existingUser[0].email.toLowerCase() === email.toLowerCase()
              ? "email"
              : "phone number";
          return {
            success: false,
            message: `User with this ${conflictField} already exists`,
            status: 400,
          };
        }

        //hash user password and store the details
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newuser] = await db
          .insert(userTable)
          .values({
            firstName,
            lastName,
            phoneNumber,
            email: email.toLowerCase(),
            password: hashedPassword,
          })
          .returning({
            id: userTable.id,
            firstName: userTable.firstName,
            lastName: userTable.lastName,
            phoneNumber: userTable.phoneNumber,
            email: userTable.email,
          });
        return {
          success: true,
          message: "User registered successfully",
          status: 201,
          data: newuser,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "An error occured while processing your request",
          status: 500,
        };
      }
    },
    {
      body: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        phoneNumber: t.String(),
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    },
  )
  .post(
    "/login",
    async ({ body, auth }) => {
      const { email, password } = body;

      //ensure all required fields are provided
      if (!email || !password) {
        return {
          success: false,
          message: "Please provide all required fields",
          status: 400,
        };
      }

      //find user with the provided email
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email.toLowerCase()))
        .limit(1);

      if (user.length === 0) {
        return {
          success: false,
          message: "User not found",
          status: 404,
        };
      }

      //verify user password hash with provided password
      const passwordMatch = await bcrypt.compare(password, user[0].password);

      if (!passwordMatch) {
        return {
          success: false,
          message: "Invalid credential provided",
          status: 401,
        };
      }

      //generate jwt token
      const token = await auth.sign({
        id: user[0].id,
        email: user[0].email,
        firstName: user[0].firstName,
        iat: Math.floor(Date.now() / 1000),
      });

      return {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
          },
          status: 200,
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    },
  );
