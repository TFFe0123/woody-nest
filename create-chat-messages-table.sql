-- 채팅 메시지 테이블 생성
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. chat_messages 테이블 생성
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 3. 정책 생성: 모든 사용자가 채팅 메시지 조회 가능 (익명 사용자 포함)
DO $$
BEGIN
    CREATE POLICY "Anyone can view chat messages"
        ON public.chat_messages
        FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 4. 정책 생성: 모든 사용자가 채팅 메시지 생성 가능 (익명 사용자 포함)
DO $$
BEGIN
    CREATE POLICY "Anyone can insert chat messages"
        ON public.chat_messages
        FOR INSERT
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON public.chat_messages(created_at DESC);

-- 완료! 이제 채팅 메시지를 저장하고 조회할 수 있습니다.
