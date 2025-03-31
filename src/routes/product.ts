import { Elysia, t } from "elysia";
import { db } from "../database";
import { productTable } from "../database/schema";
import { eq } from "drizzle-orm";

export const productRoutes = new Elysia({ prefix: "/products" })
  .get("/", async () => {
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
  })
  .post(
    "/",
    async ({ body }) => {
      try {
        const { name, description, price, quantity, image } = body;

        //ensuring all fields are provided
        if (!name || !description || !price || !quantity || !image) {
          return {
            success: false,
            message: "All fields are required",
            status: 400,
          };
        }

        //inserting product into the database
        const product = await db
          .insert(productTable)
          .values({ name, description, price, quantity, imageUrl: image });
        return {
          success: true,
          message: "Product created successfully",
          data: product,
          status: 201,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "failed to create product",
          status: 500,
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        price: t.Numeric(),
        description: t.String(),
        quantity: t.Numeric(),
        image: t.String(),
      }),
    },
  )
  .get(
    "/:id",
    async ({ params }) => {
      try {
        const product = await db
          .select()
          .from(productTable)
          .where(eq(productTable.id, params.id));

        if (!product.length) {
          return {
            success: false,
            message: "Product not found",
            status: 404,
          };
        }
        return {
          success: true,
          message: "Product fetched successfully",
          data: product[0],
          status: 200,
        };
      } catch (error) {
        console.error("failed to fetch product", error);
        return {
          success: false,
          message: "failed to fetch product",
          status: 500,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
