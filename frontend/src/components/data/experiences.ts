export interface TimeSlotAndPrice {
  time: string;
  availableSeats: number;
  status: "available" | "sold out";
  price: number;
}

export interface DateAvailability {
  date: string; // using string here because date inputs usually return strings in the UI
  timeSlots: TimeSlotAndPrice[];
}

export interface Experience {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
  dateAvailability: DateAvailability[];
}

export interface CoinGeckoTrendingResponse {
  coins: TrendingCoinEntry[];
  categories: TrendingCategory[];
  nfts: TrendingNFT[];
}

/* ---------------- COINS ---------------- */
export interface TrendingCoinEntry {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: {
        usd: number;
        [key: string]: number;
      };
      market_cap: string;
      market_cap_btc: string;
      total_volume: string;
      total_volume_btc: string;
      sparkline: string;
      content: null | string;
    };
  };
}

/* ---------------- CATEGORIES ---------------- */
export interface TrendingCategory {
  id: number;
  name: string;
  slug: string;
  coins_count: string;
  market_cap_1h_change: number;
  data: {
    market_cap: number;
    total_volume: number;
    market_cap_change_percentage_24h: Record<string, number>;
    sparkline: string;
  };
}

/* ---------------- NFTs ---------------- */
export interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  native_currency_symbol: string;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
  data: {
    floor_price: string;
    floor_price_in_usd_24h_percentage_change: string;
    h24_volume: string;
    h24_average_sale_price: string;
    sparkline: string;
    content: null | string;
  };
}