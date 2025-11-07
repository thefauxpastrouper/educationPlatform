import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Combined type using your full JSON structure
export interface CategoryCardProps {
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

const CategoryCard = ({
  id,
  name,
  slug,
  coins_count,
  market_cap_1h_change,
  data,
}: CategoryCardProps) => {
  const {
    market_cap,
    total_volume,
    market_cap_change_percentage_24h,
  } = data;

  const market_cap_change_percentage_24h_usd =
    market_cap_change_percentage_24h?.usd ?? 0;

  const isPositive24h = market_cap_change_percentage_24h_usd >= 0;
  const isPositive1h = market_cap_1h_change >= 0;

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "$0.00";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const handleViewDetails = () => {
    console.log(`Viewing details for category: ${slug}`);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{name}</h3>
            <div
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                isPositive1h
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPositive1h ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(market_cap_1h_change).toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Coins className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{coins_count} coins in category</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="font-semibold">{formatNumber(market_cap)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="font-semibold">{formatNumber(total_volume)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">24h Change</span>
            <span
              className={`font-bold text-xl ${
                isPositive24h ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive24h ? "+" : ""}
              {market_cap_change_percentage_24h_usd.toFixed(2)}%
            </span>
          </div>

          <Link to={`/categories/${id}`}>
            <button
              onClick={handleViewDetails}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
