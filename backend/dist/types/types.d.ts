export default interface EthereumData {
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
//# sourceMappingURL=types.d.ts.map