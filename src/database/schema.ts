import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", {
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull().unique(),
  password: text("password").notNull(),
});

export const productTable = sqliteTable("products", {
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const categoriesTable = sqliteTable("categories", {
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
});

export const orderTable = sqliteTable("order", {
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => userTable.id),
  productId: integer("product_id").references(() => productTable.id),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull(),
  total: integer("total").notNull(),
  payment_status: text("payment_status").notNull(),
  payment_method: text("payment_method").notNull().default("cash"),
  order_type: text("order_type").notNull().default("pickup"),
  delivery_address: text("delivery_address").notNull(),
});
