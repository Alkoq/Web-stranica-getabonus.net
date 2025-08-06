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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const bonusFormSchema = z.object({
  title: z.string().min(3, "Naziv mora imati najmanje 3 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  type: z.string().min(1, "Tip bonusa je obavezan"),
  amount: z.string().min(1, "Iznos bonusa je obavezan"),
  casinoId: z.string().min(1, "Kazino je obavezan"),
  wageringRequirement: z.string().optional(),
  minDeposit: z.string().optional(),
  maxWin: z.string().optional(),
  validUntil: z.string().optional(),
  terms: z.string().optional(),
  code: z.string().optional(),
  imageUrl: z.string().url("Molimo unesite valjan URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type BonusFormData = z.infer<typeof bonusFormSchema>;

interface Casino {
  id: string;
  name: string;
}

interface BonusFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bonus?: any;
  onSuccess: () => void;
}

const bonusTypes = [
  { value: "welcome", label: "Welcome Bonus" },
  { value: "no-deposit", label: "No Deposit Bonus" },
  { value: "free-spins", label: "Free Spins" },
  { value: "cashback", label: "Cashback" },
  { value: "reload", label: "Reload Bonus" },
  { value: "vip", label: "VIP Bonus" },
];

export function BonusForm({ isOpen, onOpenChange, bonus, onSuccess }: BonusFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const { toast } = useToast();
  
  const form = useForm<BonusFormData>({
    resolver: zodResolver(bonusFormSchema),
    defaultValues: {
      title: bonus?.title || "",
      description: bonus?.description || "",
      type: bonus?.type || "",
      amount: bonus?.amount || "",
      casinoId: bonus?.casinoId || "",
      wageringRequirement: bonus?.wageringRequirement || "",
      minDeposit: bonus?.minDeposit || "",
      maxWin: bonus?.maxWin || "",
      validUntil: bonus?.validUntil ? new Date(bonus.validUntil).toISOString().split('T')[0] : "",
      terms: bonus?.terms || "",
      code: bonus?.code || "",
      imageUrl: bonus?.imageUrl || "",
      isActive: bonus?.isActive ?? true,
      isFeatured: bonus?.isFeatured ?? false,
    },
  });

  useEffect(() => {
    const loadCasinos = async () => {
      try {
        const response = await fetch('/api/casinos');
        const data = await response.json();
        setCasinos(data);
      } catch (error) {
        console.error('Error loading casinos:', error);
      }
    };

    if (isOpen) {
      loadCasinos();
    }
  }, [isOpen]);

  const onSubmit = async (data: BonusFormData) => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const url = bonus 
        ? `/api/admin/bonuses/${bonus.id}` 
        : '/api/admin/bonuses';
      
      const method = bonus ? 'PUT' : 'POST';
      
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
          title: bonus ? "Bonus ažuriran" : "Bonus kreiran",
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
        description: "Došlo je do greške prilikom čuvanja bonusa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bonus ? "Uredi Bonus" : "Dodaj Novi Bonus"}
          </DialogTitle>
          <DialogDescription>
            {bonus 
              ? "Ažurirajte sve informacije o bonusu uključujući sliku i povezani kazino" 
              : "Dodajte novi bonus sa svim podacima i povezanim kazinom"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Osnovno</TabsTrigger>
                <TabsTrigger value="details">Detalji</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              {/* Osnovni podaci */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naziv Bonusa</FormLabel>
                        <FormControl>
                          <Input placeholder="100% Welcome Bonus" {...field} data-testid="input-bonus-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Iznos</FormLabel>
                        <FormControl>
                          <Input placeholder="100% do €500" {...field} data-testid="input-bonus-amount" />
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
                      <FormLabel>Opis</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detaljan opis bonusa..."
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-bonus-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tip Bonusa</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-bonus-type">
                              <SelectValue placeholder="Izaberite tip bonusa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bonusTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="casinoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Povezani Kazino</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-bonus-casino">
                              <SelectValue placeholder="Izaberite kazino" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {casinos.map((casino) => (
                              <SelectItem key={casino.id} value={casino.id}>
                                {casino.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slika Bonusa</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/bonus-image.jpg" {...field} data-testid="input-bonus-image" />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Detalji */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wageringRequirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uslov Klađenja</FormLabel>
                        <FormControl>
                          <Input placeholder="35x" {...field} data-testid="input-bonus-wagering" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimalni Depozit</FormLabel>
                        <FormControl>
                          <Input placeholder="€20" {...field} data-testid="input-bonus-min-deposit" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxWin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maksimalna Dobit</FormLabel>
                        <FormControl>
                          <Input placeholder="€1000" {...field} data-testid="input-bonus-max-win" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Važi Do</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-bonus-valid-until" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bonus Kod (opciono)</FormLabel>
                      <FormControl>
                        <Input placeholder="WELCOME100" {...field} data-testid="input-bonus-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uslovi i Pravila</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Specifični uslovi za ovaj bonus..."
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-bonus-terms"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            Da li je bonus aktivan i dostupan korisnicima
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
                            Da li se bonus prikazuje kao istaknuto na sajtu
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
                data-testid="button-save-bonus"
              >
                {isLoading ? "Čuvanje..." : bonus ? "Ažuriraj Bonus" : "Kreiraj Bonus"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}