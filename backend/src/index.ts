import express from "express";
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
}).then(() => {
  console.log("MongoDB connected!!");
}).catch((e) => {
  console.log(`Error connection to DB failed: ${e}`);
});

const app = express();
const server = http.createServer(app);

// Optimized Socket.IO configuration
const io = new Server(server, {
  cors: { 
    origin: "https://tradingdelite.thefauxpastrouper.space",
    credentials: true
  },
  // Connection timeout and ping settings - AGGRESSIVE CLEANUP
  pingTimeout: 5000,      // Shorter timeout to detect dead connections
  pingInterval: 10000,    // Check connection health every 10s
  connectTimeout: 10000,  // Timeout for initial connection
  // Limit max connections per socket
  maxHttpBufferSize: 1e6,
  // Use websocket only for cleaner connections
  transports: ['websocket'],
  // Don't allow upgrades that can cause duplicates
  allowUpgrades: false
  // Removed connectionStateRecovery to fix type error
});

const PORT = process.env.PORT || 4000;

// Middleware (removed duplicate express.json())
app.use(express.json());
app.use(cors({
  origin: "https://tradingdelite.thefauxpastrouper.space",
  credentials: true
}));

// Track connected clients to prevent duplicates
const connectedClients = new Map<string, string>();

// Socket.io connection with aggressive deduplication
io.on("connection", (socket) => {
  const clientId = socket.handshake.query.clientId as string;
  const userAgent = socket.handshake.headers['user-agent'];
  
  console.log(`🔌 Connection attempt: ${socket.id} | Client: ${clientId || 'N/A'} | Total: ${io.engine.clientsCount}`);
  
  // FORCE disconnect duplicate connections
  if (clientId && connectedClients.has(clientId)) {
    const existingSocketId = connectedClients.get(clientId);
    const existingSocket = io.sockets.sockets.get(existingSocketId!);
    
    if (existingSocket) {
      console.log(`🔨 FORCE disconnecting duplicate: ${existingSocketId}`);
      existingSocket.disconnect(true);
      existingSocket.removeAllListeners();
    }
    
    connectedClients.delete(clientId);
  }
  
  // Register new connection
  if (clientId) {
    connectedClients.set(clientId, socket.id);
  }
  
  console.log(`✅ User connected: ${socket.id} | Client: ${clientId || 'N/A'} | Active: ${connectedClients.size}`);

  // Send initial connection confirmation
  socket.emit("connected", { socketId: socket.id, timestamp: Date.now() });

  socket.on("disconnect", (reason) => {
    console.log(`❌ User disconnected: ${socket.id} | Reason: ${reason} | Remaining: ${io.engine.clientsCount - 1}`);
    if (clientId && connectedClients.get(clientId) === socket.id) {
      connectedClients.delete(clientId);
    }
  });
  
  socket.on("error", (error) => {
    console.error(`⚠️ Socket error: ${socket.id}`, error);
    socket.disconnect(true);
  });
  
  // Heartbeat to detect stale connections
  let heartbeatTimeout: NodeJS.Timeout;
  
  socket.on("heartbeat", () => {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(() => {
      console.log(`💔 No heartbeat from ${socket.id}, disconnecting`);
      socket.disconnect(true);
    }, 15000);
  });
  
  socket.on("disconnect", () => {
    clearTimeout(heartbeatTimeout);
  });
});

// Cache for market data to reduce API calls
let marketDataCache: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 30 seconds

