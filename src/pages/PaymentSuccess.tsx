import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Home, Receipt } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL 파라미터에서 결제 정보 가져오기
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 정보를 찾을 수 없습니다.");
        }

        // 사용자 확인
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "로그인 필요",
            description: "로그인 후 이용해주세요.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // orderId에서 상품 정보 추출 (order_{id}_{timestamp} 형식)
        const furnitureIdMatch = orderId.match(/order_(\d+)_/);
        const furnitureId = furnitureIdMatch ? furnitureIdMatch[1] : null;

        // Supabase에서 가구 정보 가져오기
        let productName = "상품";
        if (furnitureId) {
          const { data: furniture } = await supabase
            .from('furniture')
            .select('title')
            .eq('id', furnitureId)
            .single();
          
          if (furniture) {
            productName = furniture.title;
          }
        }

        // 1. order 테이블에 주문 정보 저장
        const { error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id,
              order_id: orderId,
              product_name: productName,
              amount: parseInt(amount),
              status: 'completed',
              payment_key: paymentKey,
              furniture_id: furnitureId,
            }
          ]);

        if (orderError) {
          console.error('주문 저장 오류:', orderError);
          // 저장 오류가 있어도 결제는 성공했으므로 계속 진행
        }

        // 2. payments 테이블에 결제 내역 저장
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([
            {
              user_id: user.id,
              product_name: productName,
              amount: parseInt(amount),
              status: 'completed',
              payment_method: '신용카드',
              payment_key: paymentKey,
              order_id: orderId,
            }
          ])
          .select();

        if (paymentError) {
          console.error('결제 저장 오류:', paymentError);
          toast({
            title: "저장 오류",
            description: `결제는 완료되었으나 저장 중 오류가 발생했습니다: ${paymentError.message}`,
            variant: "destructive",
          });
        } else {
          console.log('결제 내역 저장 완료');
        }

        setPaymentInfo({
          paymentKey,
          orderId,
          amount: parseInt(amount),
          productName,
        });

        toast({
          title: "결제 완료!",
          description: "결제가 성공적으로 완료되었습니다.",
        });
      } catch (error: any) {
        console.error('결제 처리 오류:', error);
        toast({
          title: "오류 발생",
          description: error.message || "결제 정보를 처리하는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, navigate, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">결제 정보 처리 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-green-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600">결제 완료</CardTitle>
            <CardDescription className="text-lg mt-2">
              결제가 성공적으로 완료되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentInfo && (
              <div className="space-y-4 bg-muted p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">상품명</span>
                  <span className="font-semibold">{paymentInfo.productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">결제 금액</span>
                  <span className="font-bold text-lg text-accent">
                    {formatPrice(paymentInfo.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">주문 번호</span>
                  <span className="font-mono text-sm">{paymentInfo.orderId}</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                <Home className="mr-2 h-4 w-4" />
                홈으로
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/payment-history")}
              >
                <Receipt className="mr-2 h-4 w-4" />
                결제 내역 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;

