import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, Search } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Casinos", href: "/casinos", icon: "🎰" },
    { name: "Bonuses", href: "/bonuses", icon: "🎁" },
    { name: "Games", href: "/games", icon: "🎮" },
    { name: "Reviews", href: "/reviews", icon: "⭐" },
    { name: "Compare", href: "/compare", icon: "⚖️" },
    { name: "Blog", href: "/blog", icon: "📝" },
    { name: "Admin", href: "/admin-panel", icon: "🔧" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-turquoise">GetABonus.net</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.filter(item => item.href !== "/admin-panel" && item.href !== "/").map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={isActive(item.href) ? "bg-turquoise hover:bg-turquoise/90" : ""}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search casinos, bonuses..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[280px] sm:w-[320px] p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(173, 58, 39, 0.1))',
                  border: '1px solid hsl(173, 58%, 39%, 0.3)',
                  boxShadow: '0 0 30px hsl(173, 58%, 39%, 0.2)',
                }}
              >
                <div className="flex flex-col h-full max-h-screen overflow-hidden">
                  {/* Header */}
                  <div className="border-b border-turquoise/30 pb-3 mb-4 flex-shrink-0">
                    <h2 
                      className="text-lg font-bold mb-1"
                      style={{
                        color: 'hsl(173, 58%, 39%)',
                        textShadow: '0 0 10px hsl(173, 58%, 39%, 0.5)'
                      }}
                    >
                      🎰 Navigation
                    </h2>
                    <p className="text-xs text-gray-300">Explore casino reviews and bonuses</p>
                  </div>
                  
                  {/* Search */}
                  <div className="relative mb-4 flex-shrink-0">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-turquoise h-3 w-3" />
                    <Input
                      placeholder="Search..."
                      className="pl-8 py-2 h-9 text-sm bg-black/20 border-turquoise/30 text-white placeholder:text-gray-400 focus:ring-turquoise focus:border-turquoise"
                      style={{
                        boxShadow: '0 0 10px hsl(173, 58%, 39%, 0.2)'
                      }}
                    />
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-1 flex-1 overflow-y-auto">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-left h-10 text-sm transition-all duration-300 ${
                            isActive(item.href) 
                              ? "text-white" 
                              : "text-gray-300 hover:text-white"
                          }`}
                          style={isActive(item.href) ? {
                            background: 'linear-gradient(90deg, hsl(173, 58%, 39%, 0.8), hsl(24, 95%, 53%, 0.3))',
                            border: '1px solid hsl(173, 58%, 39%, 0.5)',
                            boxShadow: '0 0 15px hsl(173, 58%, 39%, 0.3)',
                            textShadow: '0 0 10px hsl(173, 58%, 39%, 0.8)'
                          } : {
                            border: '1px solid transparent',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive(item.href)) {
                              e.currentTarget.style.background = 'linear-gradient(90deg, hsl(173, 58%, 39%, 0.2), hsl(24, 95%, 53%, 0.1))';
                              e.currentTarget.style.border = '1px solid hsl(173, 58%, 39%, 0.3)';
                              e.currentTarget.style.boxShadow = '0 0 10px hsl(173, 58%, 39%, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive(item.href)) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.border = '1px solid transparent';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          <span className="mr-2 text-base">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                  
                  {/* Footer */}
                  <div className="border-t border-turquoise/30 pt-3 mt-4 flex-shrink-0">
                    <p className="text-xs text-gray-500 text-center">
                      © 2024 GetABonus.net
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
