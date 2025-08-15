import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Star, Globe } from "lucide-react";
import { WORLD_COUNTRIES, COMMONLY_RESTRICTED_COUNTRIES, getCountryName } from "@/lib/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const casinoFormSchema = z.object({
  // Basic casino fields
  name: z.string().min(2, "Name must have at least 2 characters"),
  description: z.string().min(10, "Description must have at least 10 characters"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  affiliateUrl: z.string().url("Please enter a valid affiliate URL").optional().or(z.literal("")),
  logoUrl: z.string().url("Please enter a valid logo URL").optional().or(z.literal("")),
  
  // Basic information
  establishedYear: z.number().min(1990).max(new Date().getFullYear()),
  license: z.string().min(3, "License information is required"),
  safetyIndex: z.number().min(0).max(10),
  
  // Arrays for features
  paymentMethods: z.array(z.string()).default([]),
  supportedCurrencies: z.array(z.string()).default([]),
  gameProviders: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  restrictedCountries: z.array(z.string()).default([]),
  
  // Expert Review ratings (6 categories) - Made optional so basic info can be saved first
  bonusesRating: z.number().min(0).max(10).optional().default(5),
  bonusesExplanation: z.string().optional().default(""),
  designRating: z.number().min(0).max(10).optional().default(5),
  designExplanation: z.string().optional().default(""),
  payoutsRating: z.number().min(0).max(10).optional().default(5),
  payoutsExplanation: z.string().optional().default(""),
  customerSupportRating: z.number().min(0).max(10).optional().default(5),
  customerSupportExplanation: z.string().optional().default(""),
  gameSelectionRating: z.number().min(0).max(10).optional().default(5),
  gameSelectionExplanation: z.string().optional().default(""),
  mobileExperienceRating: z.number().min(0).max(10).optional().default(5),
  mobileExperienceExplanation: z.string().optional().default(""),
  
  // Expert review summary
  overallRating: z.number().min(0).max(10).optional().default(5),
  expertSummary: z.string().optional().default(""),
  
  // Status fields
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type CasinoFormData = z.infer<typeof casinoFormSchema>;

interface CasinoFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  casino?: any;
  onSuccess: () => void;
}

