import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/product";
import { orderRoute } from "./routes/order";

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
  .use(orderRoute)
  .get("/", () => ({
    messsage: "Welcome to KofiiKafee API",
    version: "1.0.0",
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
