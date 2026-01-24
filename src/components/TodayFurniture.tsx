import FurnitureCard from "./FurnitureCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const furnitureItems = [
  {
    id: 1,
    title: "1950년대 덴마크 티크 사이드보드",
    price: 1850000,
    location: "서울 강남구",
    timeAgo: "3시간 전",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop",
    material: "티크우드",
    dimensions: "180 × 45 × 80cm",
    condition: "최상",
    style: "미드센추리",
  },
  {
    id: 2,
    title: "프렌치 프로방스 앤틱 다이닝 테이블",
    price: 3200000,
    location: "경기 성남시",
    timeAgo: "5시간 전",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop",
    material: "오크우드",
    dimensions: "200 × 100 × 76cm",
    condition: "상",
    style: "프로방스",
  },
  {
    id: 3,
    title: "빅토리안 체스터필드 3인 소파",
    price: 2800000,
    location: "서울 용산구",
    timeAgo: "1일 전",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop",
    material: "월넛 + 가죽",
    dimensions: "220 × 90 × 85cm",
    condition: "상",
    style: "빅토리안",
  },
  {
    id: 4,
    title: "일본 쇼와시대 찬장",
    price: 890000,
    location: "부산 해운대구",
    timeAgo: "2일 전",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=450&fit=crop",
    material: "삼나무",
    dimensions: "120 × 40 × 180cm",
    condition: "중",
    style: "쇼와",
  },
  {
    id: 5,
    title: "아르데코 드레싱 테이블",
    price: 1450000,
    location: "서울 마포구",
    timeAgo: "3일 전",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop",
    material: "마호가니",
    dimensions: "100 × 50 × 150cm",
    condition: "최상",
    style: "아르데코",
  },
  {
    id: 6,
    title: "스칸디나비안 윙체어",
    price: 720000,
    location: "인천 연수구",
    timeAgo: "4일 전",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop",
    material: "비치우드",
    dimensions: "75 × 80 × 100cm",
    condition: "상",
    style: "스칸디",
  },
  {
    id: 7,
    title: "빈티지 체스테리 드레서",
    price: 1680000,
    location: "서울 종로구",
    timeAgo: "5일 전",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop",
    material: "체리우드",
    dimensions: "120 × 50 × 140cm",
    condition: "상",
    style: "빅토리안",
  },
  {
    id: 8,
    title: "미국 빈티지 록커체어",
    price: 950000,
    location: "경기 부천시",
    timeAgo: "6일 전",
    image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&h=450&fit=crop",
    material: "오크우드 + 가죽",
    dimensions: "70 × 70 × 105cm",
    condition: "상",
    style: "미드센추리",
  },
  {
    id: 9,
    title: "프랑스 앤틱 미니어처 캐비닛",
    price: 1250000,
    location: "서울 송파구",
    timeAgo: "1주일 전",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=450&fit=crop",
    material: "마호가니",
    dimensions: "80 × 35 × 90cm",
    condition: "최상",
    style: "프로방스",
  },
  {
    id: 10,
    title: "네덜란드 빈티지 서재 책상",
    price: 1980000,
    location: "서울 서초구",
    timeAgo: "1주일 전",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop",
    material: "월넛우드",
    dimensions: "140 × 70 × 75cm",
    condition: "최상",
    style: "미드센추리",
  },
  {
    id: 11,
    title: "영국 앤틱 소파 테이블",
    price: 850000,
    location: "경기 수원시",
    timeAgo: "1주일 전",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop",
    material: "마호가니",
    dimensions: "100 × 50 × 45cm",
    condition: "상",
    style: "빅토리안",
  },
  {
    id: 12,
    title: "스웨덴 빈티지 수납장",
    price: 1580000,
    location: "서울 강서구",
    timeAgo: "1주일 전",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=450&fit=crop",
    material: "비치우드",
    dimensions: "180 × 40 × 200cm",
    condition: "상",
    style: "스칸디나비안",
  },
  {
    id: 13,
    title: "프랑스 프로방스 식탁 의자 세트",
    price: 2400000,
    location: "부산 서구",
    timeAgo: "2주일 전",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop",
    material: "오크우드",
    dimensions: "의자 6개",
    condition: "상",
    style: "프로방스",
  },
  {
    id: 14,
    title: "일본 쇼와시대 수장장",
    price: 1150000,
    location: "대전 유성구",
    timeAgo: "2주일 전",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=450&fit=crop",
    material: "삼나무",
    dimensions: "150 × 45 × 190cm",
    condition: "중",
    style: "쇼와",
  },
  {
    id: 15,
    title: "아르데코 미러 드레싱 테이블",
    price: 1750000,
    location: "서울 노원구",
    timeAgo: "2주일 전",
    image: "https://images.unsplash.com/photo-1556228720-db89ddb48d03?w=600&h=450&fit=crop",
    material: "마호가니 + 거울",
    dimensions: "110 × 45 × 160cm",
    condition: "최상",
    style: "아르데코",
  },
  {
    id: 16,
    title: "덴마크 미드센추리 TV 캐비닛",
    price: 1350000,
    location: "인천 남동구",
    timeAgo: "2주일 전",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&h=450&fit=crop",
    material: "티크우드",
    dimensions: "160 × 50 × 60cm",
    condition: "상",
    style: "미드센추리",
  },
  {
    id: 17,
    title: "영국 빅토리안 의자 세트",
    price: 2200000,
    location: "서울 은평구",
    timeAgo: "2주일 전",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=450&fit=crop",
    material: "월넛우드 + 벨벳",
    dimensions: "의자 4개",
    condition: "최상",
    style: "빅토리안",
  },
  {
    id: 18,
    title: "프랑스 앤틱 커피 테이블",
    price: 980000,
    location: "광주 북구",
    timeAgo: "3주일 전",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=450&fit=crop",
    material: "오크우드",
    dimensions: "90 × 90 × 50cm",
    condition: "상",
    style: "프로방스",
  },
  {
    id: 19,
    title: "스칸디나비안 북스토리지",
    price: 1100000,
    location: "경기 안양시",
    timeAgo: "3주일 전",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=450&fit=crop",
    material: "비치우드",
    dimensions: "120 × 30 × 180cm",
    condition: "상",
    style: "스칸디나비안",
  },
  {
    id: 20,
    title: "미국 빈티지 데스크 체어",
    price: 680000,
    location: "서울 금천구",
    timeAgo: "3주일 전",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop",
    material: "체리우드",
    dimensions: "55 × 55 × 95cm",
    condition: "중",
    style: "미드센추리",
  },
];

const TodayFurniture = () => {
  const [furniture, setFurniture] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true);
        
        // 항상 더미 데이터 표시 (오늘의 가구 섹션은 등록된 가구가 아닌 추천 가구만 표시)
        setFurniture(furnitureItems.slice(0, 12));
      } catch (error) {
        console.error('가구 목록 로딩 오류:', error);
        setFurniture(furnitureItems.slice(0, 12));
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
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

  return (
    <section id="today-furniture" className="py-16 bg-background wood-texture">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gold">TODAY'S PICK</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              오늘의 엔틱 가구
            </h2>
            <p className="text-muted-foreground mt-2">
              세월의 가치가 담긴 특별한 가구들을 만나보세요
            </p>
          </div>
          <Button variant="outline" className="group self-start md:self-auto">
            전체보기
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
            <p className="text-muted-foreground mb-4">등록된 가구가 없습니다.</p>
            <p className="text-sm text-muted-foreground">첫 가구를 등록해보세요!</p>
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="gold" size="lg">
            더 많은 가구 보기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TodayFurniture;
