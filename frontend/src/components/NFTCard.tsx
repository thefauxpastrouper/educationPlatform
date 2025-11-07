
import { TrendingUp, TrendingDown } from "lucide-react";

interface NFTCardProps {
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

const NFTCard = ({
  id,
  name,
  symbol,
  thumb,
  native_currency_symbol,
  floor_price_in_native_currency,
  floor_price_24h_percentage_change,
  data,
}: NFTCardProps) => {
  const isPriceUp = floor_price_24h_percentage_change > 0;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={thumb}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{name}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-mono font-semibold">{symbol}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium">{data.h24_volume}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Sale</span>
            <span className="font-medium">{data.h24_average_sale_price}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Floor Price</span>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl">
                {floor_price_in_native_currency.toFixed(2)} {native_currency_symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {isPriceUp ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPriceUp ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPriceUp ? "+" : ""}
                {floor_price_24h_percentage_change.toFixed(2)}%
              </span>
            </div>
          </div>
          <a href={`/nft/${id}`}>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
              View Details
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;