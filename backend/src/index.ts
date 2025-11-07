
import express, { response } from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import type EthereumData from "./types/types.js";
import Order from "./db/db.js";
import cors from "cors";



dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set.");
    }
mongoose.connect(MONGO_URI, {
  authSource: "admin"
}).then(()=>{
    console.log("MongoDB connected!!")
}).catch((e)=>{
    console.log(`Error connection to DB failed: ${e}`)
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // allow all origins for now
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.json());
app.use(cors());

// Socket.io connection
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

async function fetchMarketData(ids: string[], ordersAll: any[]) {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=inr`,{
        headers: { 
            "Content-Type": "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
         }
    });
    console.log("Fetched market data:", res.data);
    // Build a result object combining price, quantity, total
    const allCoins = ids.reduce((acc: { [key: string]: { price: number; quantity: number; total: number } }, coin) => {
      const order = ordersAll.find(o => o.coin_id === coin);
      if (res.data[coin] && order) {
        acc[coin] = {
          price: res.data[coin].inr,
          quantity: order.quantity,
          total: order.total
        };
      }
      return acc;
    }, {});

    return allCoins;

  } catch (err) {
    console.error("Error fetching prices:", err);
    return null;
  }
}


// Emit data every 5 seconds
setInterval(async () => {
      // Fetch all orders but only select coin_id field
    const ordersAll = await Order.find({}, { 
      coin_id: 1, 
      coin_price: 1, 
      quantity: 1, 
      total: 1, 
      _id: 0
    });

    // Get coinIds dynamically from the same query
    const coinIds = ordersAll.map(order => order.coin_id);

  const prices = await fetchMarketData(coinIds, ordersAll);
  if (prices) io.emit("marketData", prices);
}, 30000);

let latestTransaction = 0;

app.get("/price-transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
      },
    });

    if (response.data && response.data.market_data) {
      const price = response.data.market_data.current_price.inr;
      latestTransaction = price;
      return res.json({ id, price });
    }

    res.status(404).json({ message: "No market data found" });
  } catch (err:any) {
    console.error("Error fetching coin data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/price-transaction", async (req, res) => {
  const { id, price, quantity, total } = req.body;

  if (price === latestTransaction) {
    const order = new Order({ coin_id: id, coin_price: price, quantity, total });

    await order.save();

    console.log("✅ Order saved: ");
    return res.json({ message: "Order confirmed"});
  }

  res.status(400).json({ message: "Price does not match latest transaction." });
});

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
