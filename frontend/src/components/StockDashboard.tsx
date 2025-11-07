import { useEffect, useState, useCallback, useRef } from "react";
import { BarChart3, Wifi, WifiOff } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Order {
  coin_id: string;
  price: number;
  quantity: number;
  total: number;
}

// Singleton socket instance outside component
let socketInstance: Socket | null = null;

// Generate persistent client ID
const getClientId = () => {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create socket singleton
const getSocket = (): Socket => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Disconnect old socket if exists
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  }

  const clientId = getClientId();

  socketInstance = io(`${import.meta.env.VITE_API_BACKEND_URL}`, {
    query: { clientId },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    autoConnect: true,
    forceNew: true
  });

  socketInstance.on('connect', () => {
    console.log('✅ Connected:', socketInstance?.id);
  });

  socketInstance.on('connected', (data) => {
    console.log('🤝 Server confirmed:', data);
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
  });

  socketInstance.on('connect_error', (error) => {
    console.error('🔴 Connection error:', error);
  });

  return socketInstance;
};

const StocksDashboard = () => {
  const [portfolioBalance] = useState(1000);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Never');
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMarketData = useCallback((data: any) => {
    let orders: Order[] = [];
    
    // Handle different possible data structures
    if (Array.isArray(data)) {
      orders = data;
    } else if (data && typeof data === 'object') {
      // Check if it's a coin object map (like { bitcoin: {...}, ethereum: {...} })
      const keys = Object.keys(data);
      if (keys.length > 0 && data[keys[0]].price !== undefined) {
        // Convert object map to array
        orders = keys.map(coin_id => ({
          coin_id,
          price: data[coin_id].price,
          quantity: data[coin_id].quantity,
          total: data[coin_id].total
        }));
      } else if (Array.isArray(data.orders)) {
        orders = data.orders;
      } else if (Array.isArray(data.data)) {
        orders = data.data;
      } else {
        console.error('❌ Unknown data structure:', data);
        return;
      }
    } else {
      console.error('❌ Invalid data format received');
      return;
    }

    if (!orders || orders.length === 0) {
      return;
    }

    // Calculate invested amount
    const totalInvestedAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    setInvestedAmount(totalInvestedAmount);

    // Calculate current value
    const totalCurrentValue = orders.reduce((sum, order) => {
      const livePrice = order.price || 0;
      const qty = order.quantity || 0;
      return sum + livePrice * qty;
    }, 0);
    setCurrentValue(totalCurrentValue);
    
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      setIsConnected(true);
      
      heartbeatRef.current = setInterval(() => {
        if (socket.connected) {
          socket.emit('heartbeat');
        }
      }, 10000);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("marketData", handleMarketData);

    setIsConnected(socket.connected);

    if (socket.connected) {
      heartbeatRef.current = setInterval(() => {
        if (socket.connected) {
          socket.emit('heartbeat');
        }
      }, 10000);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("marketData", handleMarketData);
      
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [handleMarketData]);

  const returns = currentValue - investedAmount;
  const returnPercentage =
    investedAmount > 0 ? ((returns / investedAmount) * 100).toFixed(1) : "0.0";

  return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-5xl mx-auto overflow-hidden">
        <div className="p-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-600">Disconnected</span>
                </>
              )}
            </div>
          </div>

          {/* Last Update */}
          <div className="mb-4 text-sm text-muted-foreground">
            Last update: {lastUpdate}
          </div>
          
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