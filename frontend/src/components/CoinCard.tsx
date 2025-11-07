import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoCardProps {
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

const CryptoCard = ({ item }: CryptoCardProps) => {
  const priceChange24h = item.data.price_change_percentage_24h.usd;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <img 
          src={item.large} 
          alt={item.name} 
          className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded uppercase">{item.symbol}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Rank #{item.market_cap_rank}</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="line-clamp-1">ID: {item.coin_id}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Current Price</span>
            <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{isPositive ? '+' : ''}{priceChange24h.toFixed(2)}%</span>
            </div>
          </div>
          <div className="font-bold text-2xl">${item.data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground">{item.data.price_btc} BTC</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
          <div>
            <div className="text-muted-foreground">Market Cap</div>
            <div className="font-semibold">{item.data.market_cap}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Volume 24h</div>
            <div className="font-semibold">{item.data.total_volume}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <img 
            src={item.data.sparkline} 
            alt="Price sparkline" 
            className="h-8 w-24 opacity-60"
          />
          <Link to={`/crypto/${item.id}`}>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;