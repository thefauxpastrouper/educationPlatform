import Header from "./Header";
import api from "./AxiosRequest";
import type { AxiosPromise} from "axios";
import { useEffect, useState } from "react";
import StocksDashboard from "./StockDashboard";
import type { CoinGeckoTrendingResponse } from "./data/experiences";
import CoinCard from "./CoinCard";
import NFTCard from "./NFTCard";
import CategoryCard from "./CategoryCard";  

const getExperiences = async (): AxiosPromise<CoinGeckoTrendingResponse | null> => {
  console.log("Fetching experiences from API:", import.meta.env.VITE_API_BASE_URL);
  return api.get("/search/trending", {
    headers: {
      "Content-Type": "application/json",
      "x-cg-demo-api-key": import.meta.env.API_KEY
    }
  });
};
const Home = () => {
  const [experiences, setExperiences] = useState<CoinGeckoTrendingResponse | null>(null);

  useEffect(() => {
        getExperiences()
        .then((response) => {
          console.log("Fetched experiences:", response.data);
          setExperiences(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch experiences:", err);
        });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <StocksDashboard />
        
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold mb-2">Discover Trading</h1>
          <p className="text-muted-foreground">Curated experiences for traders and investors</p>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Trending Coins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {experiences?.coins.map((experience) => (
            <CoinCard key={experience.item.id} item={experience.item} />
          ))}
        </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Trending NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {experiences?.nfts.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
        </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Trending Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {experiences?.categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;