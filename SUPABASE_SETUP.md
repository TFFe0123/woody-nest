# Supabase 설정 가이드

이 프로젝트를 사용하기 위해 Supabase에서 필요한 설정을 안내합니다.

## 1. 데이터베이스 테이블 생성

### SQL Editor에서 실행

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New query** 클릭
4. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

생성되는 테이블:
- `payments` - 결제 내역
- `furniture` - 가구 목록

## 2. Storage 버킷 생성 (이미지 업로드용)

### ⚠️ 중요: 이 단계를 꼭 완료해야 이미지 업로드가 작동합니다!

### 방법 1: 대시보드에서 생성 (권장)

1. Supabase 대시보드에서 왼쪽 메뉴의 **Storage** 클릭
2. **New bucket** 버튼 클릭
3. 버킷 정보 입력:
   - **Name**: `furniture-images` (정확히 입력)
   - **Public bucket**: ✅ **체크 필수!**
   - **File size limit**: 5242880 (5MB, 선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)
4. **Create bucket** 클릭

### 방법 2: SQL로 생성

SQL Editor에서 다음 코드 실행:

```sql
-- 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('furniture-images', 'furniture-images', true)
ON CONFLICT (id) DO NOTHING;
```

### Storage 정책 설정

버킷 생성 후 다음 정책들을 SQL Editor에서 실행:

```sql
-- 1. 누구나 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'furniture-images');

-- 2. 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'furniture-images' AND auth.role() = 'authenticated');

-- 3. 자신이 업로드한 이미지만 삭제 가능
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'furniture-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 (이미 완료됨):

```env
VITE_SUPABASE_URL=https://zekpivylcrnxxoeskvxn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. 확인 방법

### 테이블 확인
- Supabase → **Table Editor** → `payments`, `furniture` 테이블 확인

### Storage 확인
- Supabase → **Storage** → `furniture-images` 버킷 확인
- 🌐 Public 표시 확인

## 문제 해결

### "Bucket not found" 오류
- Storage 버킷이 생성되지 않음
- 위의 "2. Storage 버킷 생성" 단계 완료 필요
- 임시 해결책: 이미지 URL을 직접 입력 (Unsplash, Imgur 등)

### "Row Level Security" 오류
- RLS 정책이 설정되지 않음
- `supabase-schema.sql`의 정책 부분을 다시 실행

### 이미지 업로드 후 보이지 않음
- 버킷이 **Public**으로 설정되었는지 확인
- Storage → `furniture-images` → Settings → **Public bucket** 체크 확인

## 도움말

더 자세한 정보는 [Supabase 문서](https://supabase.com/docs)를 참고하세요.

