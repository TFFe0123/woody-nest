# 문제 해결 가이드

## ❌ 오류: "new row violates row-level security policy"

### 증상
- 가구 등록 시 400 오류 발생
- "new row violates row-level security policy" 메시지
- Storage 업로드 실패

### 원인
Supabase RLS(Row Level Security) 정책이 너무 엄격하거나 잘못 설정됨

### 해결 방법

#### 1단계: Supabase SQL Editor 열기
1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 왼쪽 메뉴 → **SQL Editor** 클릭

#### 2단계: 다음 SQL 실행

**전체 복사해서 한 번에 실행하세요:**

```sql
-- furniture 테이블 정책 재설정
DROP POLICY IF EXISTS "Anyone can view furniture" ON public.furniture;
DROP POLICY IF EXISTS "Authenticated users can insert furniture" ON public.furniture;
DROP POLICY IF EXISTS "Users can update their own furniture" ON public.furniture;
DROP POLICY IF EXISTS "Users can delete their own furniture" ON public.furniture;

CREATE POLICY "Enable read access for all users"
ON public.furniture FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.furniture FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id"
ON public.furniture FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
ON public.furniture FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage 정책 재설정
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'furniture-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'furniture-images');

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'furniture-images');
```

#### 3단계: 확인

```sql
-- 정책 확인
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename IN ('furniture', 'objects')
ORDER BY tablename, cmd;
```

다음과 같이 표시되어야 합니다:
- furniture: 4개 정책 (SELECT, INSERT, UPDATE, DELETE)
- objects: 3개 정책 (SELECT, INSERT, DELETE)

#### 4단계: 애플리케이션 재시작

브라우저에서 페이지 새로고침 후 가구 등록 재시도

---

## 💡 임시 해결책 (테스트용)

빠르게 테스트하고 싶다면 RLS를 일시적으로 비활성화:

```sql
-- ⚠️ 경고: 보안 해제! 개발 환경에서만 사용
ALTER TABLE public.furniture DISABLE ROW LEVEL SECURITY;
```

테스트 완료 후 다시 활성화:

```sql
ALTER TABLE public.furniture ENABLE ROW LEVEL SECURITY;
```

---

## 📋 체크리스트

- [ ] Supabase SQL Editor에서 정책 업데이트 SQL 실행
- [ ] Storage 버킷이 Public으로 설정되어 있는지 확인
- [ ] 브라우저 새로고침
- [ ] 로그인 상태 확인
- [ ] 가구 등록 재시도

문제가 계속되면 브라우저 개발자 도구(F12) → Console/Network 탭에서 에러 확인

