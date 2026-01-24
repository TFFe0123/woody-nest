import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle2, MapPin, Ruler, Calendar } from "lucide-react";

// 가구 데이터 (TodayFurniture와 동일한 데이터)
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
];

const FurniturePayment = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [furniture, setFurniture] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndLoadFurniture = async () => {
      // 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "결제하려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setUser(user);
      
      // Supabase에서 가구 정보 가져오기
      try {
        const { data, error } = await supabase
          .from('furniture')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          // DB에서 찾을 수 없으면 더미 데이터에서 찾기
          const furnitureId = parseInt(id || "0");
          const foundFurniture = furnitureItems.find(item => item.id === furnitureId);
          
          if (!foundFurniture) {
            throw new Error('상품을 찾을 수 없습니다');
          }
          
          setFurniture(foundFurniture);
        } else {
          // DB 데이터를 화면 형식으로 변환
          const formattedFurniture = {
            id: data.id,
            title: data.title,
            price: data.price,
            location: data.location,
            timeAgo: getTimeAgo(data.created_at),
            image: data.image,
            material: data.material,
            dimensions: data.dimensions,
            condition: data.condition,
            style: data.style,
          };
          setFurniture(formattedFurniture);
        }
      } catch (error: any) {
        toast({
          title: "상품을 찾을 수 없습니다",
          description: error.message || "잘못된 상품 ID입니다.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkUserAndLoadFurniture();
  }, [id, navigate, toast]);

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

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit-card":
        return "신용카드";
      case "bank-transfer":
        return "무통장입금";
      case "kakao-pay":
        return "카카오페이";
      default:
        return method;
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !furniture) return;
    
    if (!buyerName || !buyerPhone || !buyerAddress) {
      toast({
        title: "정보 입력 필요",
        description: "구매자 정보를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 토스페이먼츠 SDK 로드
      const tossPayments = (window as any).TossPayments('test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm');
      
      // 결제창 열기
      await tossPayments.requestPayment('카드', {
        amount: furniture.price,
        orderId: `order_${furniture.id}_${Date.now()}`,
        orderName: furniture.title,
        customerName: buyerName,
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
    } catch (error: any) {
      // 사용자가 결제창을 닫은 경우 등
      if (error.code !== 'USER_CANCEL') {
        console.error('결제 오류:', error);
        toast({
          title: "결제 처리 오류",
          description: error.message || "결제 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  if (!furniture) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 상품 정보 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>상품 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={furniture.image}
                    alt={furniture.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-2">
                    {furniture.title}
                  </h2>
                  <p className="text-3xl font-bold text-accent">
                    {formatPrice(furniture.price)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">크기:</span>
                    <span className="font-medium">{furniture.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">위치:</span>
                    <span className="font-medium">{furniture.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">등록:</span>
                    <span className="font-medium">{furniture.timeAgo}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">상태:</span>
                      <span className="font-medium ml-2">{furniture.condition}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 결제 정보 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>구매자 정보</CardTitle>
                <CardDescription>배송을 위한 정보를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="홍길동"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">배송지 주소</Label>
                    <Input
                      id="address"
                      placeholder="서울시 강남구..."
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <Label>결제 수단</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-4 w-4" />
                          신용카드
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building2 className="h-4 w-4" />
                          무통장입금
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <RadioGroupItem value="kakao-pay" id="kakao-pay" />
                        <Label htmlFor="kakao-pay" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Wallet className="h-4 w-4" />
                          카카오페이
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>상품 금액</span>
                      <span>{formatPrice(furniture.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>배송비</span>
                      <span className="text-green-600">무료</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>총 결제금액</span>
                      <span className="text-accent">{formatPrice(furniture.price)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "결제 처리 중..." : `${formatPrice(furniture.price)} 결제하기`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurniturePayment;

