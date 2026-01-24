-- ==========================================
-- furniture 테이블 INSERT 정책 수정
-- ==========================================

-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert furniture" ON public.furniture;

-- 새로운 INSERT 정책 (로그인한 사용자는 모두 삽입 가능)
CREATE POLICY "Authenticated users can insert furniture"
ON public.furniture
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 확인
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'furniture';

