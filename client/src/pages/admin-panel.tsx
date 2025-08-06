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
import { Shield, Users, UserPlus, LogOut, Trash2, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

export default function AdminPanel() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  const form = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      setLocation('/admin/login');
      return;
    }

    setCurrentUser(JSON.parse(user));
    verifyToken(token);
    loadAdmins();
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setLocation('/admin/login');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setLocation('/admin/login');
    }
  };

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

        {/* Admin Management */}
        {isOwner && (
          <Card className="mb-8">
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
        )}

        {/* Statistics */}
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
                <div className="text-2xl font-bold text-turquoise">2</div>
                <div className="text-sm text-gray-500">Kazina</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-turquoise">1</div>
                <div className="text-sm text-gray-500">Bonusi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-turquoise">1</div>
                <div className="text-sm text-gray-500">Igre</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-turquoise">{admins.length}</div>
                <div className="text-sm text-gray-500">Administratori</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}