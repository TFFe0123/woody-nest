// Supabase Edge Function: approve-payment
// 토스페이먼츠 결제 승인 처리
// 
// 배포 방법:
// 1. supabase/functions/approve-payment/index.ts 파일로 복사
// 2. 또는 Supabase 대시보드 → Edge Functions → Create Function에서 직접 생성
//
// 환경 변수 설정 (Supabase 대시보드 → Settings → Edge Functions → Secrets):
// TOSS_PAYMENTS_SECRET_KEY=test_sk_ORzdMaqN3wxBzK4gNPEYV5AkYXQG

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TossPaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface TossPaymentResponse {
  status: string;
  code?: string;
  message?: string;
  paymentKey?: string;
  orderId?: string;
  orderName?: string;
  totalAmount?: number;
  method?: string;
  approvedAt?: string;
}

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. 요청 본문 파싱
    const body: TossPaymentConfirmRequest = await req.json();
    const { paymentKey, orderId, amount } = body;

    // 2. 입력 검증
    if (!paymentKey || !orderId || !amount) {
      return new Response(
        JSON.stringify({ 
          error: '필수 파라미터가 누락되었습니다.',
          details: { paymentKey: !!paymentKey, orderId: !!orderId, amount: !!amount }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 3. Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. 인증 확인 (Authorization 헤더에서 사용자 정보 가져오기)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: '인증 토큰이 필요합니다.' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: '유효하지 않은 인증 토큰입니다.' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 5. 토스페이먼츠 결제 승인 API 호출
    const tossSecretKey = Deno.env.get('TOSS_PAYMENTS_SECRET_KEY');
    if (!tossSecretKey) {
      console.error('TOSS_PAYMENTS_SECRET_KEY 환경 변수가 설정되지 않았습니다.');
      return new Response(
        JSON.stringify({ error: '서버 설정 오류: 토스페이먼츠 시크릿 키가 설정되지 않았습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Base64 인코딩된 Authorization 헤더 생성
    const authString = btoa(`${tossSecretKey}:`);
    
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const tossResult: TossPaymentResponse = await tossResponse.json();

    // 6. 토스페이먼츠 응답 처리
    if (!tossResponse.ok || tossResult.status !== 'DONE') {
      console.error('토스페이먼츠 결제 승인 실패:', tossResult);
      return new Response(
        JSON.stringify({ 
          error: '결제 승인에 실패했습니다.',
          details: tossResult.message || tossResult.code,
          tossError: tossResult
        }),
        { 
          status: tossResponse.status || 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 7. orderId에서 상품 정보 추출 (order_{id}_{timestamp} 형식)
    const furnitureIdMatch = orderId.match(/order_(\d+)_/);
    const furnitureId = furnitureIdMatch ? furnitureIdMatch[1] : null;

    // 8. 가구 정보 가져오기
    let productName = tossResult.orderName || '상품';
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

    // 9. orders 테이블에 주문 정보 저장
    const { error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          order_id: orderId,
          product_name: productName,
          amount: amount,
          status: 'completed',
          payment_key: paymentKey,
          furniture_id: furnitureId,
        }
      ]);

    if (orderError) {
      console.error('주문 저장 오류:', orderError);
      // 주문 저장 실패해도 결제는 승인되었으므로 경고만 기록
      // 필요시 별도 처리가 필요한 경우 여기서 처리
    }

    // 10. 성공 응답 반환
    return new Response(
      JSON.stringify({
        success: true,
        message: '결제가 성공적으로 승인되었습니다.',
        payment: {
          paymentKey: tossResult.paymentKey,
          orderId: tossResult.orderId,
          orderName: tossResult.orderName,
          amount: tossResult.totalAmount,
          method: tossResult.method,
          approvedAt: tossResult.approvedAt,
        },
        order: {
          orderId,
          productName,
          amount,
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('결제 승인 처리 중 오류:', error);
    return new Response(
      JSON.stringify({ 
        error: '결제 승인 처리 중 오류가 발생했습니다.',
        details: error.message || '알 수 없는 오류'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

