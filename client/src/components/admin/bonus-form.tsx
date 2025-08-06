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
import { useToast } from "@/hooks/use-toast";

const bonusFormSchema = z.object({
  title: z.string().min(3, "Naziv mora imati najmanje 3 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  type: z.string().min(1, "Tip bonusa je obavezan"),
  amount: z.string().min(1, "Iznos bonusa je obavezan"),
  casinoId: z.string().min(1, "Kazino je obavezan"),
  wagerRequirement: z.number().min(0),
  minDeposit: z.number().min(0),
  maxWinnings: z.number().min(0).optional(),
  promoCode: z.string().optional(),
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
      wagerRequirement: bonus?.wagerRequirement || 0,
      minDeposit: bonus?.minDeposit || 0,
      maxWinnings: bonus?.maxWinnings || undefined,
      promoCode: bonus?.promoCode || "",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bonus ? "Uredi Bonus" : "Dodaj Novi Bonus"}
          </DialogTitle>
          <DialogDescription>
            {bonus 
              ? "Ažurirajte informacije o bonusu" 
              : "Dodajte novi bonus u bazu podataka"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="casinoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kazino</FormLabel>
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

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="wagerRequirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wager Requirement</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="35"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="input-bonus-wager"
                      />
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
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="20"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        data-testid="input-bonus-min-deposit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxWinnings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksimalna Dobit</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="1000"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        data-testid="input-bonus-max-winnings"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="promoCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Kod (opciono)</FormLabel>
                  <FormControl>
                    <Input placeholder="WELCOME100" {...field} data-testid="input-bonus-promo-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Aktivno</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Da li je bonus aktivan
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-bonus-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Istaknuto</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Da li je bonus istaknut
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-bonus-featured"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                {isLoading ? "Čuva..." : bonus ? "Ažuriraj" : "Kreiraj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}