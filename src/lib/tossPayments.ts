// TossPayments 결제 유틸 (기존 FurniturePayment의 로직 재사용)

type TossPaymentMethod = "카드";

export type TossPaymentRequest = {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
  method?: TossPaymentMethod;
};

// 테스트 환경: 기존 코드에서 사용 중인 토스페이먼츠 테스트 Client Key
const TOSS_CLIENT_KEY = "test_ck_KNbdOvk5rkWX19R4L5Knrn07xlzm";

export async function requestTossPayment(req: TossPaymentRequest) {
  const tossFactory = (window as any).TossPayments;
  if (!tossFactory) {
    throw new Error("TossPayments SDK가 로드되지 않았습니다.");
  }

  const tossPayments = tossFactory(TOSS_CLIENT_KEY);
  const method: TossPaymentMethod = req.method ?? "카드";

  // 기존 구현과 동일하게 requestPayment 호출
  return await tossPayments.requestPayment(method, {
    amount: req.amount,
    orderId: req.orderId,
    orderName: req.orderName,
    customerName: req.customerName,
    // TossPayments 옵션에서 지원되는 경우 전달 (지원되지 않으면 무시되거나 에러가 날 수 있어 optional)
    customerEmail: req.customerEmail,
    successUrl: req.successUrl,
    failUrl: req.failUrl,
  });
}


