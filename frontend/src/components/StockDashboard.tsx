import { useEffect, useState, useRef, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Order {
  coin_id: string;
  price: number;    // live price per coin
  quantity: number;
  total: number;    // purchase total
}


const StocksDashboard = () => {
// Assume ordersAll is an array of all orders from your DB
// [
//   { coin_id: "bitcoin", price: 3000000, quantity: 0.05, total: 150000 },
//   { coin_id: "ethereum", price: 200000, quantity: 0.5, total: 100000 }
// ]

const [portfolioBalance] = useState(1000);
const [investedAmount, setInvestedAmount] = useState(0);
const [currentValue, setCurrentValue] = useState(0);
const socketRef = useRef<Socket | null>(null);

const handleMarketData = useCallback((orders: Order[]) => {
  // total invested amount = sum of `total` fields
  const totalInvestedAmount = orders.reduce((sum, order) => sum + order.total, 0);
  setInvestedAmount(totalInvestedAmount);

  // total current value = sum of `quantity * current price`
  const totalCurrentValue = orders.reduce((sum, order) => {
    const livePrice = order.price; // assuming `price` field is live price from socket
    return sum + livePrice * order.quantity;
  }, 0);
  setCurrentValue(totalCurrentValue);
}, []);

useEffect(() => {
  // Only create socket connection if it doesn't exist
  if (!socketRef.current) {
    socketRef.current = io("http://localhost:4000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
  }

  const socket = socketRef.current;

  // Listen to socket event
  socket.on("marketData", handleMarketData);

  // Cleanup function: remove listener on unmount
  return () => {
    socket.off("marketData", handleMarketData);
    // Disconnect socket when component unmounts
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };
}, [handleMarketData]);

  const returns = currentValue - investedAmount;
  const returnPercentage =
    investedAmount > 0 ? ((returns / investedAmount) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-5xl mx-auto overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Portfolio Balance</p>
          <p className="text-3xl font-bold">₹{portfolioBalance.toFixed(1)}</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Returns</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹{returns.toFixed(1)}</span>
                <span className={`text-lg font-medium ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({returns >= 0 ? '+' : ''}{returnPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center sm:text-left">
            <p className="text-base font-medium mb-2">Invested Amount</p>
            <p className="text-3xl font-bold">₹{investedAmount.toFixed(1)}</p>
          </div>
          
          <div className="text-center sm:text-left sm:border-l sm:border-border sm:pl-6">
            <p className="text-base font-medium mb-2">Current Value</p>
            <p className="text-3xl font-bold">₹{currentValue.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksDashboard;
