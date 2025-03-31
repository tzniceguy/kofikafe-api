import { db } from "./index";
import { productTable } from "./schema";

const sampleProducts = [
  {
    name: "Espresso",
    description: "A concentrated form of coffee served in small, strong shots.",
    price: 299, // $2.99
    quantity: 100,
    imageUrl: "https://example.com/images/espresso.jpg",
  },
  {
    name: "Cappuccino",
    description: "Espresso-based coffee drink prepared with steamed milk foam.",
    price: 399, // $3.99
    quantity: 100,
    imageUrl: "https://example.com/images/cappuccino.jpg",
  },
  {
    name: "Latte",
    description: "Coffee drink made with espresso and steamed milk.",
    price: 449, // $4.49
    quantity: 100,
    imageUrl: "https://example.com/images/latte.jpg",
  },
  {
    name: "Mocha",
    description: "Chocolate-flavored variant of a cafe latte.",
    price: 499, // $4.99
    quantity: 100,
    imageUrl: "https://example.com/images/mocha.jpg",
  },
  {
    name: "Cold Brew",
    description: "Coffee made by steeping coffee beans in cold water.",
    price: 449, // $4.49
    quantity: 100,
    imageUrl: "https://example.com/images/cold-brew.jpg",
  },
];

async function seedProducts() {
  try {
    // Clear existing products
    await db.delete(productTable);

    // Insert sample products
    const insertedProducts = await db
      .insert(productTable)
      .values(sampleProducts)
      .returning();

    console.log("Products seeded successfully:", insertedProducts);
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    // Close database connection if needed
    // await db.close();
  }
}

// Run the seed function
seedProducts();
