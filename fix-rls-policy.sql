-- ==========================================
-- RLS 정책 오류 해결: 가구 등록 및 Storage 정책 수정
-- ==========================================

-- 1. furniture 테이블 정책 재설정
DROP POLICY IF EXISTS "Anyone can view furniture" ON public.furniture;
DROP POLICY IF EXISTS "Authenticated users can insert furniture" ON public.furniture;
DROP POLICY IF EXISTS "Users can update their own furniture" ON public.furniture;
DROP POLICY IF EXISTS "Users can delete their own furniture" ON public.furniture;

-- 조회: 누구나 가능
CREATE POLICY "Enable read access for all users"
ON public.furniture
FOR SELECT
USING (true);

-- 등록: 로그인한 사용자만 가능
CREATE POLICY "Enable insert for authenticated users only"
ON public.furniture
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 수정: 자신의 가구만 가능
CREATE POLICY "Enable update for users based on user_id"
ON public.furniture
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 삭제: 자신의 가구만 가능
CREATE POLICY "Enable delete for users based on user_id"
ON public.furniture
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 2. Storage 정책 재설정
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Storage: 누구나 조회 가능
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'furniture-images');

-- Storage: 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'furniture-images');

-- Storage: 자신이 업로드한 이미지만 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'furniture-images');

-- 3. 확인
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('furniture', 'objects')
ORDER BY tablename, cmd;

