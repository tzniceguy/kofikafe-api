import Elysia from "elysia";

export const orderRoute = new Elysia()
  .get("/orders", "returns all orders placed ")
  .get("/orders/:id", "returns a single order by id")
  .post("/orders", "creates a new order");
