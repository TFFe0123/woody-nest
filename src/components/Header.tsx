import { Search, Heart, MessageCircle, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-walnut shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Theme toggle + Logo */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
              <span className="font-serif text-xl text-gold">W</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-primary-foreground">
                Woody Home
              </span>
              <span className="text-[10px] text-primary-foreground/70">우디홈</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
              홈
            </a>
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
              카테고리
            </a>
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
              오늘의 가구
            </a>
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
              고가구
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="어떤 가구를 찾으시나요?"
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <ThemeToggle />
            </div>
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-gold hover:bg-primary-foreground/10">
              <Search className="h-5 w-5 lg:hidden" />
            </Button>
 +++++++ REPLACE

            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-gold hover:bg-primary-foreground/10">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-gold hover:bg-primary-foreground/10">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-gold hover:bg-primary-foreground/10">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-foreground/20 animate-fade-up">
            <div className="flex flex-col gap-2">
              <a href="#" className="py-2 text-primary-foreground/80 hover:text-gold transition-colors">
                홈
              </a>
              <a href="#" className="py-2 text-primary-foreground/80 hover:text-gold transition-colors">
                카테고리
              </a>
              <a href="#" className="py-2 text-primary-foreground/80 hover:text-gold transition-colors">
                오늘의 가구
              </a>
              <a href="#" className="py-2 text-primary-foreground/80 hover:text-gold transition-colors">
                고가구
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
