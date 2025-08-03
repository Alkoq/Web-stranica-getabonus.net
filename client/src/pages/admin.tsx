import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'casinos' | 'bonuses'>('casinos');
  
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
            <CardTitle>Upravljanje Bonusima</CardTitle>
            <CardDescription>
              Dodavanje i editovanje casino bonusa će biti implementirano uskoro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Bonus management funkcionalnost će biti dodana u sljedećoj verziji.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}