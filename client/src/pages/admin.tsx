import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Save, Gift, Gamepad2, FileText, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface CasinoForm {
  name: string;
  description: string;
  websiteUrl: string;
  affiliateUrl: string;
  safetyIndex: string;
  userRating: string;
  totalReviews: number;
  establishedYear: number;
  license: string;
  paymentMethods: string[];
  supportedCurrencies: string[];
  gameProviders: string[];
  features: string[];
  isFeatured: boolean;
}

interface BonusForm {
  casinoId: string;
  title: string;
  description: string;
  type: string;
  amount: string;
  wageringRequirement: string;
  minDeposit: string;
  maxWin: string;
  validUntil: string;
  terms: string;
  code: string;
  isFeatured: boolean;
}

interface GameForm {
  name: string;
  description: string;
  provider: string;
  type: string;
  rtp: string;
  volatility: string;
  minBet: string;
  maxBet: string;
  imageUrl: string;
  demoUrl: string;
  tags: string[];
}

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readTime: number;
  isPublished: boolean;
}

interface RatingForm {
  casinoId: string;
  bonusesRating: string;
  designRating: string;
  payoutsRating: string;
  customerSupportRating: string;
  gameSelectionRating: string;
  mobileExperienceRating: string;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'casinos' | 'bonuses' | 'games' | 'blog' | 'ratings'>('casinos');
  
  // Get casinos for dropdowns
  const { data: casinos = [] } = useQuery({
    queryKey: ['/api/casinos'],
    queryFn: () => fetch('/api/casinos').then(res => res.json())
  });
  
  const [casinoForm, setCasinoForm] = useState<CasinoForm>({
    name: '',
    description: '',
    websiteUrl: '',
    affiliateUrl: '',
    safetyIndex: '',
    userRating: '',
    totalReviews: 0,
    establishedYear: new Date().getFullYear(),
    license: '',
    paymentMethods: [],
    supportedCurrencies: [],
    gameProviders: [],
    features: [],
    isFeatured: false
  });

  const [bonusForm, setBonusForm] = useState<BonusForm>({
    casinoId: '',
    title: '',
    description: '',
    type: 'welcome',
    amount: '',
    wageringRequirement: '',
    minDeposit: '',
    maxWin: '',
    validUntil: '',
    terms: '',
    code: '',
    isFeatured: false
  });

  const [gameForm, setGameForm] = useState<GameForm>({
    name: '',
    description: '',
    provider: '',
    type: 'slot',
    rtp: '',
    volatility: 'medium',
    minBet: '',
    maxBet: '',
    imageUrl: '',
    demoUrl: '',
    tags: []
  });

