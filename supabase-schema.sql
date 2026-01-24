-- 결제내역 테이블 생성
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. payments 테이블 생성
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    amount BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3. 정책 생성: 사용자는 자신의 결제내역만 조회 가능
CREATE POLICY "Users can view their own payments"
    ON public.payments
    FOR SELECT
    USING (auth.uid() = user_id);

-- 4. 정책 생성: 사용자는 자신의 결제내역만 생성 가능
CREATE POLICY "Users can insert their own payments"
    ON public.payments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 5. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

-- 6. 샘플 데이터 삽입 (선택사항)
-- 현재 로그인한 사용자의 UUID를 확인하고 아래 YOUR_USER_ID를 교체하세요
/*
INSERT INTO public.payments (user_id, product_name, amount, status, payment_method, created_at) VALUES
    ('YOUR_USER_ID', '빈티지 우드 테이블', 450000, 'completed', '신용카드', NOW() - INTERVAL '10 days'),
    ('YOUR_USER_ID', '북유럽 스타일 의자 세트', 280000, 'completed', '무통장입금', NOW() - INTERVAL '15 days'),
    ('YOUR_USER_ID', '원목 책장', 320000, 'completed', '카카오페이', NOW() - INTERVAL '20 days'),
    ('YOUR_USER_ID', '앤틱 서랍장', 580000, 'pending', '신용카드', NOW() - INTERVAL '2 days'),
    ('YOUR_USER_ID', '우드 선반', 150000, 'cancelled', '신용카드', NOW() - INTERVAL '25 days');
*/

-- 완료! 이제 애플리케이션에서 결제내역을 조회할 수 있습니다.

-- ==========================================
-- 가구 등록 테이블
-- ==========================================

-- 1. furniture 테이블 생성
CREATE TABLE IF NOT EXISTS public.furniture (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    price BIGINT NOT NULL,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('최상', '상', '중', '하')),
    style TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.furniture ENABLE ROW LEVEL SECURITY;

-- 3. 정책 생성: 모든 사용자가 가구 목록 조회 가능
CREATE POLICY "Anyone can view furniture"
    ON public.furniture
    FOR SELECT
    USING (true);

-- 4. 정책 생성: 로그인한 회원만 가구 등록 가능
CREATE POLICY "Authenticated users can insert furniture"
    ON public.furniture
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 5. 정책 생성: 사용자는 자신의 가구만 수정 가능
CREATE POLICY "Users can update their own furniture"
    ON public.furniture
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. 정책 생성: 사용자는 자신의 가구만 삭제 가능
CREATE POLICY "Users can delete their own furniture"
    ON public.furniture
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS furniture_user_id_idx ON public.furniture(user_id);
CREATE INDEX IF NOT EXISTS furniture_created_at_idx ON public.furniture(created_at DESC);

-- 완료! 이제 사용자가 가구를 등록하고 조회할 수 있습니다.

-- ==========================================
-- Storage 버킷 생성 (이미지 업로드용)
-- ==========================================

-- 1. furniture-images 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture-images', 'furniture-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 버킷 정책: 누구나 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-images');

-- 3. 버킷 정책: 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'furniture-images' AND auth.role() = 'authenticated');

-- 4. 버킷 정책: 사용자는 자신이 업로드한 파일만 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'furniture-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 완료! 이제 이미지를 업로드하고 저장할 수 있습니다.

