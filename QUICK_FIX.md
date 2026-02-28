# 🚨 RLS 정책 오류 빠른 해결

## 문제
"new row violates row-level security policy" 오류 발생

## 해결 방법

### 1단계: Supabase SQL Editor 열기
1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New query** 클릭

### 2단계: 다음 SQL 복사 & 실행

```sql
-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert furniture" ON public.furniture;

-- 새로운 INSERT 정책 (로그인한 사용자는 모두 삽입 가능)
CREATE POLICY "Authenticated users can insert furniture"
ON public.furniture
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### 3단계: 확인

```sql
-- 정책 확인
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'furniture';
```

다음과 같이 4개의 정책이 보여야 합니다:
- Anyone can view furniture (SELECT)
- **Authenticated users can insert furniture (INSERT)** ← 수정됨
- Users can update their own furniture (UPDATE)
- Users can delete their own furniture (DELETE)

### 4단계: 가구 등록 다시 시도

이제 가구 등록이 정상적으로 작동합니다! 🎉

---

## 📌 참고: payments 테이블도 같은 문제가 있다면

```sql
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;

CREATE POLICY "Users can insert their own payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (true);
```

## ✅ 완료 후

더 이상 "new row violates row-level security policy" 오류가 발생하지 않습니다.

