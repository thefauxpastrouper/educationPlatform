import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { AxiosPromise } from "axios";
import axios from "axios";

import CryptoDetails, { type EthereumData } from "./CryptoDetails";
import api from "./AxiosRequest";
import Header from "./Header";
import { Button } from "./Button";
import { Minus, Plus } from "lucide-react";

const getCryptoDetails = async (id: string): AxiosPromise<EthereumData | null> => {
  console.log("Fetching crypto details from API:", import.meta.env.VITE_API_BASE_URL);
  return api.get(`/coins/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "id": id,
      "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
    },
  });
};

const CryptoDetailsComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoDetails, setCryptoDetails] = useState<EthereumData | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate();

  const subtotal = price * quantity;
  const taxes = Math.round(subtotal * 0.03);
  const total = subtotal + taxes;

  async function priceFetching(id: string): Promise<number | null> {
    try {
      const response = await axios.get(`http://localhost:4000/price-transaction/${id}`);
      const data = response.data;

      // Adjust this based on your backend response structure
      if (typeof data.price === "number") {
        setPrice(data.price);
        return data.price;
      } else if (data?.market_data?.current_price?.inr) {
        const priceInINR = data.market_data.current_price.inr;
        setPrice(priceInINR);
        return priceInINR;
      } else {
        console.warn("Price data missing in response:", data);
        return null;
      }
    } catch (e) {
      console.error("Error fetching price:", e);
      return null;
    }
  }

  const handleConfirm = async (id: string, quantity: number) => {
    const fetchedPrice = await priceFetching(id);
    if (fetchedPrice === null) {
      console.warn("Cannot confirm transaction: price not fetched.");
      return;
    }
    const newSubtotal = fetchedPrice * quantity;
    const newTaxes = Math.round(newSubtotal * 0.03);
    const newTotal = newSubtotal + newTaxes;

    try {
      const response = await axios.post("http://localhost:4000/price-transaction", {
        id,
        price: fetchedPrice,
        quantity,
        total: newTotal,
      });
      console.log("Transaction success:", response.data);

      

      // Navigate on success
      navigate("/confirmation", {
        state: {
          id,
          quantity,
          subtotal: newSubtotal,
          taxes: newTaxes,
          total: newTotal,
        },
      });
    } catch (error) {
      console.error("Transaction error:", error);
      // Optionally show error to user
    }
  };

  useEffect(() => {
    if (id) {
      getCryptoDetails(id)
        .then((response) => {
          console.log("Fetched crypto details:", response.data);
          setCryptoDetails(response.data);
          // optionally fetch price on load too:
          priceFetching(id);
        })
        .catch((err) => {
          console.error("Failed to fetch crypto details:", err);
        });
    }
  }, [id]);

  if (!cryptoDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Crypto details not found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <CryptoDetails {...cryptoDetails} />
      <div className="flex justify-center mt-8 mb-12 px-4 max-w-7xl mx-auto">
        <div className="lg:col-span-1 w-full max-w-3xl">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm sticky top-24">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Starts at</span>
                <span className="text-2xl font-bold">₹{price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                onClick={() => handleConfirm(cryptoDetails.id, quantity)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoDetailsComponent;
