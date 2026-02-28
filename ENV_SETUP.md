# 환경 변수 설정 가이드

프로젝트를 실행하기 전에 환경 변수를 설정해야 합니다.

## 1. .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요.

```bash
# Windows (PowerShell)
New-Item .env

# Mac/Linux
touch .env
```

## 2. 환경 변수 설정

`.env` 파일에 다음 내용을 추가하세요:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://zekpivylcrnxxoeskvxn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_tn_ld9sdzLYW05yRYIIALg_-7ZY5Tbz

# OpenAI 설정
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

## 3. 환경 변수 설명

### Supabase 설정
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase Anon (Public) Key

### OpenAI 설정
- `VITE_OPENAI_API_KEY`: OpenAI API Key (GPT-4o-mini 사용)

## 4. .env.example 파일

`.env.example` 파일은 환경 변수 템플릿입니다. 
실제 값은 `.env` 파일에 설정하세요.

## 5. 보안 주의사항

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!
- `.env` 파일은 `.gitignore`에 포함되어 있습니다.
- 실제 API Key는 `.env` 파일에만 저장하세요.
- 공유할 때는 `.env.example` 파일만 공유하세요.

## 6. 환경 변수 확인

환경 변수가 제대로 설정되었는지 확인하려면:

1. 개발 서버 재시작: `npm run dev`
2. 챗봇을 열고 브라우저 콘솔(F12)에서 "OpenAI API 연결 준비됨" 메시지 확인
3. 환경 변수가 없으면 "OpenAI API 키가 설정되지 않았습니다" 오류가 표시됩니다.

## 7. 챗봇 모델 연결 (OpenAI)

챗봇은 `/api/chat` 프록시를 통해 OpenAI API를 호출합니다.

### 로컬 개발
- Vite 프록시가 `.env`의 `VITE_OPENAI_API_KEY`를 사용해 OpenAI로 요청을 전달합니다.
- **반드시** `.env`에 유효한 OpenAI API 키를 설정하고, 변경 후 개발 서버를 재시작하세요.

### Vercel 프로덕션 배포
- `api/chat.ts` 서버리스 함수가 OpenAI API를 호출합니다.
- Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 **OPENAI_API_KEY**를 추가하세요.
- (또는 VITE_OPENAI_API_KEY도 지원됩니다)
