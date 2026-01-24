-- ==========================================
-- 가구 등록 정책 업데이트: 로그인한 회원만 등록 가능
-- ==========================================

-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert furniture" ON public.furniture;

-- 새로운 INSERT 정책: 로그인한 회원만 가구 등록 가능
CREATE POLICY "Authenticated users can insert furniture"
ON public.furniture
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL);

-- 확인
SELECT policyname, cmd, roles, with_check
FROM pg_policies
WHERE tablename = 'furniture' AND cmd = 'INSERT';

