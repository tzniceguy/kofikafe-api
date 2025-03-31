import { Elysia, t } from "elysia";
import { orderTable, productTable } from "../database/schema";
import { db } from "../database";
import { eq } from "drizzle-orm";

export const orderRoute = new Elysia()
  .get("/orders", async () => {
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
  })
  .post(
    "/orders",
    async ({ body }) => {
      try {
        const {
          userId,
          productId,
          quantity,
          payment_method,
          order_type,
          delivery_address,
        } = body;

        //validate all fields are provided
        if (!userId || !productId || !quantity) {
          return {
            success: false,
            message: "All fields are required",
            status: 400,
          };
        }

        //verify if product exists
        const product = await db
          .select()
          .from(productTable)
          .where(eq(productTable.id, productId))
          .get();

        if (!product) {
          return {
            success: false,
            message: "Product not found",
            status: 404,
          };
        }

        // Handle optional fields with defaults
        const finalOrderType = order_type || "pickup";
        const finalPaymentMethod = payment_method || "cash";
        const finalDeliveryAddress =
          finalOrderType === "delivery" ? delivery_address || "" : "";

        // Additional validation based on order_type
        if (finalOrderType === "delivery" && !delivery_address) {
          return {
            success: false,
            message: "Delivery address is required for delivery orders",
            status: 400,
          };
        }

        //create order if product exists
        const order = await db
          .insert(orderTable)
          .values({
            productId,
            userId,
            quantity,
            status: "pending",
            total: product.price * quantity,
            payment_method: finalPaymentMethod,
            payment_status: "pending",
            order_type: finalOrderType,
            delivery_address: finalDeliveryAddress,
          })
          .returning();
        return {
          success: true,
          message: "Order created successfully",
          data: order,
          status: 201,
        };
      } catch (error) {
        console.log("failed to create order", error);
        return {
          success: false,
          message: "failed to create order",
          status: 500,
        };
      }
    },
    {
      body: t.Object({
        userId: t.Integer(),
        productId: t.Integer(),
        quantity: t.Integer(),
        payment_method: t.Optional(t.String()),
        order_type: t.Optional(t.String()),
        delivery_address: t.Optional(t.String()),
      }),
    },
  );
