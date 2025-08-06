import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Shield, Users, UserPlus, LogOut, Trash2, Crown, Plus, Edit, Building2, Gift, Gamepad2, FileText, Star, Link } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CasinoForm } from "@/components/admin/casino-form";
import { BonusForm } from "@/components/admin/bonus-form";
import { GameForm } from "@/components/admin/game-form";
import { BlogForm } from "@/components/admin/blog-form";

const createAdminSchema = z.object({
  username: z.string().min(3, "Korisničko ime mora imati najmanje 3 karaktera"),
  password: z.string().min(6, "Password mora imati najmanje 6 karaktera"),
});

type CreateAdminForm = z.infer<typeof createAdminSchema>;

interface Admin {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface Casino {
  id: string;
  name: string;
  description: string;
  url: string;
  licenseInfo: string;
  establishedYear: number;
  isActive: boolean;
  isFeatured: boolean;
  logoUrl: string;
  trustScore: number;
  minDeposit: number;
  maxWithdrawal: number;
  withdrawalTimeframe: string;
}

interface Bonus {
  id: string;
  title: string;
  description: string;
  type: string;
  amount: string;
  casinoId: string;
  casino?: Casino;
  wagerRequirement: number;
  minDeposit: number;
  isActive: boolean;
  isFeatured: boolean;
}

interface Game {
  id: string;
  name: string;
  provider: string;
  category: string;
  rtp: number;
  volatility: string;
  minBet: number;
  maxBet: number;
  demoUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  imageUrl?: string;
}

export default function AdminPanel() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Form states
  const [casinoFormOpen, setCasinoFormOpen] = useState(false);
  const [bonusFormOpen, setBonusFormOpen] = useState(false);
  const [gameFormOpen, setGameFormOpen] = useState(false);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  const form = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Load user and data
  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    loadAdmins();
    loadCasinos();
    loadBonuses();
    loadGames();
    loadBlogPosts();
  }, []);



  const loadAdmins = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setAdmins(result.admins);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const loadCasinos = async () => {
    try {
      const response = await fetch('/api/casinos');
      const result = await response.json();
      setCasinos(result);
    } catch (error) {
      console.error('Error loading casinos:', error);
    }
  };

  const loadBonuses = async () => {
    try {
      const response = await fetch('/api/bonuses');
      const result = await response.json();
      setBonuses(result);
    } catch (error) {
      console.error('Error loading bonuses:', error);
    }
  };

  const loadGames = async () => {
    try {
      const response = await fetch('/api/games');
      const result = await response.json();
      setGames(result);
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const result = await response.json();
      setBlogPosts(result);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  // Form handlers
  const handleOpenCasinoForm = (casino?: Casino) => {
    setEditingItem(casino);
    setCasinoFormOpen(true);
  };

  const handleOpenBonusForm = (bonus?: Bonus) => {
    setEditingItem(bonus);
    setBonusFormOpen(true);
  };

  const handleOpenGameForm = (game?: Game) => {
    setEditingItem(game);
    setGameFormOpen(true);
  };

  const handleOpenBlogForm = (blogPost?: BlogPost) => {
    setEditingItem(blogPost);
    setBlogFormOpen(true);
  };

  const handleFormSuccess = () => {
    // Refresh data after successful form submission
    loadCasinos();
    loadBonuses();
    loadGames();
    loadBlogPosts();
    setEditingItem(null);
  };

  const onCreateAdmin = async (data: CreateAdminForm) => {
    setIsCreatingAdmin(true);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Uspešno kreiran admin",
          description: result.message,
        });
        
        form.reset();
        setIsDialogOpen(false);
        loadAdmins();
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
        description: "Došlo je do greške prilikom kreiranja administratora",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Admin obrisan",
          description: result.message,
        });
        loadAdmins();
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
        description: "Došlo je do greške prilikom brisanja administratora",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin/login');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const isOwner = currentUser.role === 'owner';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-turquoise rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-300">GetABonus.net Admin Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <div className="flex items-center space-x-2">
                {isOwner && <Crown className="h-4 w-4 text-yellow-400" />}
                <span className="font-medium">{currentUser.username}</span>
                <Badge variant={isOwner ? "default" : "secondary"}>
                  {isOwner ? "Owner" : "Admin"}
                </Badge>
              </div>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        </div>

        {/* Admin Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Pregled</span>
            </TabsTrigger>
            <TabsTrigger value="casinos" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Kazina</span>
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Bonusi</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="h-4 w-4" />
              <span>Igre</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="admins" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Admini</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Statistike Sajta</CardTitle>
                <CardDescription>
                  Pregled osnovnih statistika GetABonus.net platforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-turquoise">{casinos.length}</div>
                    <div className="text-sm text-gray-500">Kazina</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-turquoise">{bonuses.length}</div>
                    <div className="text-sm text-gray-500">Bonusi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-turquoise">{games.length}</div>
                    <div className="text-sm text-gray-500">Igre</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-turquoise">{blogPosts.length}</div>
                    <div className="text-sm text-gray-500">Blog Postovi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Casinos Tab */}
          <TabsContent value="casinos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upravljanje Kasinima</CardTitle>
                    <CardDescription>
                      Dodajte, uređujte ili uklanjajte kazina
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-turquoise hover:bg-turquoise/90"
                    onClick={() => handleOpenCasinoForm()}
                    data-testid="button-add-casino"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Kazino
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naziv</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Godina</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {casinos.map((casino) => (
                      <TableRow key={casino.id}>
                        <TableCell className="font-medium">{casino.name}</TableCell>
                        <TableCell>{casino.url}</TableCell>
                        <TableCell>{casino.establishedYear}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{casino.trustScore}/10</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={casino.isActive ? "default" : "secondary"}>
                            {casino.isActive ? "Aktivno" : "Neaktivno"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenCasinoForm(casino)}
                              data-testid={`button-edit-casino-${casino.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bonuses Tab */}
          <TabsContent value="bonuses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upravljanje Bonusima</CardTitle>
                    <CardDescription>
                      Dodajte, uređujte ili uklanjajte bonuse
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-turquoise hover:bg-turquoise/90"
                    onClick={() => handleOpenBonusForm()}
                    data-testid="button-add-bonus"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Bonus
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naziv</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Kazino</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonuses.map((bonus) => (
                      <TableRow key={bonus.id}>
                        <TableCell className="font-medium">{bonus.title}</TableCell>
                        <TableCell>{bonus.type}</TableCell>
                        <TableCell>{bonus.amount}</TableCell>
                        <TableCell>{bonus.casino?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={bonus.isActive ? "default" : "secondary"}>
                            {bonus.isActive ? "Aktivno" : "Neaktivno"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenBonusForm(bonus)}
                              data-testid={`button-edit-bonus-${bonus.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upravljanje Igrama</CardTitle>
                    <CardDescription>
                      Dodajte, uređujte ili uklanjajte igre
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-turquoise hover:bg-turquoise/90"
                    onClick={() => handleOpenGameForm()}
                    data-testid="button-add-game"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Igru
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naziv</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Kategorija</TableHead>
                      <TableHead>RTP</TableHead>
                      <TableHead>Volatilnost</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {games.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.name}</TableCell>
                        <TableCell>{game.provider}</TableCell>
                        <TableCell>{game.category}</TableCell>
                        <TableCell>{game.rtp}%</TableCell>
                        <TableCell>
                          <Badge variant={
                            game.volatility === 'high' ? 'destructive' : 
                            game.volatility === 'medium' ? 'default' : 'secondary'
                          }>
                            {game.volatility}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenGameForm(game)}
                              data-testid={`button-edit-game-${game.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upravljanje Blog Postovima</CardTitle>
                    <CardDescription>
                      Dodajte, uređujte ili uklanjajte blog postove
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-turquoise hover:bg-turquoise/90"
                    onClick={() => handleOpenBlogForm()}
                    data-testid="button-add-blog"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naslov</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{new Date(post.publishedAt).toLocaleDateString('sr-RS')}</TableCell>
                        <TableCell>
                          <Badge variant={post.isPublished ? "default" : "secondary"}>
                            {post.isPublished ? "Objavljeno" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenBlogForm(post)}
                              data-testid={`button-edit-blog-${post.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab - Only for Owner */}
          {isOwner && (
            <TabsContent value="admins">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Upravljanje Administratorima</span>
                      </CardTitle>
                      <CardDescription>
                        Dodajte, uklonite ili upravljajte administratorima sajta
                      </CardDescription>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-turquoise hover:bg-turquoise/90">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Dodaj Admina
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kreiraj Novog Administratora</DialogTitle>
                          <DialogDescription>
                            Dodajte novog administratora koji će imati pristup admin panelu
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onCreateAdmin)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Korisničko ime</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Unesite korisničko ime"
                                      {...field}
                                      data-testid="input-new-username"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="Unesite password"
                                      {...field}
                                      data-testid="input-new-password"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                              >
                                Otkaži
                              </Button>
                              <Button
                                type="submit"
                                className="bg-turquoise hover:bg-turquoise/90"
                                disabled={isCreatingAdmin}
                                data-testid="button-create-admin"
                              >
                                {isCreatingAdmin ? "Kreiranje..." : "Kreiraj Admina"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {admin.role === 'owner' ? (
                              <Crown className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <Shield className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{admin.username}</span>
                              <Badge variant={admin.role === 'owner' ? "default" : "secondary"}>
                                {admin.role === 'owner' ? "Owner" : "Admin"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Kreiran: {new Date(admin.createdAt).toLocaleDateString('sr-RS')}
                            </p>
                          </div>
                        </div>
                        
                        {admin.role !== 'owner' && admin.id !== currentUser.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteAdmin(admin.id)}
                            data-testid={`button-delete-${admin.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Forms Dialogs */}
      <Dialog open={casinoFormOpen} onOpenChange={setCasinoFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Uredi Kazino' : 'Dodaj Novi Kazino'}
            </DialogTitle>
          </DialogHeader>
          <CasinoForm 
            casino={editingItem}
            onSuccess={() => {
              setCasinoFormOpen(false);
              handleFormSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={bonusFormOpen} onOpenChange={setBonusFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Uredi Bonus' : 'Dodaj Novi Bonus'}
            </DialogTitle>
          </DialogHeader>
          <BonusForm 
            bonus={editingItem}
            onSuccess={() => {
              setBonusFormOpen(false);
              handleFormSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={gameFormOpen} onOpenChange={setGameFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Uredi Igru' : 'Dodaj Novu Igru'}
            </DialogTitle>
          </DialogHeader>
          <GameForm 
            game={editingItem}
            onSuccess={() => {
              setGameFormOpen(false);
              handleFormSuccess();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={blogFormOpen} onOpenChange={setBlogFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Uredi Blog Post' : 'Dodaj Novi Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <BlogForm 
            blogPost={editingItem}
            onSuccess={() => {
              setBlogFormOpen(false);
              handleFormSuccess();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}