export function CasinoForm({ isOpen, onOpenChange, casino, onSuccess }: CasinoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const { toast } = useToast();
  
  const form = useForm<CasinoFormData>({
    resolver: zodResolver(casinoFormSchema),
    defaultValues: {
      // Osnovna polja
      name: casino?.name || "",
      description: casino?.description || "",
      websiteUrl: casino?.websiteUrl || "",
      affiliateUrl: casino?.affiliateUrl || "",
      logoUrl: casino?.logoUrl || "",
      
      // Osnovne informacije
      establishedYear: casino?.establishedYear || new Date().getFullYear(),
      license: casino?.license || "",
      safetyIndex: casino?.safetyIndex || 5,
      
      // Arrays
      paymentMethods: casino?.paymentMethods || [],
      supportedCurrencies: casino?.supportedCurrencies || [],
      gameProviders: casino?.gameProviders || [],
      features: casino?.features || [],
      restrictedCountries: casino?.restrictedCountries || [],
      
      // Expert Review ocene (uzmi iz expertReview objekta ako postoji)
      bonusesRating: casino?.expertReview?.bonusesRating || 5,
      bonusesExplanation: casino?.expertReview?.bonusesExplanation || "",
      designRating: casino?.expertReview?.designRating || 5,
      designExplanation: casino?.expertReview?.designExplanation || "",
      payoutsRating: casino?.expertReview?.payoutsRating || 5,
      payoutsExplanation: casino?.expertReview?.payoutsExplanation || "",
      customerSupportRating: casino?.expertReview?.customerSupportRating || 5,
      customerSupportExplanation: casino?.expertReview?.customerSupportExplanation || "",
      gameSelectionRating: casino?.expertReview?.gameSelectionRating || 5,
      gameSelectionExplanation: casino?.expertReview?.gameSelectionExplanation || "",
      mobileExperienceRating: casino?.expertReview?.mobileExperienceRating || 5,
      mobileExperienceExplanation: casino?.expertReview?.mobileExperienceExplanation || "",
      
      // Expert review summary
      overallRating: casino?.expertReview?.overallRating || 5,
      expertSummary: casino?.expertReview?.summary || "",
      
      // Status
      isActive: casino?.isActive ?? true,
      isFeatured: casino?.isFeatured ?? false,
    },
  });

  // Reset form when casino data changes
  useEffect(() => {
    if (casino) {
      form.reset({
        name: casino.name || "",
        description: casino.description || "",
        websiteUrl: casino.websiteUrl || "",
        affiliateUrl: casino.affiliateUrl || "",
        logoUrl: casino.logoUrl || "",
        establishedYear: casino.establishedYear || new Date().getFullYear(),
        license: casino.license || "",
        safetyIndex: casino.safetyIndex || 5,
        paymentMethods: casino.paymentMethods || [],
        supportedCurrencies: casino.supportedCurrencies || [],
        gameProviders: casino.gameProviders || [],
        features: casino.features || [],
        restrictedCountries: casino.restrictedCountries || [],
        bonusesRating: casino.expertReview?.bonusesRating || 5,
        bonusesExplanation: casino.expertReview?.bonusesExplanation || "",
        designRating: casino.expertReview?.designRating || 5,
        designExplanation: casino.expertReview?.designExplanation || "",
        payoutsRating: casino.expertReview?.payoutsRating || 5,
        payoutsExplanation: casino.expertReview?.payoutsExplanation || "",
        customerSupportRating: casino.expertReview?.customerSupportRating || 5,
        customerSupportExplanation: casino.expertReview?.customerSupportExplanation || "",
        gameSelectionRating: casino.expertReview?.gameSelectionRating || 5,
        gameSelectionExplanation: casino.expertReview?.gameSelectionExplanation || "",
        mobileExperienceRating: casino.expertReview?.mobileExperienceRating || 5,
        mobileExperienceExplanation: casino.expertReview?.mobileExperienceExplanation || "",
        overallRating: casino.expertReview?.overallRating || 5,
        expertSummary: casino.expertReview?.summary || "",
        isActive: casino.isActive ?? true,
        isFeatured: casino.isFeatured ?? false,
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        description: "",
        websiteUrl: "",
        affiliateUrl: "",
        logoUrl: "",
        establishedYear: new Date().getFullYear(),
        license: "",
        safetyIndex: 5,
        paymentMethods: [],
        supportedCurrencies: [],
        gameProviders: [],
        features: [],
        restrictedCountries: [],
        bonusesRating: 5,
        bonusesExplanation: "",
        designRating: 5,
        designExplanation: "",
        payoutsRating: 5,
        payoutsExplanation: "",
        customerSupportRating: 5,
        customerSupportExplanation: "",
        gameSelectionRating: 5,
        gameSelectionExplanation: "",
        mobileExperienceRating: 5,
        mobileExperienceExplanation: "",
        overallRating: 5,
        expertSummary: "",
        isActive: true,
        isFeatured: false,
      });
    }
  }, [casino, isOpen, form]);

  const onSubmit = async (data: CasinoFormData) => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const url = casino 
        ? `/api/admin/casinos/${casino.id}` 
        : '/api/admin/casinos';
      
      const method = casino ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: casino ? "Kazino ažuriran" : "Kazino kreiran",
          description: result.message,
        });
        
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: "Greška",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom čuvanja kazina",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcije za dodavanje stavki u arrays
  const addPaymentMethod = () => {
    if (newPaymentMethod.trim()) {
      const current = form.getValues("paymentMethods");
      form.setValue("paymentMethods", [...current, newPaymentMethod.trim()]);
      setNewPaymentMethod("");
    }
  };

  const addCurrency = () => {
    if (newCurrency.trim()) {
      const current = form.getValues("supportedCurrencies");
      form.setValue("supportedCurrencies", [...current, newCurrency.trim()]);
      setNewCurrency("");
    }
  };

  const addProvider = () => {
    if (newProvider.trim()) {
      const current = form.getValues("gameProviders");
      form.setValue("gameProviders", [...current, newProvider.trim()]);
      setNewProvider("");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const current = form.getValues("features");
      form.setValue("features", [...current, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const addRestrictedCountry = () => {
    if (selectedCountry) {
      const current = form.getValues("restrictedCountries") || [];
      if (!current.includes(selectedCountry)) {
        form.setValue("restrictedCountries", [...current, selectedCountry]);
      }
      setSelectedCountry("");
    }
  };

  const addCommonRestrictedCountries = () => {
    const current = form.getValues("restrictedCountries") || [];
    const newRestricted = COMMONLY_RESTRICTED_COUNTRIES.filter(code => !current.includes(code));
    form.setValue("restrictedCountries", [...current, ...newRestricted]);
  };

  const clearAllRestrictedCountries = () => {
    form.setValue("restrictedCountries", []);
  };

  const removeItem = (field: string, index: number) => {
    const current = form.getValues(field as any);
    form.setValue(field as any, current.filter((_: any, i: number) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {casino ? "Edit Casino" : "Add New Casino"}
          </DialogTitle>
          <DialogDescription>
            {casino 
              ? "Update all casino fields including expert review ratings" 
              : "Add a new casino with all data including expert review"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="expert">Expert Review</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              {/* Osnovni podaci */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Casino Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Stake Casino" {...field} data-testid="input-casino-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="establishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-casino-year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed casino description..."
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-casino-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://stake.com" {...field} data-testid="input-casino-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="affiliateUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Affiliate URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://affiliate.stake.com" {...field} data-testid="input-casino-affiliate" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input placeholder="https://example.com/logo.png" {...field} data-testid="input-casino-logo" />
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="license"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Licenca</FormLabel>
                        <FormControl>
                          <Input placeholder="Curacao eGaming" {...field} data-testid="input-casino-license" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="safetyIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Safety Index: {field.value}/10</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={10}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Funkcionalnosti */}
              <TabsContent value="features" className="space-y-6">
                {/* Payment Methods */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Načini Plaćanja</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj način plaćanja"
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPaymentMethod())}
                    />
                    <Button type="button" onClick={addPaymentMethod} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("paymentMethods").map((method, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {method}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem("paymentMethods", index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Currencies */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Podržane Valute</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj valutu (USD, EUR, BTC...)"
                      value={newCurrency}
                      onChange={(e) => setNewCurrency(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCurrency())}
                    />
                    <Button type="button" onClick={addCurrency} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("supportedCurrencies").map((currency, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {currency}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem("supportedCurrencies", index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Game Providers */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Game Provideri</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj providera (NetEnt, Microgaming...)"
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProvider())}
                    />
                    <Button type="button" onClick={addProvider} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("gameProviders").map((provider, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {provider}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem("gameProviders", index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Funkcionalnosti</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj funkcionalnost (Live Chat, Mobile App...)"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("features").map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem("features", index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Restricted Countries */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Restricted Countries
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select countries where this casino is NOT available. By default, casino is available in all countries except the ones listed here.
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      type="button" 
                      onClick={addCommonRestrictedCountries}
                      variant="outline"
                      size="sm"
                    >
                      Add Common Restricted
                    </Button>
                    <Button 
                      type="button" 
                      onClick={clearAllRestrictedCountries}
                      variant="outline"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country to restrict" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {WORLD_COUNTRIES.filter(country => 
                          !(form.watch("restrictedCountries") || []).includes(country.code)
                        ).map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={addRestrictedCountry}
                      variant="outline"
                      disabled={!selectedCountry}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                    {(form.watch("restrictedCountries") || []).map((countryCode, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        {getCountryName(countryCode)}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItem("restrictedCountries", index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {(form.watch("restrictedCountries") || []).length === 0 
                      ? "Available in all countries worldwide" 
                      : `Available in ${WORLD_COUNTRIES.length - (form.watch("restrictedCountries") || []).length} countries`
                    }
                  </div>
                </div>
              </TabsContent>

              {/* Expert Review */}
              <TabsContent value="expert" className="space-y-6">
                <div className="space-y-6">
                  {/* Bonuses Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Bonusi: {form.watch("bonusesRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="bonusesRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bonusesExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za bonuse..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Design Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Dizajn: {form.watch("designRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="designRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za dizajn..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Payouts Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Isplate: {form.watch("payoutsRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="payoutsRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payoutsExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za isplate..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Customer Support Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Korisnička Podrška: {form.watch("customerSupportRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="customerSupportRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerSupportExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za korisničku podršku..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Game Selection Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Izbor Igara: {form.watch("gameSelectionRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="gameSelectionRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gameSelectionExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za izbor igara..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Mobile Experience Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Mobilno Iskustvo: {form.watch("mobileExperienceRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="mobileExperienceRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobileExperienceExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Objašnjenje ocene za mobilno iskustvo..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Overall Rating & Summary */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Ukupna Ocena: {form.watch("overallRating")}/10
                    </Label>
                    <FormField
                      control={form.control}
                      name="overallRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expertSummary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expert Review Rezime</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ukupan rezime expert review-a..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Status */}
              <TabsContent value="status" className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aktivan</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Da li je kazino aktivan i dostupan korisnicima
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Istaknuto</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Da li se kazino prikazuje kao istaknuto na sajtu
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Otkaži
              </Button>
              <Button
                type="submit"
                className="bg-turquoise hover:bg-turquoise/90"
                disabled={isLoading}
                data-testid="button-save-casino"
              >
                {isLoading ? "Čuvanje..." : casino ? "Ažuriraj Kazino" : "Kreiraj Kazino"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}