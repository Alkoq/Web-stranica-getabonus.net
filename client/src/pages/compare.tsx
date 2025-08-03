import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CasinoComparison } from "@/components/casino/casino-comparison";
import { AIChatbot } from "@/components/ai-chatbot";
import { api } from "@/lib/api";
import type { Casino } from "@shared/schema";

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: casinos = [], isLoading } = useQuery<Casino[]>({
    queryKey: ['/api/casinos'],
    queryFn: () => api.getCasinos(),
  });

  const filteredCasinos = casinos.filter(casino => 
    casino.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    casino.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🔍 Compare Casinos Side-by-Side
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Make informed decisions by comparing casino features, bonuses, and safety ratings
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search casinos to compare..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison Tool */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading Casinos...</h3>
            <p className="text-muted-foreground">Please wait while we fetch casino data</p>
          </div>
        ) : (
          <CasinoComparison availableCasinos={filteredCasinos} />
        )}

        {/* Comparison Guide */}
        <section className="mt-16 bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">📊 How to Compare Casinos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Safety Index",
                description: "Our comprehensive safety rating based on licensing, fairness, and reputation",
                icon: "🛡️"
              },
              {
                title: "User Reviews",
                description: "Real player feedback and ratings from verified users",
                icon: "⭐"
              },
              {
                title: "Payment Methods",
                description: "Available deposit and withdrawal options including crypto",
                icon: "💳"
              },
              {
                title: "Game Selection",
                description: "Number of games, providers, and exclusive titles available",
                icon: "🎰"
              }
            ].map((guide, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Tips */}
        <section className="mt-12 bg-gradient-to-r from-turquoise to-blue-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">💡 Pro Comparison Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Key Factors to Consider:</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Safety Index and licensing information</li>
                <li>• Withdrawal processing times and limits</li>
                <li>• Bonus terms and wagering requirements</li>
                <li>• Customer support availability and quality</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Red Flags to Watch For:</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Unrealistic bonus offers or claims</li>
                <li>• Poor customer reviews or complaints</li>
                <li>• Unclear terms and conditions</li>
                <li>• Lack of proper licensing or regulation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Popular Comparisons */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">🔥 Popular Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Stake vs Roobet", desc: "Top crypto casinos compared" },
              { title: "BC.Game vs Rollbit", desc: "Multi-crypto platform battle" },
              { title: "Best No KYC Casinos", desc: "Anonymous gambling options" },
              { title: "High Roller Casinos", desc: "VIP and whale-friendly sites" },
              { title: "Mobile Casino Apps", desc: "Best mobile gaming experience" },
              { title: "Live Dealer Casinos", desc: "Immersive live gaming" }
            ].map((comparison, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
              >
                <div>
                  <div className="font-semibold">{comparison.title}</div>
                  <div className="text-sm text-muted-foreground">{comparison.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </section>
      </div>

      <AIChatbot />
    </div>
  );
}
