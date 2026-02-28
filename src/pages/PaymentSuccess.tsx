import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Home, Receipt } from "lucide-react";

const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

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

        const amountNumber = parseInt(amount);

        // orderId 형식에 따라 처리 분기
        // - 가구 결제: order_{id}_{timestamp}
        // - 상품 결제(챗봇): product_order_{productId}_{timestamp}
        const isProductOrder = orderId.startsWith("product_order_");

        let productName = "상품";
        let furnitureId: string | null = null;
        let productId: string | null = null;
        let quantity: number | null = null;

        if (isProductOrder) {
          const match = orderId.match(/^product_order_(.+?)_/);
          productId = match ? match[1] : null;

          // create_order에서 저장해둔 주문 컨텍스트
          const pendingRaw = sessionStorage.getItem(`pending_order_${orderId}`);
          const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
          if (pending?.product_name) productName = pending.product_name;
          if (pending?.quantity) quantity = Number(pending.quantity);
        } else {
          // orderId에서 상품 정보 추출 (order_{id}_{timestamp} 형식)
          const furnitureIdMatch = orderId.match(/order_(\d+)_/);
          furnitureId = furnitureIdMatch ? furnitureIdMatch[1] : null;

          // Supabase에서 가구 정보 가져오기
          if (furnitureId) {
            const { data: furniture } = await supabase
              .from("furniture")
              .select("title")
              .eq("id", furnitureId)
              .single();

            if (furniture) {
              productName = furniture.title;
            }
          }
        }

        // 1. order 테이블에 주문 정보 저장
        const { error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id,
              order_number: orderId,
              product_name: isProductOrder && quantity ? `${productName} ${quantity}개` : productName,
              amount: amountNumber,
              status: 'completed',
              payment_key: paymentKey,
              furniture_id: isProductOrder ? productId : furnitureId,
            }
          ]);

        if (orderError) {
          console.error('주문 저장 오류:', orderError);
          // 저장 오류가 있어도 결제는 성공했으므로 계속 진행
        }

        // 2. (상품 결제) 재고 감소
        if (isProductOrder && productId && quantity) {
          if (isUUID(productId)) {
            const { data: product, error: productError } = await supabase
              .from("products")
              .select("stock, title")
              .eq("id", productId)
              .single();

            if (productError) {
              console.error("상품 조회 오류:", productError);
            } else {
              const currentStock = Number(product.stock ?? 0);
              if (currentStock < quantity) {
                toast({
                  title: "재고 부족",
                  description: `재고가 부족해요 (현재 재고: ${currentStock}개)`,
                  variant: "destructive",
                });
              } else {
                const newStock = currentStock - quantity;
                const { error: stockError } = await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", productId)
                  .gte("stock", quantity);

                if (stockError) {
                  console.error("재고 업데이트 오류:", stockError);
                }
              }
            }
          } else {
            // 비-UUID 상품은 로컬 데이터로 간주: Supabase 재고 감소 생략
          }

          // pending 컨텍스트 정리
          try {
            sessionStorage.removeItem(`pending_order_${orderId}`);
          } catch {}
        }

        setPaymentInfo({
          paymentKey,
          orderId,
          amount: amountNumber,
          productName: isProductOrder && quantity ? `${productName} ${quantity}개` : productName,
        });

        toast({
          title: "결제 완료!",
          description: isProductOrder && quantity ? `${productName} ${quantity}개 주문 완료!` : "결제가 성공적으로 완료되었습니다.",
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