async function fetchMarketData(ids: string[], ordersAll: any[]) {
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=inr`,
      {
        headers: { 
          "Content-Type": "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY
        },
        timeout: 10000 // Add timeout
      }
    );
    
    console.log("📊 Fetched market data:", Object.keys(res.data).length, "coins");
    
    // Build result object combining price, quantity, total
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

  } catch (err: any) {
    console.error("❌ Error fetching prices:", err.message);
    return null;
  }
}

// Optimized interval with error handling and connection check
let marketDataInterval: NodeJS.Timeout | null = null;

async function emitMarketData() {
  try {
    // Only fetch if there are connected clients
    if (io.engine.clientsCount === 0) {
      console.log("⏭️ No clients connected, skipping market data fetch");
      return;
    }

    const now = Date.now();
    
    // Use cache if available and fresh
    if (marketDataCache && (now - lastFetchTime) < CACHE_DURATION) {
      io.emit("marketData", marketDataCache);
      return;
    }

    // Fetch all orders with projection
    const ordersAll = await Order.find({}, { 
      coin_id: 1, 
      coin_price: 1, 
      quantity: 1, 
      total: 1, 
      _id: 0
    }).lean(); // Use lean() for better performance

    if (ordersAll.length === 0) {
      console.log("⚠️ No orders found in database");
      return;
    }

    // Get unique coinIds
    const coinIds = [...new Set(ordersAll.map(order => order.coin_id))];
    
    const prices = await fetchMarketData(coinIds, ordersAll);
    
    if (prices) {
      marketDataCache = prices;
      lastFetchTime = now;
      io.emit("marketData", prices);
      console.log(`📤 Emitted market data to ${io.engine.clientsCount} client(s)`);
    }
  } catch (err: any) {
    console.error("❌ Error in emitMarketData:", err.message);
  }
}

// Start interval only after server starts
function startMarketDataInterval() {
  if (marketDataInterval) {
    clearInterval(marketDataInterval);
  }
  
  // Emit immediately on start
  emitMarketData();
  
  // Then emit every 30 seconds
  marketDataInterval = setInterval(emitMarketData, 10000);
  console.log("⏰ Market data interval started (10s)");
}

// Cache for latest transaction prices
const transactionPriceCache = new Map<string, { price: number; timestamp: number }>();
const TRANSACTION_CACHE_DURATION = 60000; // 1 minute

app.get("/price-transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check cache first
    const cached = transactionPriceCache.get(id);
    if (cached && (Date.now() - cached.timestamp) < TRANSACTION_CACHE_DURATION) {
      return res.json({ id, price: cached.price, cached: true });
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
        timeout: 10000
      }
    );

    if (response.data?.market_data?.current_price?.inr) {
      const price = response.data.market_data.current_price.inr;
      
      // Update cache
      transactionPriceCache.set(id, { price, timestamp: Date.now() });
      
      return res.json({ id, price, cached: false });
    }

    res.status(404).json({ message: "No market data found" });
  } catch (err: any) {
    console.error("❌ Error fetching coin data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Improved POST endpoint with better error handling
app.post("/price-transaction", async (req, res) => {
  try {
    const { id, price, quantity, total } = req.body;

    // Validate input
    if (!id || !price || !quantity || !total) {
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { id, price, quantity, total }
      });
    }

    // Validate data types
    if (typeof price !== 'number' || typeof quantity !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ 
        message: "Price, quantity, and total must be numbers",
        received: { price: typeof price, quantity: typeof quantity, total: typeof total }
      });
    }

    // Get latest price - either from cache or fetch fresh
    let latestPrice: number;
    const cached = transactionPriceCache.get(id);
    
    if (cached && (Date.now() - cached.timestamp) < TRANSACTION_CACHE_DURATION) {
      // Use cached price
      latestPrice = cached.price;
      console.log(`💾 Using cached price for ${id}: ${latestPrice}`);
    } else {
      // Fetch fresh price
      console.log(`🔄 Fetching fresh price for ${id}...`);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
            },
            timeout: 10000
          }
        );

        if (!response.data?.market_data?.current_price?.inr) {
          return res.status(404).json({ 
            message: "No market data found for this coin",
            coinId: id 
          });
        }

        latestPrice = response.data.market_data.current_price.inr;
        
        // Update cache
        transactionPriceCache.set(id, { price: latestPrice, timestamp: Date.now() });
        console.log(`✅ Fresh price fetched for ${id}: ${latestPrice}`);
        
      } catch (fetchError: any) {
        console.error(`❌ Error fetching price for ${id}:`, fetchError.message);
        return res.status(503).json({ 
          message: "Failed to fetch latest price from CoinGecko",
          error: fetchError.message 
        });
      }
    }

    // Allow small price variance (1%) to account for slight delays
    const priceVariance = Math.abs((price - latestPrice) / latestPrice);
    const ALLOWED_VARIANCE = 0.01; // 1%
    
    if (priceVariance > ALLOWED_VARIANCE) {
      console.log(`⚠️ Price mismatch for ${id}: submitted=${price}, latest=${latestPrice}, variance=${(priceVariance * 100).toFixed(2)}%`);
      return res.status(400).json({ 
        message: "Price does not match latest market price",
        latestPrice,
        submittedPrice: price,
        variancePercent: (priceVariance * 100).toFixed(2),
        maxAllowedVariance: (ALLOWED_VARIANCE * 100).toFixed(2)
      });
    }

    // Validate total calculation
    const expectedTotal = price * quantity;
    const totalVariance = Math.abs((total - expectedTotal) / expectedTotal);
    
    if (totalVariance > 0.001) { // 0.1% tolerance for rounding
      return res.status(400).json({ 
        message: "Total calculation mismatch",
        expectedTotal,
        receivedTotal: total
      });
    }

    // Create and save order
    const order = new Order({ 
      coin_id: id, 
      coin_price: price, 
      quantity, 
      total 
    });

    await order.save();

    // Clear market data cache to force refresh
    marketDataCache = null;

    console.log(`✅ Order saved: ${id} | Price: ₹${price} | Qty: ${quantity} | Total: ₹${total}`);
    
    // Emit update to all connected clients
    emitMarketData();
    
    return res.status(201).json({ 
      message: "Order confirmed",
      order: { 
        id, 
        price, 
        quantity, 
        total,
        latestMarketPrice: latestPrice
      }
    });
    
  } catch (err: any) {
    console.error("❌ Error in /price-transaction:", err);
    console.error("Stack trace:", err.stack);
    
    // Return detailed error information
    return res.status(500).json({ 
      error: "Internal server error",
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    connectedClients: io.engine.clientsCount,
    uniqueClients: connectedClients.size,
    uptime: process.uptime()
  });
});

// Debug endpoint to see all connections
app.get("/connections", (req, res) => {
  const connections = Array.from(io.sockets.sockets.entries()).map(([id, socket]) => ({
    id,
    clientId: socket.handshake.query.clientId,
    connected: socket.connected,
    rooms: Array.from(socket.rooms)
  }));
  
  res.json({ 
    total: io.engine.clientsCount,
    unique: connectedClients.size,
    connections,
    clientMap: Array.from(connectedClients.entries())
  });
});

// Force cleanup endpoint (for debugging)
app.post("/cleanup-connections", (req, res) => {
  console.log("🧹 Force cleaning all connections...");
  
  io.sockets.sockets.forEach(socket => {
    socket.disconnect(true);
    socket.removeAllListeners();
  });
  
  connectedClients.clear();
  
  res.json({ 
    message: "All connections cleaned",
    remaining: io.engine.clientsCount
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  if (marketDataInterval) {
    clearInterval(marketDataInterval);
  }
  
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false).then(() => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startMarketDataInterval();
});