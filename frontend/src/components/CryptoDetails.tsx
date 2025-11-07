import { TrendingUp, TrendingDown } from "lucide-react";

export interface EthereumData {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  asset_platform_id: null;
  platforms: {
    "": string;
  };
  detail_platforms: {
    "": {
      decimal_place: null;
      contract_address: string;
    };
  };
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  preview_listing: boolean;
  public_notice: null;
  additional_notices: any[];
  localization: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: any[];
    chat_url: any[];
    announcement_url: any[];
    snapshot_url: null;
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: any[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  ico_data: {
    ico_start_date: string;
    ico_end_date: string;
    short_desc: string;
    description: null;
    links: Record<string, never>;
    softcap_currency: string;
    hardcap_currency: string;
    total_raised_currency: string;
    softcap_amount: null;
    hardcap_amount: null;
    total_raised: null;
    quote_pre_sale_currency: string;
    base_pre_sale_amount: null;
    quote_pre_sale_amount: null;
    quote_public_sale_currency: string;
    base_public_sale_amount: number;
    quote_public_sale_amount: number;
    accepting_currencies: string;
    country_origin: string;
    pre_sale_start_date: null;
    pre_sale_end_date: null;
    whitelist_url: string;
    whitelist_start_date: null;
    whitelist_end_date: null;
    bounty_detail_url: string;
    amount_for_sale: null;
    kyc_required: boolean;
    whitelist_available: null;
    pre_sale_available: null;
    pre_sale_ended: boolean;
  };
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: {
    current_price: {
      [currency: string]: number;
    };
    total_value_locked: null;
    mcap_to_tvl_ratio: null;
    fdv_to_tvl_ratio: null;
    roi: {
      times: number;
      currency: string;
      percentage: number;
    };
    ath: {
      [currency: string]: number;
    };
    ath_change_percentage: {
      [currency: string]: number;
    };
    ath_date: {
      [currency: string]: string;
    };
    atl: {
      [currency: string]: number;
    };
    atl_change_percentage: {
      [currency: string]: number;
    };
    atl_date: {
      [currency: string]: string;
    };
    market_cap: {
      [currency: string]: number;
    };
    market_cap_rank: number;
    fully_diluted_valuation: {
      [currency: string]: number;
    };
    market_cap_fdv_ratio: number;
    total_volume: {
      [currency: string]: number;
    };
    high_24h: {
      [currency: string]: number;
    };
    low_24h: {
      [currency: string]: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_1h_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_24h_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_7d_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_14d_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_30d_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_60d_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_200d_in_currency: {
      [currency: string]: number;
    };
    price_change_percentage_1y_in_currency: {
      [currency: string]: number;
    };
    market_cap_change_24h_in_currency: {
      [currency: string]: number;
    };
    market_cap_change_percentage_24h_in_currency: {
      [currency: string]: number;
    };
    total_supply: number;
    max_supply: null;
    max_supply_infinite: boolean;
    circulating_supply: number;
    last_updated: string;
  };
  community_data: {
    facebook_likes: null;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: null;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: any[];
  };
  status_updates: any[];
  last_updated: string;
  tickers: Array<{
    base: string;
    target: string;
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    last: number;
    volume: number;
    converted_last: {
      btc: number;
      eth: number;
      usd: number;
    };
    converted_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    trust_score: string;
    bid_ask_spread_percentage: number;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string | null;
    token_info_url: null;
    coin_id: string;
    target_coin_id?: string;
    coin_mcap_usd: number;
  }>;
}


const CryptoDetails = ({ image, name, market_data, symbol, developer_data,links, community_data, watchlist_portfolio_users }: EthereumData) => {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const priceChange24h = market_data.price_change_percentage_24h;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-4">
            <img src={image.large} alt={name} className="w-16 h-16 rounded-full" />
            <div>
              <div className="text-2xl font-semibold leading-none tracking-tight text-3xl">{name}</div>
              <p className="text-muted-foreground uppercase text-sm">{symbol}</p>
            </div>
            <div className="border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ml-auto">
              Rank #{market_data.market_cap_rank}
            </div>
          </div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">
              {formatCurrency(market_data.current_price.usd)}
            </span>
            <div className={`flex items-center gap-1 text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {formatPercentage(priceChange24h)}
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl font-semibold leading-none tracking-tight">Market Statistics</div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="text-xl font-bold">{formatCurrency(market_data.market_cap.usd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
              <p className="text-xl font-bold">{formatCurrency(market_data.total_volume.usd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Circulating Supply</p>
              <p className="text-xl font-bold">{market_data.circulating_supply.toLocaleString()} {symbol.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h High</p>
              <p className="text-xl font-bold">{formatCurrency(market_data.high_24h.usd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h Low</p>
              <p className="text-xl font-bold">{formatCurrency(market_data.low_24h.usd)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">All-Time High</p>
              <p className="text-xl font-bold">{formatCurrency(market_data.ath.usd)}</p>
              <p className={`text-xs ${market_data.ath_change_percentage.usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(market_data.ath_change_percentage.usd)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Changes */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="text-2xl font-semibold leading-none tracking-tight">Price Performance</div>
        </div>
        <div className="flex items-center p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">1 Hour</p>
              <p className={`text-lg font-semibold ${market_data.price_change_percentage_1h_in_currency?.usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(market_data.price_change_percentage_1h_in_currency?.usd || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">7 Days</p>
              <p className={`text-lg font-semibold ${market_data.price_change_percentage_7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(market_data.price_change_percentage_7d)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">30 Days</p>
              <p className={`text-lg font-semibold ${market_data.price_change_percentage_30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(market_data.price_change_percentage_30d)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">1 Year</p>
              <p className={`text-lg font-semibold ${market_data.price_change_percentage_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(market_data.price_change_percentage_1y)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community & Developer Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight">Community</div>
          </div>
          <div className="flex items-center p-6 pt-0">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reddit Subscribers</span>
              <span className="font-semibold">{community_data.reddit_subscribers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reddit Active (48h)</span>
              <span className="font-semibold">{community_data.reddit_accounts_active_48h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Watchlist Users</span>
              <span className="font-semibold">{watchlist_portfolio_users.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight">Developer Activity</div>
          </div>
          <div className="flex items-center p-6 pt-0 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">GitHub Stars</span>
              <span className="font-semibold">{developer_data.stars.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forks</span>
              <span className="font-semibold">{developer_data.forks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commits (4 weeks)</span>
              <span className="font-semibold">{developer_data.commit_count_4_weeks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      {links.homepage[0] && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight">Links</div>
          </div>
          <div className="flex items-center p-6 pt-0">
            <div className="flex flex-wrap gap-2">
              {links.homepage[0] && (
                <a href={links.homepage[0]} target="_blank" rel="noopener noreferrer">
                  <div className="text-foreground cursor-pointer hover:bg-accent">Website</div>
                </a>
              )}
              {links.whitepaper && (
                <a href={links.whitepaper} target="_blank" rel="noopener noreferrer">
                  <div className="text-foreground cursor-pointer hover:bg-accent">Whitepaper</div>
                </a>
              )}
              {links.repos_url.github[0] && (
                <a href={links.repos_url.github[0]} target="_blank" rel="noopener noreferrer">
                  <div className="text-foreground cursor-pointer hover:bg-accent">GitHub</div>
                </a>
              )}
              {links.subreddit_url && (
                <a href={links.subreddit_url} target="_blank" rel="noopener noreferrer">
                  <div className="text-foreground cursor-pointer hover:bg-accent">Reddit</div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDetails;