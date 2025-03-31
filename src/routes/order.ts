import Elysia from "elysia";
import { orderTable } from "../database/schema";
import { db } from "../database";

export const orderRoute = new Elysia().get("/orders", async () => {
  try {
    const orders = await db.select().from(orderTable).all();
    return {
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      status: 200,
    };
  } catch (error) {
    console.log("failed to fetch orders", error);
    return {
      success: false,
      message: "failed to fetch orders",
      status: 500,
    };
  }
});
