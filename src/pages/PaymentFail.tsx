import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Home, ArrowLeft } from "lucide-react";

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorInfo, setErrorInfo] = useState<any>(null);

  useEffect(() => {
    // URL 파라미터에서 에러 정보 가져오기
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    if (code || message) {
      setErrorInfo({
        code: code || "UNKNOWN_ERROR",
        message: message || "알 수 없는 오류가 발생했습니다.",
        orderId: orderId || null,
      });

      toast({
        title: "결제 실패",
        description: message || "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const getErrorMessage = (code: string) => {
    const errorMessages: { [key: string]: string } = {
      USER_CANCEL: "결제가 취소되었습니다.",
      INVALID_CARD: "카드 정보가 올바르지 않습니다.",
      INSUFFICIENT_FUNDS: "카드 잔액이 부족합니다.",
      EXPIRED_CARD: "카드 유효기간이 만료되었습니다.",
      CARD_NOT_SUPPORTED: "지원하지 않는 카드입니다.",
      TIMEOUT: "결제 처리 시간이 초과되었습니다.",
      NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
    };

    return errorMessages[code] || "결제 처리 중 오류가 발생했습니다.";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-red-600">결제 실패</CardTitle>
            <CardDescription className="text-lg mt-2">
              {errorInfo
                ? getErrorMessage(errorInfo.code)
                : "결제 처리 중 오류가 발생했습니다."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorInfo && (
              <div className="space-y-4 bg-muted p-6 rounded-lg">
                {errorInfo.orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">주문 번호</span>
                    <span className="font-mono text-sm">{errorInfo.orderId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">오류 코드</span>
                  <span className="font-mono text-sm">{errorInfo.code}</span>
                </div>
                {errorInfo.message && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {errorInfo.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 카드 정보를 다시 확인해주세요.</p>
              <p>• 다른 결제 수단을 선택해주세요.</p>
              <p>• 문제가 계속되면 고객센터로 문의해주세요.</p>
            </div>

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
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFail;

