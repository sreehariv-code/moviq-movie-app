import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, DollarSign, ShoppingCart } from "lucide-react";
import type { WatchProviders as WatchProvidersType, WatchProvider } from "@/types/tmdb";

interface WatchProvidersProps {
  providers: WatchProvidersType | null | undefined;
  link?: string | null;
}

const WatchProviders: React.FC<WatchProvidersProps> = ({ providers, link }) => {
  if (!providers) return null;

  const { flatrate, rent, buy } = providers;
  const hasAnyProviders = flatrate?.length || rent?.length || buy?.length;

  if (!hasAnyProviders) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Where to Watch
        </h2>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            JustWatch
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="space-y-6">
        {/* Streaming Services (Subscription) */}
        {flatrate && flatrate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-sm">Stream</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {flatrate.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Options */}
        {rent && rent.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-sm">Rent</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {rent.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}

        {/* Buy Options */}
        {buy && buy.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold text-sm">Buy</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {buy.map((provider) => (
                <ProviderLogo key={provider.provider_id} provider={provider} />
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Availability may vary by region. Powered by JustWatch.
      </p>
    </motion.div>
  );
};

// Provider logo component
interface ProviderLogoProps {
  provider: WatchProvider;
}

const ProviderLogo: React.FC<ProviderLogoProps> = ({ provider }) => {
  const logoUrl = provider.logo_path
    ? `https://image.tmdb.org/t/p/original${provider.logo_path}`
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group relative"
      title={provider.provider_name}
    >
      {logoUrl ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-md group-hover:shadow-lg transition-shadow">
          <img
            src={logoUrl}
            alt={provider.provider_name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
          <span className="text-xs font-medium text-center px-1">
            {provider.provider_name.substring(0, 4)}
          </span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {provider.provider_name}
      </div>
    </motion.div>
  );
};

export default WatchProviders;
