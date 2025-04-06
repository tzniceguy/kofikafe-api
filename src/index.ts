import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/product";
import { orderRoutes } from "./routes/order";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "KofiiKafee API",
          version: "1.0.0",
          description: "api for a coffee shop",
        },
      },
    }),
  )

  .use(authRoutes)
  .use(productRoutes)
  .use(orderRoutes)
  .get("/", () => ({
    messsage: "Welcome to KofiiKafee API",
    version: "1.0.0",
  }))
  .use(cors())
  .listen({
    hostname: "0.0.0.0",
    port: 3000,
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
