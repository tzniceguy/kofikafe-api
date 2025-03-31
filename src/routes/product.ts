import Elysia from "elysia";
import { db } from "../database";
import { productTable } from "../database/schema";

export const productRoutes = new Elysia({ prefix: "/products" }).get(
  "/",
  async () => {
    try {
      const products = await db.select().from(productTable).all();
      return {
        success: true,
        message: "Products fetched successfully",
        data: products,
        status: 200,
      };
    } catch (error) {
      console.error("error fetching products:", error);
      return {
        success: false,
        message: "failed to fetch products",
        status: 500,
      };
    }
  },
);
