import FurnitureCard from "./FurnitureCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const MyFurniture = () => {
  const [furniture, setFurniture] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyFurniture = async () => {
      try {
        // 사용자 확인
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setFurniture([]);
          setLoading(false);
          return;
        }

        setUser(user);
        setLoading(true);

        // 내가 등록한 가구 목록 가져오기
        const { data, error } = await supabase
          .from('furniture')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('내 가구 목록 조회 오류:', error);
          setFurniture([]);
        } else {
          if (data && data.length > 0) {
            // DB 데이터를 FurnitureCard에서 사용할 형식으로 변환
            const formattedData = data.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              location: item.location,
              timeAgo: getTimeAgo(item.created_at),
              image: item.image,
              material: item.material,
              dimensions: item.dimensions,
              condition: item.condition,
              style: item.style,
            }));
            setFurniture(formattedData);
          } else {
            setFurniture([]);
          }
        }
      } catch (error) {
        console.error('내 가구 목록 로딩 오류:', error);
        setFurniture([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyFurniture();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return `${diffDays}일 전`;
    }
  };

  // 로그인하지 않은 경우 섹션을 표시하지 않음
  if (!user && !loading) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gold">MY FURNITURE</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              내가 등록한 가구
            </h2>
            <p className="text-muted-foreground mt-2">
              내가 등록한 가구들을 관리해보세요
            </p>
          </div>
          <Button 
            variant="gold" 
            className="group self-start md:self-auto"
            onClick={() => navigate("/add-furniture")}
          >
            가구 등록하기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Furniture Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        ) : furniture.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">등록한 가구가 없습니다.</p>
            <p className="text-sm text-muted-foreground mb-6">첫 가구를 등록해보세요!</p>
            <Button variant="gold" onClick={() => navigate("/add-furniture")}>
              가구 등록하기
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {furniture.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FurnitureCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyFurniture;

