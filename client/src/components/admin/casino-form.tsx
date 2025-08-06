import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const casinoFormSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  description: z.string().min(10, "Opis mora imati najmanje 10 karaktera"),
  url: z.string().url("Molimo unesite valjan URL"),
  licenseInfo: z.string().min(5, "Informacije o licenci su obavezne"),
  establishedYear: z.number().min(1990).max(new Date().getFullYear()),
  logoUrl: z.string().url("Molimo unesite valjan URL za logo").optional().or(z.literal("")),
  trustScore: z.number().min(0).max(10),
  minDeposit: z.number().min(0),
  maxWithdrawal: z.number().min(0),
  withdrawalTimeframe: z.string().min(3, "Vremenski okvir povlačenja je obavezan"),
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
  const { toast } = useToast();
  
  const form = useForm<CasinoFormData>({
    resolver: zodResolver(casinoFormSchema),
    defaultValues: {
      name: casino?.name || "",
      description: casino?.description || "",
      url: casino?.url || "",
      licenseInfo: casino?.licenseInfo || "",
      establishedYear: casino?.establishedYear || new Date().getFullYear(),
      logoUrl: casino?.logoUrl || "",
      trustScore: casino?.trustScore || 5,
      minDeposit: casino?.minDeposit || 10,
      maxWithdrawal: casino?.maxWithdrawal || 5000,
      withdrawalTimeframe: casino?.withdrawalTimeframe || "24-48 sati",
      isActive: casino?.isActive ?? true,
      isFeatured: casino?.isFeatured ?? false,
    },
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {casino ? "Uredi Kazino" : "Dodaj Novi Kazino"}
          </DialogTitle>
          <DialogDescription>
            {casino 
              ? "Ažurirajte informacije o kazinu" 
              : "Dodajte novi kazino u bazu podataka"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naziv Kazina</FormLabel>
                    <FormControl>
                      <Input placeholder="Stake Casino" {...field} data-testid="input-casino-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Kazina</FormLabel>
                    <FormControl>
                      <Input placeholder="https://stake.com" {...field} data-testid="input-casino-url" />
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
                      placeholder="Detaljan opis kazina..."
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
                name="licenseInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informacije o Licenci</FormLabel>
                    <FormControl>
                      <Input placeholder="Curacao eGaming" {...field} data-testid="input-casino-license" />
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
                    <FormLabel>Godina Osnivanja</FormLabel>
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
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logoa (opciono)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} data-testid="input-casino-logo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="trustScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trust Score (0-10)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="10" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-casino-trust-score"
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
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-casino-min-deposit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxWithdrawal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maksimalno Povlačenje</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-casino-max-withdrawal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="withdrawalTimeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vremenski Okvir Povlačenja</FormLabel>
                  <FormControl>
                    <Input placeholder="24-48 sati" {...field} data-testid="input-casino-withdrawal-timeframe" />
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
                        Da li je kazino aktivan na sajtu
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-casino-active"
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
                        Da li je kazino istaknut
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-casino-featured"
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
                data-testid="button-save-casino"
              >
                {isLoading ? "Čuva..." : casino ? "Ažuriraj" : "Kreiraj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}