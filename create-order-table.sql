-- order 테이블 생성
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. orders 테이블 생성
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    furniture_id TEXT,
    product_name TEXT NOT NULL,
    amount BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled', 'refunded')),
    payment_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. 기존 정책 삭제 (이미 존재하는 경우를 위해)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- 4. 정책 생성: 사용자는 자신의 주문만 조회 가능
CREATE POLICY "Users can view their own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- 5. 정책 생성: 사용자는 자신의 주문만 생성 가능
CREATE POLICY "Users can insert their own orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. 정책 생성: 사용자는 자신의 주문만 수정 가능
CREATE POLICY "Users can update their own orders"
    ON public.orders
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);

-- 완료! 이제 애플리케이션에서 주문 정보를 저장하고 조회할 수 있습니다.

