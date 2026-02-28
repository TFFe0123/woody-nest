import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 가져오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 더미 Supabase 클라이언트 생성 (환경 변수가 없을 때)
const createDummyClient = () => {
  const dummyAuth = {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    signOut: () => Promise.resolve({ error: null }),
    updateUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    onAuthStateChange: (callback: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  };

  const dummyFrom = (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
    }),
  });

  const dummyStorage = {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
    }),
  };

  return {
    auth: dummyAuth,
    from: dummyFrom,
    storage: dummyStorage,
  } as any;
};

// Supabase 클라이언트 생성 또는 더미 클라이언트 반환
let supabaseClient: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase 환경 변수가 설정되지 않았습니다.\n' +
    '.env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.\n' +
    '현재 로그인, 회원가입 등의 기능이 제한됩니다.\n' +
    '기본 페이지는 정상적으로 작동합니다.'
  );
  supabaseClient = createDummyClient();
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

