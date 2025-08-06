import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const gameFormSchema = z.object({
  name: z.string().min(2, "Naziv mora imati najmanje 2 karaktera"),
  provider: z.string().min(2, "Provider je obavezan"),
  category: z.string().min(1, "Kategorija je obavezna"),
  rtp: z.number().min(0).max(100),
  volatility: z.string().min(1, "Volatilnost je obavezna"),
  minBet: z.number().min(0),
  maxBet: z.number().min(0),
  demoUrl: z.string().url("Molimo unesite valjan URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Molimo unesite valjan URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type GameFormData = z.infer<typeof gameFormSchema>;

interface GameFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  onSuccess: () => void;
}

const gameCategories = [
  { value: "slots", label: "Slots" },
  { value: "table", label: "Table Games" },
  { value: "live", label: "Live Casino" },
  { value: "jackpot", label: "Jackpot" },
  { value: "crash", label: "Crash Games" },
  { value: "lottery", label: "Lottery" },
];

const volatilityLevels = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const gameProviders = [
  "Pragmatic Play", "NetEnt", "Microgaming", "Play'n GO", "Evolution Gaming",
  "Yggdrasil", "Red Tiger", "Big Time Gaming", "Nolimit City", "Push Gaming",
  "Hacksaw Gaming", "Relax Gaming", "Thunderkick", "ELK Studios", "iSoftBet"
];

export function GameForm({ isOpen, onOpenChange, game, onSuccess }: GameFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: game?.name || "",
      provider: game?.provider || "",
      category: game?.category || "",
      rtp: game?.rtp || 96,
      volatility: game?.volatility || "",
      minBet: game?.minBet || 0.1,
      maxBet: game?.maxBet || 100,
      demoUrl: game?.demoUrl || "",
      imageUrl: game?.imageUrl || "",
      isActive: game?.isActive ?? true,
      isFeatured: game?.isFeatured ?? false,
    },
  });

  const onSubmit = async (data: GameFormData) => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      const url = game 
        ? `/api/admin/games/${game.id}` 
        : '/api/admin/games';
      
      const method = game ? 'PUT' : 'POST';
      
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
          title: game ? "Igra ažurirana" : "Igra kreirana",
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
        description: "Došlo je do greške prilikom čuvanja igre",
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
            {game ? "Uredi Igru" : "Dodaj Novu Igru"}
          </DialogTitle>
          <DialogDescription>
            {game 
              ? "Ažurirajte informacije o igri" 
              : "Dodajte novu igru u bazu podataka"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naziv Igre</FormLabel>
                  <FormControl>
                    <Input placeholder="Book of Dead" {...field} data-testid="input-game-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-game-provider">
                          <SelectValue placeholder="Izaberite providera" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gameProviders.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorija</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-game-category">
                          <SelectValue placeholder="Izaberite kategoriju" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gameCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTP (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        step="0.01"
                        placeholder="96.50"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-game-rtp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="volatility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volatilnost</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-game-volatility">
                          <SelectValue placeholder="Izaberite volatilnost" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {volatilityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
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
                name="minBet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimalna Opklada</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.10"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        data-testid="input-game-min-bet"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxBet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maksimalna Opklada</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      step="0.01"
                      placeholder="100.00"
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      data-testid="input-game-max-bet"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="demoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo URL (opciono)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://demo.provider.com/game" {...field} data-testid="input-game-demo-url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slike (opciono)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/game-image.jpg" {...field} data-testid="input-game-image-url" />
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
                        Da li je igra aktivna
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-game-active"
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
                        Da li je igra istaknuta
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-game-featured"
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
                data-testid="button-save-game"
              >
                {isLoading ? "Čuva..." : game ? "Ažuriraj" : "Kreiraj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}