  const [blogForm, setBlogForm] = useState<BlogForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'guides',
    tags: [],
    readTime: 0,
    isPublished: false
  });

  const [ratingForm, setRatingForm] = useState<RatingForm>({
    casinoId: '',
    bonusesRating: '',
    designRating: '',
    payoutsRating: '',
    customerSupportRating: '',
    gameSelectionRating: '',
    mobileExperienceRating: ''
  });

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  const addToArray = (field: keyof Pick<CasinoForm, 'paymentMethods' | 'supportedCurrencies' | 'gameProviders' | 'features'>, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setCasinoForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: keyof Pick<CasinoForm, 'paymentMethods' | 'supportedCurrencies' | 'gameProviders' | 'features'>, index: number) => {
    setCasinoForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/casinos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(casinoForm),
      });
      
      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Casino je uspješno dodano!",
        });
        
        // Reset form
        setCasinoForm({
          name: '',
          description: '',
          websiteUrl: '',
          affiliateUrl: '',
          safetyIndex: '',
          userRating: '',
          totalReviews: 0,
          establishedYear: new Date().getFullYear(),
          license: '',
          paymentMethods: [],
          supportedCurrencies: [],
          gameProviders: [],
          features: [],
          isFeatured: false
        });
      } else {
        throw new Error('Greška pri dodavanju casino-a');
      }
    } catch (error) {
      toast({
        title: "Greška",
        description: "Nije moguće dodati casino. Pokušajte ponovo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Dodajte i upravljajte casino podacima
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8">
        <Button
          variant={activeTab === 'casinos' ? 'default' : 'outline'}
          onClick={() => setActiveTab('casinos')}
          data-testid="tab-casinos"
        >
          Kasina
        </Button>
        <Button
          variant={activeTab === 'bonuses' ? 'default' : 'outline'}
          onClick={() => setActiveTab('bonuses')}
          data-testid="tab-bonuses"
        >
          Bonusi
        </Button>
        <Button
          variant={activeTab === 'games' ? 'default' : 'outline'}
          onClick={() => setActiveTab('games')}
          data-testid="tab-games"
        >
          Igrice
        </Button>
        <Button
          variant={activeTab === 'blog' ? 'default' : 'outline'}
          onClick={() => setActiveTab('blog')}
          data-testid="tab-blog"
        >
          Vijesti
        </Button>
        <Button
          variant={activeTab === 'ratings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('ratings')}
          data-testid="tab-ratings"
        >
          Ocjene
        </Button>
      </div>

      {activeTab === 'casinos' && (
        <Card>
          <CardHeader>
            <CardTitle>Dodaj Novi Casino</CardTitle>
            <CardDescription>
              Unesite sve potrebne informacije o casino-u
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Naziv Casino-a *</Label>
                  <Input
                    id="name"
                    value={casinoForm.name}
                    onChange={(e) => setCasinoForm({...casinoForm, name: e.target.value})}
                    placeholder="npr. Stake"
                    required
                    data-testid="input-casino-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="license">Licenca</Label>
                  <Input
                    id="license"
                    value={casinoForm.license}
                    onChange={(e) => setCasinoForm({...casinoForm, license: e.target.value})}
                    placeholder="npr. Curacao eGaming"
                    data-testid="input-license"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  value={casinoForm.description}
                  onChange={(e) => setCasinoForm({...casinoForm, description: e.target.value})}
                  placeholder="Kratki opis casino-a..."
                  rows={3}
                  data-testid="textarea-description"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={casinoForm.websiteUrl}
                    onChange={(e) => setCasinoForm({...casinoForm, websiteUrl: e.target.value})}
                    placeholder="https://casino.com"
                    required
                    data-testid="input-website-url"
                  />
                </div>
                
                <div>
                  <Label htmlFor="affiliateUrl">Affiliate URL *</Label>
                  <Input
                    id="affiliateUrl"
                    type="url"
                    value={casinoForm.affiliateUrl}
                    onChange={(e) => setCasinoForm({...casinoForm, affiliateUrl: e.target.value})}
                    placeholder="https://casino.com/ref/yourid"
                    required
                    data-testid="input-affiliate-url"
                  />
                </div>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="safetyIndex">Safety Index</Label>
                  <Input
                    id="safetyIndex"
                    value={casinoForm.safetyIndex}
                    onChange={(e) => setCasinoForm({...casinoForm, safetyIndex: e.target.value})}
                    placeholder="8.5"
                    data-testid="input-safety-index"
                  />
                </div>
                
                <div>
                  <Label htmlFor="userRating">User Rating</Label>
                  <Input
                    id="userRating"
                    value={casinoForm.userRating}
                    onChange={(e) => setCasinoForm({...casinoForm, userRating: e.target.value})}
                    placeholder="4.5"
                    data-testid="input-user-rating"
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalReviews">Broj Recenzija</Label>
                  <Input
                    id="totalReviews"
                    type="number"
                    value={casinoForm.totalReviews}
                    onChange={(e) => setCasinoForm({...casinoForm, totalReviews: parseInt(e.target.value) || 0})}
                    placeholder="1000"
                    data-testid="input-total-reviews"
                  />
                </div>
                
                <div>
                  <Label htmlFor="establishedYear">Godina Osnivanja</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={casinoForm.establishedYear}
                    onChange={(e) => setCasinoForm({...casinoForm, establishedYear: parseInt(e.target.value) || new Date().getFullYear()})}
                    placeholder="2020"
                    data-testid="input-established-year"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <Label>Payment Methods</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentPaymentMethod}
                    onChange={(e) => setCurrentPaymentMethod(e.target.value)}
                    placeholder="npr. Bitcoin"
                    data-testid="input-payment-method"
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray('paymentMethods', currentPaymentMethod, setCurrentPaymentMethod)}
                    data-testid="button-add-payment-method"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {casinoForm.paymentMethods.map((method, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {method}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromArray('paymentMethods', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Supported Currencies */}
              <div>
                <Label>Supported Currencies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentCurrency}
                    onChange={(e) => setCurrentCurrency(e.target.value)}
                    placeholder="npr. BTC"
                    data-testid="input-currency"
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray('supportedCurrencies', currentCurrency, setCurrentCurrency)}
                    data-testid="button-add-currency"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {casinoForm.supportedCurrencies.map((currency, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {currency}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromArray('supportedCurrencies', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Game Providers */}
              <div>
                <Label>Game Providers</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentProvider}
                    onChange={(e) => setCurrentProvider(e.target.value)}
                    placeholder="npr. Pragmatic Play"
                    data-testid="input-game-provider"
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray('gameProviders', currentProvider, setCurrentProvider)}
                    data-testid="button-add-provider"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {casinoForm.gameProviders.map((provider, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {provider}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromArray('gameProviders', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="npr. Mobile Optimized"
                    data-testid="input-feature"
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray('features', currentFeature, setCurrentFeature)}
                    data-testid="button-add-feature"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {casinoForm.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromArray('features', index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={casinoForm.isFeatured}
                  onChange={(e) => setCasinoForm({...casinoForm, isFeatured: e.target.checked})}
                  data-testid="checkbox-featured"
                />
                <Label htmlFor="isFeatured">Featured Casino</Label>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-casino">
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj Casino
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'bonuses' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Dodaj Novi Bonus
            </CardTitle>
            <CardDescription>
              Dodajte bonus promotions za izabrani casino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonus-casino">Casino *</Label>
                  <Select value={bonusForm.casinoId} onValueChange={(value) => setBonusForm({...bonusForm, casinoId: value})}>
                    <SelectTrigger data-testid="select-bonus-casino">
                      <SelectValue placeholder="Izaberite casino" />
                    </SelectTrigger>
                    <SelectContent>
                      {casinos.map((casino: any) => (
                        <SelectItem key={casino.id} value={casino.id}>
                          {casino.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bonus-type">Tip Bonusa *</Label>
                  <Select value={bonusForm.type} onValueChange={(value) => setBonusForm({...bonusForm, type: value})}>
                    <SelectTrigger data-testid="select-bonus-type">
                      <SelectValue placeholder="Izaberite tip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Bonus</SelectItem>
                      <SelectItem value="no_deposit">No Deposit</SelectItem>
                      <SelectItem value="free_spins">Free Spins</SelectItem>
                      <SelectItem value="cashback">Cashback</SelectItem>
                      <SelectItem value="reload">Reload Bonus</SelectItem>
                      <SelectItem value="vip">VIP Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bonus-title">Naziv Bonusa *</Label>
                <Input
                  id="bonus-title"
                  value={bonusForm.title}
                  onChange={(e) => setBonusForm({...bonusForm, title: e.target.value})}
                  placeholder="npr. 200% Welcome Bonus + 100 Free Spins"
                  data-testid="input-bonus-title"
                />
              </div>

              <div>
                <Label htmlFor="bonus-description">Opis</Label>
                <Textarea
                  id="bonus-description"
                  value={bonusForm.description}
                  onChange={(e) => setBonusForm({...bonusForm, description: e.target.value})}
                  placeholder="Detaljno objašnjenje bonusa..."
                  data-testid="textarea-bonus-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bonus-amount">Iznos Bonusa</Label>
                  <Input
                    id="bonus-amount"
                    value={bonusForm.amount}
                    onChange={(e) => setBonusForm({...bonusForm, amount: e.target.value})}
                    placeholder="npr. 200%, $500, 100 FS"
                    data-testid="input-bonus-amount"
                  />
                </div>

                <div>
                  <Label htmlFor="bonus-wagering">Wagering Requirement</Label>
                  <Input
                    id="bonus-wagering"
                    value={bonusForm.wageringRequirement}
                    onChange={(e) => setBonusForm({...bonusForm, wageringRequirement: e.target.value})}
                    placeholder="npr. 35x"
                    data-testid="input-bonus-wagering"
                  />
                </div>

                <div>
                  <Label htmlFor="bonus-min-deposit">Min. Deposit</Label>
                  <Input
                    id="bonus-min-deposit"
                    value={bonusForm.minDeposit}
                    onChange={(e) => setBonusForm({...bonusForm, minDeposit: e.target.value})}
                    placeholder="npr. $20"
                    data-testid="input-bonus-min-deposit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonus-max-win">Max Win</Label>
                  <Input
                    id="bonus-max-win"
                    value={bonusForm.maxWin}
                    onChange={(e) => setBonusForm({...bonusForm, maxWin: e.target.value})}
                    placeholder="npr. $1000"
                    data-testid="input-bonus-max-win"
                  />
                </div>

                <div>
                  <Label htmlFor="bonus-code">Bonus Code</Label>
                  <Input
                    id="bonus-code"
                    value={bonusForm.code}
                    onChange={(e) => setBonusForm({...bonusForm, code: e.target.value})}
                    placeholder="npr. WELCOME200"
                    data-testid="input-bonus-code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bonus-valid-until">Vrijedi Do</Label>
                <Input
                  id="bonus-valid-until"
                  type="date"
                  value={bonusForm.validUntil}
                  onChange={(e) => setBonusForm({...bonusForm, validUntil: e.target.value})}
                  data-testid="input-bonus-valid-until"
                />
              </div>

              <div>
                <Label htmlFor="bonus-terms">Uvjeti Bonusa</Label>
                <Textarea
                  id="bonus-terms"
                  value={bonusForm.terms}
                  onChange={(e) => setBonusForm({...bonusForm, terms: e.target.value})}
                  placeholder="Detaljan opis uvjeta i odredbi..."
                  rows={4}
                  data-testid="textarea-bonus-terms"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bonus-featured"
                  checked={bonusForm.isFeatured}
                  onCheckedChange={(checked) => setBonusForm({...bonusForm, isFeatured: !!checked})}
                  data-testid="checkbox-bonus-featured"
                />
                <Label htmlFor="bonus-featured">Featured Bonus</Label>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-bonus">
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj Bonus
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'games' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Dodaj Novu Igru
            </CardTitle>
            <CardDescription>
              Dodajte informacije o casino igrama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="game-name">Naziv Igre *</Label>
                  <Input
                    id="game-name"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                    placeholder="npr. Book of Dead"
                    data-testid="input-game-name"
                  />
                </div>

                <div>
                  <Label htmlFor="game-provider">Provider *</Label>
                  <Input
                    id="game-provider"
                    value={gameForm.provider}
                    onChange={(e) => setGameForm({...gameForm, provider: e.target.value})}
                    placeholder="npr. Play'n GO"
                    data-testid="input-game-provider"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="game-description">Opis</Label>
                <Textarea
                  id="game-description"
                  value={gameForm.description}
                  onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                  placeholder="Kratak opis igre..."
                  data-testid="textarea-game-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="game-type">Tip Igre *</Label>
                  <Select value={gameForm.type} onValueChange={(value) => setGameForm({...gameForm, type: value})}>
                    <SelectTrigger data-testid="select-game-type">
                      <SelectValue placeholder="Izaberite tip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slot">Slot Machine</SelectItem>
                      <SelectItem value="table">Table Game</SelectItem>
                      <SelectItem value="live">Live Casino</SelectItem>
                      <SelectItem value="video_poker">Video Poker</SelectItem>
                      <SelectItem value="specialty">Specialty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="game-volatility">Volatility</Label>
                  <Select value={gameForm.volatility} onValueChange={(value) => setGameForm({...gameForm, volatility: value})}>
                    <SelectTrigger data-testid="select-game-volatility">
                      <SelectValue placeholder="Izaberite volatility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="game-rtp">RTP (%)</Label>
                  <Input
                    id="game-rtp"
                    value={gameForm.rtp}
                    onChange={(e) => setGameForm({...gameForm, rtp: e.target.value})}
                    placeholder="npr. 96.50"
                    data-testid="input-game-rtp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="game-min-bet">Min Bet</Label>
                  <Input
                    id="game-min-bet"
                    value={gameForm.minBet}
                    onChange={(e) => setGameForm({...gameForm, minBet: e.target.value})}
                    placeholder="npr. 0.10"
                    data-testid="input-game-min-bet"
                  />
                </div>

                <div>
                  <Label htmlFor="game-max-bet">Max Bet</Label>
                  <Input
                    id="game-max-bet"
                    value={gameForm.maxBet}
                    onChange={(e) => setGameForm({...gameForm, maxBet: e.target.value})}
                    placeholder="npr. 100.00"
                    data-testid="input-game-max-bet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="game-image">Image URL</Label>
                  <Input
                    id="game-image"
                    value={gameForm.imageUrl}
                    onChange={(e) => setGameForm({...gameForm, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-game-image"
                  />
                </div>

                <div>
                  <Label htmlFor="game-demo">Demo URL</Label>
                  <Input
                    id="game-demo"
                    value={gameForm.demoUrl}
                    onChange={(e) => setGameForm({...gameForm, demoUrl: e.target.value})}
                    placeholder="https://demo.example.com/game"
                    data-testid="input-game-demo"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-game">
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj Igru
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'blog' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dodaj Novi Blog Post
            </CardTitle>
            <CardDescription>
              Kreirajte vijesti, vodiče i ostali sadržaj
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blog-title">Naslov *</Label>
                  <Input
                    id="blog-title"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    placeholder="npr. Najbolji Bitcoin Casino Bonusi 2024"
                    data-testid="input-blog-title"
                  />
                </div>

                <div>
                  <Label htmlFor="blog-slug">Slug *</Label>
                  <Input
                    id="blog-slug"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                    placeholder="najbolji-bitcoin-casino-bonusi-2024"
                    data-testid="input-blog-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blog-excerpt">Kratki Opis</Label>
                <Textarea
                  id="blog-excerpt"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                  placeholder="Kratki opis članka..."
                  data-testid="textarea-blog-excerpt"
                />
              </div>

              <div>
                <Label htmlFor="blog-content">Sadržaj *</Label>
                <Textarea
                  id="blog-content"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                  placeholder="Kompletan sadržaj članka..."
                  rows={10}
                  data-testid="textarea-blog-content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blog-category">Kategorija *</Label>
                  <Select value={blogForm.category} onValueChange={(value) => setBlogForm({...blogForm, category: value})}>
                    <SelectTrigger data-testid="select-blog-category">
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guides">Vodiči</SelectItem>
                      <SelectItem value="news">Vijesti</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="bonuses">Bonusi</SelectItem>
                      <SelectItem value="strategies">Strategije</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="blog-read-time">Vrijeme Čitanja (min)</Label>
                  <Input
                    id="blog-read-time"
                    type="number"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({...blogForm, readTime: parseInt(e.target.value) || 0})}
                    placeholder="5"
                    data-testid="input-blog-read-time"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blog-image">Featured Image URL</Label>
                <Input
                  id="blog-image"
                  value={blogForm.featuredImage}
                  onChange={(e) => setBlogForm({...blogForm, featuredImage: e.target.value})}
                  placeholder="https://example.com/featured-image.jpg"
                  data-testid="input-blog-image"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blog-published"
                  checked={blogForm.isPublished}
                  onCheckedChange={(checked) => setBlogForm({...blogForm, isPublished: !!checked})}
                  data-testid="checkbox-blog-published"
                />
                <Label htmlFor="blog-published">Objavi Odmah</Label>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-blog">
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj Blog Post
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ratings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ocjene Casino-a
            </CardTitle>
            <CardDescription>
              Dodajte detaljne ocjene za casino po kategorijama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <Label htmlFor="rating-casino">Casino *</Label>
                <Select value={ratingForm.casinoId} onValueChange={(value) => setRatingForm({...ratingForm, casinoId: value})}>
                  <SelectTrigger data-testid="select-rating-casino">
                    <SelectValue placeholder="Izaberite casino" />
                  </SelectTrigger>
                  <SelectContent>
                    {casinos.map((casino: any) => (
                      <SelectItem key={casino.id} value={casino.id}>
                        {casino.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating-bonuses">Bonusi (1-10)</Label>
                  <Input
                    id="rating-bonuses"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.bonusesRating}
                    onChange={(e) => setRatingForm({...ratingForm, bonusesRating: e.target.value})}
                    placeholder="8.5"
                    data-testid="input-rating-bonuses"
                  />
                </div>

                <div>
                  <Label htmlFor="rating-design">Dizajn Stranice (1-10)</Label>
                  <Input
                    id="rating-design"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.designRating}
                    onChange={(e) => setRatingForm({...ratingForm, designRating: e.target.value})}
                    placeholder="9.0"
                    data-testid="input-rating-design"
                  />
                </div>

                <div>
                  <Label htmlFor="rating-payouts">Isplate (1-10)</Label>
                  <Input
                    id="rating-payouts"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.payoutsRating}
                    onChange={(e) => setRatingForm({...ratingForm, payoutsRating: e.target.value})}
                    placeholder="8.7"
                    data-testid="input-rating-payouts"
                  />
                </div>

                <div>
                  <Label htmlFor="rating-support">Korisnička Podrška (1-10)</Label>
                  <Input
                    id="rating-support"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.customerSupportRating}
                    onChange={(e) => setRatingForm({...ratingForm, customerSupportRating: e.target.value})}
                    placeholder="8.0"
                    data-testid="input-rating-support"
                  />
                </div>

                <div>
                  <Label htmlFor="rating-games">Izbor Igara (1-10)</Label>
                  <Input
                    id="rating-games"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.gameSelectionRating}
                    onChange={(e) => setRatingForm({...ratingForm, gameSelectionRating: e.target.value})}
                    placeholder="9.2"
                    data-testid="input-rating-games"
                  />
                </div>

                <div>
                  <Label htmlFor="rating-mobile">Mobilno Iskustvo (1-10)</Label>
                  <Input
                    id="rating-mobile"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ratingForm.mobileExperienceRating}
                    onChange={(e) => setRatingForm({...ratingForm, mobileExperienceRating: e.target.value})}
                    placeholder="8.8"
                    data-testid="input-rating-mobile"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" data-testid="button-save-rating">
                <Save className="h-4 w-4 mr-2" />
                Sačuvaj Ocjene
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}