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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const blogFormSchema = z.object({
  title: z.string().min(5, "Naslov mora imati najmanje 5 karaktera"),
  slug: z.string().min(3, "Slug mora imati najmanje 3 karaktera"),
  content: z.string().min(50, "Sadržaj mora imati najmanje 50 karaktera"),
  excerpt: z.string().min(20, "Izvod mora imati najmanje 20 karaktera"),
  author: z.string().min(2, "Autor je obavezan"),
  category: z.string().min(1, "Kategorija je obavezna"),
  tags: z.string().optional(),
  imageUrl: z.string().url("Molimo unesite valjan URL").optional().or(z.literal("")),
  metaDescription: z.string().min(20, "Meta opis mora imati najmanje 20 karaktera"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

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
      tags: blogPost?.tags?.join(", ") || "",
      imageUrl: blogPost?.imageUrl || "",
      metaDescription: blogPost?.metaDescription || "",
      isPublished: blogPost?.isPublished ?? false,
      isFeatured: blogPost?.isFeatured ?? false,
    },
  });

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
      // Convert tags string to array
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {blogPost ? "Uredi Blog Post" : "Dodaj Novi Blog Post"}
          </DialogTitle>
          <DialogDescription>
            {blogPost 
              ? "Ažurirajte informacije o blog postu" 
              : "Dodajte novi blog post u bazu podataka"
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      className="min-h-[200px]"
                      {...field} 
                      data-testid="textarea-blog-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
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

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagovi (odvojeni zarezom)</FormLabel>
                    <FormControl>
                      <Input placeholder="poker, strategija, saveti" {...field} data-testid="input-blog-tags" />
                    </FormControl>
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
                  <FormLabel>URL Slike (opciono)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/blog-image.jpg" {...field} data-testid="input-blog-image" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Opis (SEO)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opis za pretraživače (160 karaktera max)"
                      className="min-h-[60px]"
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

            <div className="flex space-x-6">
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Objavljeno</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Da li je post javno dostupan
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-blog-published"
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
                        Da li je post istaknut
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-blog-featured"
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
                data-testid="button-save-blog"
              >
                {isLoading ? "Čuva..." : blogPost ? "Ažuriraj" : "Kreiraj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}