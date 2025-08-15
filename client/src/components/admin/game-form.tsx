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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const gameFormSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  description: z.string().optional(),
  provider: z.string().min(2, "Provider is required"),
  type: z.string().min(1, "Game type is required"),
  rtp: z.number().min(0).max(100),
  volatility: z.string().min(1, "Volatility is required"),
  minBet: z.number().min(0),
  maxBet: z.number().min(0),
  paylines: z.number().min(0).optional(),
  maxMultiplier: z.number().min(0).optional(),
  tags: z.array(z.string()).default([]),
  demoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  availableAt: z.array(z.string()).default([]), // casino IDs
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type GameFormData = z.infer<typeof gameFormSchema>;

interface Casino {
  id: string;
  name: string;
}

interface GameFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  onSuccess: () => void;
}

const gameCategories = [
  { value: "slot", label: "Slots" },
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
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  
  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: game?.name || "",
      description: game?.description || "",
      provider: game?.provider || "",
      type: game?.type || "",
      rtp: game?.rtp || 96,
      volatility: game?.volatility || "",
      minBet: game?.minBet || 0.1,
      maxBet: game?.maxBet || 100,
      paylines: game?.paylines || undefined,
      maxMultiplier: game?.maxMultiplier || undefined,
      tags: game?.tags || [],
      demoUrl: game?.demoUrl || "",
      imageUrl: game?.imageUrl || "",
      availableAt: game?.availableAt || [],
      isActive: game?.isActive ?? true,
      isFeatured: game?.isFeatured ?? false,
    },
  });

  // Reset form when game data changes
  useEffect(() => {
    if (game) {
      form.reset({
        name: game.name || "",
        description: game.description || "",
        provider: game.provider || "",
        type: game.type || "",
        rtp: game.rtp || 96,
        volatility: game.volatility || "",
        minBet: game.minBet || 0.1,
        maxBet: game.maxBet || 100,
        paylines: game.paylines || undefined,
        maxMultiplier: game.maxMultiplier || undefined,
        demoUrl: game.demoUrl || "",
        imageUrl: game.imageUrl || "",
        tags: game.tags || [],
        availableAt: game.availableAt || [],
        isActive: game.isActive ?? true,
        isFeatured: game.isFeatured ?? false,
      });
    } else if (isOpen) {
      form.reset({
        name: "",
        description: "",
        provider: "",
        type: "",
        rtp: 96,
        volatility: "",
        minBet: 0.1,
        maxBet: 100,
        paylines: undefined,
        maxMultiplier: undefined,
        demoUrl: "",
        imageUrl: "",
        tags: [],
        availableAt: [],
        isActive: true,
        isFeatured: false,
      });
    }
  }, [game, isOpen, form]);

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

  const addTag = () => {
    if (newTag.trim()) {
      const current = form.getValues("tags");
      form.setValue("tags", [...current, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const current = form.getValues("tags");
    form.setValue("tags", current.filter((_, i) => i !== index));
  };

  const toggleCasino = (casinoId: string) => {
    const current = form.getValues("availableAt");
    const newAvailableAt = current.includes(casinoId)
      ? current.filter(id => id !== casinoId)
      : [...current, casinoId];
    form.setValue("availableAt", newAvailableAt);
  };

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
          title: game ? "Game updated" : "Game created",
          description: result.message,
        });
        
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the game",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {game ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <DialogDescription>
            {game 
              ? "Update all game information including image and related casinos" 
              : "Add a new game with all data and casino connections"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="casinos">Casinos</TabsTrigger>
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
                        <FormLabel>Game Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Book of Dead" {...field} data-testid="input-game-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-game-provider">
                              <SelectValue placeholder="Select provider" />
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed game description..."
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-game-description"
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
                        <FormLabel>Game Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-game-type">
                              <SelectValue placeholder="Select game type" />
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

                  <FormField
                    control={form.control}
                    name="volatility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volatility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-game-volatility">
                              <SelectValue placeholder="Select volatility" />
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
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slika Igre</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/game-image.jpg" {...field} data-testid="input-game-image" />
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
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://demo.provider.com/game" {...field} data-testid="input-game-demo-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minBet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimalna Opklada (€)</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="maxBet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maksimalna Opklada (€)</FormLabel>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paylines"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broj Linija (opciono)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="25"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            data-testid="input-game-paylines"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxMultiplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maksimalni Multiplikator (opciono)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="5000"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            data-testid="input-game-max-multiplier"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tagovi */}
                <div className="space-y-3">
                  <FormLabel className="text-base font-semibold">Tagovi</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj tag (bonus, free spins...)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("tags").map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Povezani Kazini */}
              <TabsContent value="casinos" className="space-y-4">
                <div className="space-y-3">
                  <FormLabel className="text-base font-semibold">Dostupna u Kazinima</FormLabel>
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                    {casinos.map((casino) => (
                      <div key={casino.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`casino-${casino.id}`}
                          checked={form.watch("availableAt").includes(casino.id)}
                          onCheckedChange={() => toggleCasino(casino.id)}
                        />
                        <label
                          htmlFor={`casino-${casino.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {casino.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Izaberite kazine u kojima je ova igra dostupna
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
                          <FormLabel className="text-base">Aktivna</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Da li je igra aktivna i dostupna korisnicima
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
                            Da li se igra prikazuje kao istaknuto na sajtu
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
                data-testid="button-save-game"
              >
                {isLoading ? "Čuvanje..." : game ? "Ažuriraj Igru" : "Kreiraj Igru"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}