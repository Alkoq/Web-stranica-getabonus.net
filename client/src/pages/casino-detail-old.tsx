import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Star, 
  Shield, 
  Calendar, 
  CreditCard, 
  Gamepad2,
  ArrowLeft,
  Award,
  Users
} from "lucide-react";
import type { Casino, Bonus } from "@shared/schema";

export default function CasinoDetailPage() {
  const { id } = useParams();
  
  const { data: casino, isLoading: casinoLoading } = useQuery<Casino>({
    queryKey: ['/api/casinos', id],
    enabled: !!id
  });

  const { data: bonuses, isLoading: bonusesLoading } = useQuery<Bonus[]>({
    queryKey: ['/api/bonuses', id],
    enabled: !!id
  });

  if (casinoLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!casino) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/casinos">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Casinos
          </Button>
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Casino not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The casino with this ID does not exist or is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Link href="/casinos">
        <Button variant="ghost" className="mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Nazad na Kasina
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <img
          src={casino.logoUrl || ''}
          alt={`${casino.name} logo`}
          className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
          data-testid="img-casino-logo"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-casino-name">
            {casino.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4" data-testid="text-casino-description">
            {casino.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-semibold" data-testid="text-safety-index">
                Safety: {casino.safetyIndex}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold" data-testid="text-user-rating">
                {casino.userRating} ({casino.totalReviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span data-testid="text-established">
                Est. {casino.establishedYear}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            asChild 
            size="lg" 
            className="bg-orange hover:bg-orange/90"
            data-testid="button-play-now"
          >
            <a href={casino.affiliateUrl || ''} target="_blank" rel="noopener noreferrer">
              Play Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            asChild
            data-testid="button-visit-website"
          >
            <a href={casino.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bonuses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Available Bonuses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bonusesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : bonuses && bonuses.length > 0 ? (
                <div className="space-y-4">
                  {bonuses.map((bonus) => (
                    <div 
                      key={bonus.id}
                      className="p-4 border rounded-lg bg-gradient-to-r from-turquoise/5 to-orange/5 border-turquoise/20"
                      data-testid={`bonus-${bonus.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg" data-testid="text-bonus-title">
                          {bonus.title}
                        </h3>
                        <Badge variant="secondary" data-testid="text-bonus-type">
                          {bonus.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2" data-testid="text-bonus-description">
                        {bonus.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="font-medium" data-testid="text-bonus-amount">
                          Amount: {bonus.amount}
                        </span>
                        {bonus.wageringRequirement && (
                          <span data-testid="text-bonus-wagering">
                            Wagering: {bonus.wageringRequirement}
                          </span>
                        )}
                      </div>
                      {bonus.terms && (
                        <p className="text-xs text-gray-500 mt-2" data-testid="text-bonus-terms">
                          {bonus.terms}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500" data-testid="text-no-bonuses">
                  Nema dostupnih bonusa trenutno.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {casino.features?.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="justify-center p-2"
                    data-testid={`feature-${index}`}
                  >
                    {feature}
                  </Badge>
                )) || <p className="text-gray-500">No features listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* Game Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Game Provideri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {casino.gameProviders?.map((provider, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg text-center bg-gray-50 dark:bg-gray-800"
                    data-testid={`provider-${index}`}
                  >
                    <span className="text-sm font-medium">{provider}</span>
                  </div>
                )) || <p className="text-gray-500">No game providers listed</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>License</Label>
                <p className="font-medium" data-testid="text-license">{casino.license || 'N/A'}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label>Safety Index</Label>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(parseFloat(casino.safetyIndex || '0') / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-green-500" data-testid="text-safety-score">
                    {casino.safetyIndex || '0'}/10
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  User Ratings
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= parseFloat(casino.userRating || '0')
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium" data-testid="text-rating-value">
                    {casino.userRating || '0'}
                  </span>
                  <span className="text-sm text-gray-500" data-testid="text-review-count">
                    ({casino.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {casino.paymentMethods?.map((method, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    data-testid={`payment-${index}`}
                  >
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{method}</span>
                  </div>
                )) || <p className="text-gray-500">No payment methods listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* Supported Currencies */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {casino.supportedCurrencies?.map((currency, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    data-testid={`currency-${index}`}
                  >
                    {currency}
                  </Badge>
                )) || <p className="text-gray-500">No currencies listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-turquoise/10 to-orange/10 border-turquoise/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Ready to play?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Start your casino adventure today!
              </p>
              <Button 
                asChild 
                size="lg" 
                className="w-full bg-orange hover:bg-orange/90"
                data-testid="button-cta-play"
              >
                <a href={casino.affiliateUrl || casino.websiteUrl} target="_blank" rel="noopener noreferrer">
                  Play at {casino.name}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className = "", ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`} {...props}>
      {children}
    </div>
  );
}