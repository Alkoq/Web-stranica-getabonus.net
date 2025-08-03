import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Save, Gift, Gamepad2, FileText, Star, LogOut } from "lucide-react";
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

export default function AdminPanelPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'casinos' | 'bonuses' | 'games' | 'blog' | 'ratings'>('casinos');
  
  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast({
        title: "Neautorizirani pristup",
        description: "Morate se prijaviti da pristupite admin panelu.",
        variant: "destructive",
      });
      setLocation('/admin');
      return;
    }
    
    // Verify token with backend
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        localStorage.removeItem('adminToken');
        toast({
          title: "Sesija je istekla",
          description: "Molimo prijavite se ponovo.",
          variant: "destructive",
        });
        setLocation('/admin');
      }
    }).catch(() => {
      localStorage.removeItem('adminToken');
      setLocation('/admin');
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Odjavljeni ste",
      description: "Uspješno ste se odjavili iz admin panela.",
    });
    setLocation('/');
  };

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

  // Array management helpers
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  const addToArray = (field: keyof CasinoForm, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      setCasinoForm(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setValue('');
    }
  };

  const removeFromArray = (field: keyof CasinoForm, index: number) => {
    setCasinoForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleCasinoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Casino dodan",
      description: `Casino "${casinoForm.name}" je uspješno dodan u bazu.`,
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upravljanje sadržajem GetABonus.net platforme
          </p>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="outline"
          className="flex items-center gap-2"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          Odjavi se
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="casinos" className="flex items-center gap-2" data-testid="tab-casinos">
            <Gift className="h-4 w-4" />
            Casinos
          </TabsTrigger>
          <TabsTrigger value="bonuses" className="flex items-center gap-2" data-testid="tab-bonuses">
            <Gift className="h-4 w-4" />
            Bonuses
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2" data-testid="tab-games">
            <Gamepad2 className="h-4 w-4" />
            Games
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2" data-testid="tab-blog">
            <FileText className="h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2" data-testid="tab-ratings">
            <Star className="h-4 w-4" />
            Ratings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="casinos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Dodaj Novi Casino
              </CardTitle>
              <CardDescription>
                Dodajte informacije o novom crypto casino-u
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCasinoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Naziv Casino-a *</Label>
                    <Input
                      id="name"
                      value={casinoForm.name}
                      onChange={(e) => setCasinoForm({...casinoForm, name: e.target.value})}
                      placeholder="npr. BitStarz Casino"
                      required
                      data-testid="input-casino-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="safetyIndex">Safety Index</Label>
                    <Input
                      id="safetyIndex"
                      value={casinoForm.safetyIndex}
                      onChange={(e) => setCasinoForm({...casinoForm, safetyIndex: e.target.value})}
                      placeholder="npr. 8.5/10"
                      data-testid="input-safety-index"
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
                    data-testid="textarea-casino-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      value={casinoForm.websiteUrl}
                      onChange={(e) => setCasinoForm({...casinoForm, websiteUrl: e.target.value})}
                      placeholder="https://example.com"
                      data-testid="input-website-url"
                    />
                  </div>

                  <div>
                    <Label htmlFor="affiliateUrl">Affiliate URL</Label>
                    <Input
                      id="affiliateUrl"
                      value={casinoForm.affiliateUrl}
                      onChange={(e) => setCasinoForm({...casinoForm, affiliateUrl: e.target.value})}
                      placeholder="https://affiliate-link.com"
                      data-testid="input-affiliate-url"
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={casinoForm.isFeatured}
                    onCheckedChange={(checked) => setCasinoForm({...casinoForm, isFeatured: !!checked})}
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
        </TabsContent>

        {/* Other tabs would be implemented similarly with full forms */}
        <TabsContent value="bonuses">
          <Card>
            <CardHeader>
              <CardTitle>Upravljanje Bonusima</CardTitle>
              <CardDescription>Dodavanje bonus promotions za casinos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Bonus management forma - implementacija je u toku
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>Upravljanje Igrama</CardTitle>
              <CardDescription>Dodavanje casino igara i review-a</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Game management forma - implementacija je u toku
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Upravljanje Blog Postovima</CardTitle>
              <CardDescription>Kreiranje vijesti, vodiča i članaka</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Blog management forma - implementacija je u toku
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Casino Ratings</CardTitle>
              <CardDescription>Detaljno ocjenjivanje casino-a po kategorijama</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Rating management forma - implementacija je u toku
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}