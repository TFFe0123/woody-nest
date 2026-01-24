import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // 현재 사용자 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddFurniture = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "가구 등록은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/add-furniture");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-warm wood-texture py-16 md:py-24">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm text-primary/80">엔틱 가구 전문 마켓플레이스</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              시간이 만든
              <br />
              <span className="text-accent">아름다움</span>을 찾다
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              소중한 가구의 새 주인을 찾아드립니다. 
              원목의 따뜻함과 세월의 깊이가 담긴 
              엔틱 가구를 만나보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="antique" size="xl" className="group" onClick={() => {
                const furnitureSection = document.querySelector('#today-furniture');
                if (furnitureSection) {
                  furnitureSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                가구 둘러보기
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="gold" size="xl" onClick={handleAddFurniture}>
                {user ? "내 가구 등록하기" : "로그인하고 등록하기"}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-primary/10">
              <div>
                <p className="font-serif text-3xl font-bold text-primary">2,400+</p>
                <p className="text-sm text-muted-foreground">등록된 가구</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">만족도</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">거래 완료</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop"
                alt="엔틱 소파"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-card border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-lg font-semibold text-primary">빅토리안 체스터필드</p>
                    <p className="text-sm text-muted-foreground">1920년대 영국 앤틱</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl font-bold text-accent">₩2,800,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
