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

const blogFormSchema = z.object({
  title: z.string().min(5, "Naslov mora imati najmanje 5 karaktera"),
  slug: z.string().min(3, "Slug mora imati najmanje 3 karaktera"),
  content: z.string().min(50, "Sadržaj mora imati najmanje 50 karaktera"),
  excerpt: z.string().min(20, "Izvod mora imati najmanje 20 karaktera"),
  author: z.string().min(2, "Autor je obavezan"),
  category: z.string().min(1, "Kategorija je obavezna"),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().url("Molimo unesite valjan URL").optional().or(z.literal("")),
  contentMedia: z.array(z.object({
    type: z.enum(['image', 'youtube']),
    url: z.string(),
    position: z.number(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    videoId: z.string().optional(),
  })).default([]),
  metaDescription: z.string().min(20, "Meta opis mora imati najmanje 20 karaktera"),
  relatedCasinos: z.array(z.string()).default([]), // casino IDs
  relatedGames: z.array(z.string()).default([]), // game IDs
  readingTime: z.number().min(1).optional(),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface Casino {
  id: string;
  name: string;
}

interface Game {
  id: string;
  name: string;
  provider: string;
}

interface BlogFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  blogPost?: any;
  onSuccess: () => void;
}

const blogCategories = [
  { value: "strategies", label: "Strategije" },
  { value: "reviews", label: "Recenzije" },
  { value: "news", label: "Vesti" },
  { value: "guides", label: "Vodiči" },
  { value: "tips", label: "Saveti" },
  { value: "promotions", label: "Promocije" },
];

export function BlogForm({ isOpen, onOpenChange, blogPost, onSuccess }: BlogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<'image' | 'youtube'>('image');
  const [newMediaCaption, setNewMediaCaption] = useState("");
  const { toast } = useToast();
  
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blogPost?.title || "",
      slug: blogPost?.slug || "",
      content: blogPost?.content || "",
      excerpt: blogPost?.excerpt || "",
      author: blogPost?.author || "",
      category: blogPost?.category || "",
      tags: blogPost?.tags || [],
      featuredImage: blogPost?.featuredImage || "",
      contentMedia: blogPost?.contentMedia || [],
      metaDescription: blogPost?.metaDescription || "",
      relatedCasinos: blogPost?.relatedCasinos || [],
      relatedGames: blogPost?.relatedGames || [],
      readingTime: blogPost?.readingTime || undefined,
      publishedAt: blogPost?.publishedAt ? new Date(blogPost.publishedAt).toISOString().split('T')[0] : "",
      isPublished: blogPost?.isPublished ?? false,
      isFeatured: blogPost?.isFeatured ?? false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [casinosResponse, gamesResponse] = await Promise.all([
          fetch('/api/casinos'),
          fetch('/api/games')
        ]);
        
        const casinosData = await casinosResponse.json();
        const gamesData = await gamesResponse.json();
        
        setCasinos(casinosData);
        setGames(gamesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
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
    const current = form.getValues("relatedCasinos");
    const newRelatedCasinos = current.includes(casinoId)
      ? current.filter(id => id !== casinoId)
      : [...current, casinoId];
    form.setValue("relatedCasinos", newRelatedCasinos);
  };

  const toggleGame = (gameId: string) => {
    const current = form.getValues("relatedGames");
    const newRelatedGames = current.includes(gameId)
      ? current.filter(id => id !== gameId)
      : [...current, gameId];
    form.setValue("relatedGames", newRelatedGames);
  };

  const addMediaToContent = () => {
    if (!newMediaUrl.trim()) return;
    
    const textArea = document.querySelector('[data-testid="textarea-blog-content"]') as HTMLTextAreaElement;
    const cursorPosition = textArea?.selectionStart || form.getValues("content").length;
    
    let url = newMediaUrl;
    let videoId = "";
    
    // Extract YouTube video ID if it's a YouTube URL
    if (newMediaType === 'youtube') {
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = newMediaUrl.match(youtubeRegex);
      if (match) {
        videoId = match[1];
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    const newMedia = {
      type: newMediaType,
      url: url,
      position: cursorPosition,
      caption: newMediaCaption.trim() || undefined,
      alt: newMediaType === 'image' ? newMediaCaption.trim() || undefined : undefined,
      videoId: newMediaType === 'youtube' ? videoId || undefined : undefined,
    };
    
    const currentMedia = form.getValues("contentMedia");
    form.setValue("contentMedia", [...currentMedia, newMedia]);
    
    // Insert placeholder in content
    const placeholder = newMediaType === 'image' 
      ? `[SLIKA:${currentMedia.length}]`
      : `[VIDEO:${currentMedia.length}]`;
    
    const currentContent = form.getValues("content");
    const newContent = currentContent.slice(0, cursorPosition) + 
                      `\n\n${placeholder}\n\n` + 
                      currentContent.slice(cursorPosition);
    
    form.setValue("content", newContent);
    
    // Reset form
    setNewMediaUrl("");
    setNewMediaCaption("");
    setNewMediaType('image');
  };

  const removeMediaFromContent = (index: number) => {
    const currentMedia = form.getValues("contentMedia");
    const updatedMedia = currentMedia.filter((_, i) => i !== index);
    form.setValue("contentMedia", updatedMedia);
    
    // Remove placeholder from content
    const currentContent = form.getValues("content");
    const placeholder = currentMedia[index].type === 'image' 
      ? `[SLIKA:${index}]`
      : `[VIDEO:${index}]`;
    
    const newContent = currentContent.replace(new RegExp(`\\n*${placeholder}\\n*`, 'g'), '\n\n');
    form.setValue("content", newContent);
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    form.setValue('slug', slug);
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    const token = localStorage.getItem('adminToken');

    try {
      // Data is already processed since we're using arrays now
      const processedData = { ...data };

      const url = blogPost 
        ? `/api/admin/blog/${blogPost.id}` 
        : '/api/admin/blog';
      
      const method = blogPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(processedData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: blogPost ? "Post ažuriran" : "Post kreiran",
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
        description: "Došlo je do greške prilikom čuvanja blog posta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {blogPost ? "Uredi Blog Post" : "Dodaj Novi Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {blogPost 
              ? "Ažurirajte blog post sa svim podacima uključujući sliku i povezane kazine/igre" 
              : "Dodajte novi blog post sa kompletnim sadržajem i povezivanjem sa kazinima/igrama"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content">Sadržaj</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
                <TabsTrigger value="media">Medija</TabsTrigger>
                <TabsTrigger value="relations">Povezano</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              {/* Glavni sadržaj */}
              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naslov</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Kako da pobedite u pokeru" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
                            data-testid="input-blog-title" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="kako-da-pobedite-u-pokeru" {...field} data-testid="input-blog-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Izvod</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Kratak opis blog posta..."
                          className="min-h-[80px]"
                          {...field} 
                          data-testid="textarea-blog-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sadržaj</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Pun sadržaj blog posta..."
                          className="min-h-[300px]"
                          {...field} 
                          data-testid="textarea-blog-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor</FormLabel>
                        <FormControl>
                          <Input placeholder="Marko Petrović" {...field} data-testid="input-blog-author" />
                        </FormControl>
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
                            <SelectTrigger data-testid="select-blog-category">
                              <SelectValue placeholder="Izaberite kategoriju" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {blogCategories.map((category) => (
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
              </TabsContent>

              {/* Meta podaci */}
              <TabsContent value="meta" className="space-y-4">
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Opis (SEO)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Opis za pretraživače (160 karaktera max)"
                          className="min-h-[100px]"
                          maxLength={160}
                          {...field} 
                          data-testid="textarea-blog-meta"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-sm text-gray-500">
                        {field.value ? field.value.length : 0}/160 karaktera
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="readingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vreme Čitanja (minuti)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="5"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            data-testid="input-blog-reading-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum Objave</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-blog-published-date" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <FormLabel className="text-base font-semibold">Tagovi</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj tag (poker, strategija...)"
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

              {/* Medija */}
              <TabsContent value="media" className="space-y-6">
                {/* Istaknuta slika za preview */}
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Istaknuta Slika (za preview-e)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/featured-image.jpg" {...field} data-testid="input-blog-featured-image" />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-2">
                          <img 
                            src={field.value} 
                            alt="Featured Preview" 
                            className="max-w-sm max-h-40 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        Ova slika će se prikazati na kartama blog postova i u preview-ima
                      </div>
                    </FormItem>
                  )}
                />

                {/* Dodavanje medija u sadržaj */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Dodaj Sliku/Video u Sadržaj</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tip Medija</label>
                      <Select value={newMediaType} onValueChange={(value: 'image' | 'youtube') => setNewMediaType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Slika</SelectItem>
                          <SelectItem value="youtube">YouTube Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        placeholder={newMediaType === 'image' ? "https://example.com/image.jpg" : "https://youtube.com/watch?v=..."}
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Opis/Caption (opciono)</label>
                    <Input
                      placeholder="Opis slike ili naslova videa"
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addMediaToContent}
                    disabled={!newMediaUrl.trim()}
                    className="w-full"
                  >
                    Dodaj na Poziciju Kursora
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <p><strong>Kako koristiti:</strong></p>
                    <p>1. Postavite kursor u sadržaju na mesto gde želite da ubacite medij</p>
                    <p>2. Izaberite tip (slika/video) i unesite URL</p>
                    <p>3. Kliknite "Dodaj na Poziciju Kursora"</p>
                    <p>4. Placeholder će biti ubačen u tekst (npr. [SLIKA:0] ili [VIDEO:0])</p>
                  </div>
                </div>

                {/* Lista dodeljenih medija */}
                {form.watch("contentMedia") && form.watch("contentMedia").length > 0 && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-semibold">Mediji u Sadržaju</h3>
                    <div className="space-y-2">
                      {(form.watch("contentMedia") || []).map((media, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant={media.type === 'image' ? 'default' : 'secondary'}>
                              {media.type === 'image' ? 'SLIKA' : 'VIDEO'}:{index}
                            </Badge>
                            <div className="text-sm">
                              <div className="font-medium">{media.url}</div>
                              {media.caption && <div className="text-muted-foreground">{media.caption}</div>}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMediaFromContent(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Povezani sadržaj */}
              <TabsContent value="relations" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Povezani Kazini */}
                  <div className="space-y-3">
                    <FormLabel className="text-base font-semibold">Povezani Kazini</FormLabel>
                    <div className="max-h-[250px] overflow-y-auto border rounded-lg p-3 space-y-2">
                      {casinos.map((casino) => (
                        <div key={casino.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`casino-${casino.id}`}
                            checked={form.watch("relatedCasinos").includes(casino.id)}
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
                  </div>

                  {/* Povezane Igre */}
                  <div className="space-y-3">
                    <FormLabel className="text-base font-semibold">Povezane Igre</FormLabel>
                    <div className="max-h-[250px] overflow-y-auto border rounded-lg p-3 space-y-2">
                      {games.map((game) => (
                        <div key={game.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`game-${game.id}`}
                            checked={form.watch("relatedGames").includes(game.id)}
                            onCheckedChange={() => toggleGame(game.id)}
                          />
                          <label
                            htmlFor={`game-${game.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {game.name} ({game.provider})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Status */}
              <TabsContent value="status" className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Objavljeno</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Da li je blog post javno dostupan korisnicima
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
                            Da li se blog post prikazuje kao istaknuto na početnoj strani
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
                data-testid="button-save-blog"
              >
                {isLoading ? "Čuvanje..." : blogPost ? "Ažuriraj Post" : "Kreiraj Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}