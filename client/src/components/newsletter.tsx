import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Bell, TrendingUp, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setEmail("");
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our newsletter. You'll receive exclusive bonuses and updates.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Bonuses",
      description: "Access subscriber-only casino bonuses and promotions"
    },
    {
      icon: Bell,
      title: "First to Know",
      description: "Get notified about new casinos and special offers first"
    },
    {
      icon: TrendingUp,
      title: "Expert Insights",
      description: "Weekly market analysis and gaming strategy tips"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-turquoise/10 rounded-full mb-4">
              <Mail className="h-8 w-8 text-turquoise" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              📧 Stay Updated with Premium Bonuses
            </h2>
            <p className="text-muted-foreground text-lg">
              Get exclusive casino bonuses, industry news, and expert tips delivered to your inbox weekly
            </p>
          </div>
          
          <Card className="max-w-md mx-auto mb-12">
            <CardContent className="p-6">
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-turquoise hover:bg-turquoise/90 whitespace-nowrap"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join 375,000+ smart players. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Newsletter Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-turquoise text-white rounded-full mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">375,000+ subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Weekly exclusive bonuses</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">No spam guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
