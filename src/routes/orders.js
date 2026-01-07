import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SHOP_URL = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

console.log("STORE:", process.env.SHOPIFY_STORE);
console.log("TOKEN EXISTS:", !!process.env.SHOPIFY_ADMIN_TOKEN);
console.log("API VERSION:", process.env.SHOPIFY_API_VERSION);

router.get("/all", async (req, res) => {
  try {
    const response = await axios.post(
      SHOP_URL,
      {
        query: `
          query {
            orders(first: 10, sortKey: CREATED_AT, reverse: true) {
              edges {
                node {
                  id
                  name
                  email
                  createdAt
                  displayFulfillmentStatus
                  displayFinancialStatus
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  billingAddress {
                    lastName
                    firstName
                  }
                }
              }
            }
          }
        `
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    const orders = response.data.data.orders.edges.map(edge => edge.node);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error("Shopify Orders Fetch Error:", error.response?.data || error.message);
    console.log("Error: ", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders from Shopify"
    });
  }
});

export default router;
