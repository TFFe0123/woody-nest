// 현재 사용자 이메일 전역 변수
// 초기값: null
export let currentUserEmail: string | null = null;

// currentUserEmail을 설정하는 함수 (선택사항)
export const setCurrentUserEmail = (email: string | null) => {
  currentUserEmail = email;
};

// 저장소에서 이메일 추출하는 헬퍼 함수
const extractEmailFromStorage = (storage: Storage, key: string): string | null => {
  try {
    const data = storage.getItem(key);
    if (!data) return null;

    // JSON 파싱 시도
    let parsed: any;
    try {
      parsed = JSON.parse(data);
    } catch {
      // JSON이 아니면 문자열로 처리
      return null;
    }

    // 객체에서 이메일 찾기
    if (parsed && typeof parsed === 'object') {
      // 직접 email 속성이 있는 경우
      if (parsed.email && typeof parsed.email === 'string') {
        return parsed.email;
      }
      // user 객체 안에 email이 있는 경우
      if (parsed.user && parsed.user.email && typeof parsed.user.email === 'string') {
        return parsed.user.email;
      }
      // userInfo 객체 안에 email이 있는 경우
      if (parsed.userInfo && parsed.userInfo.email && typeof parsed.userInfo.email === 'string') {
        return parsed.userInfo.email;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

// 로그인 정보 확인 함수
export const checkUserLogin = async (): Promise<void> => {
  let foundEmail: string | null = null;

  // 1. localStorage에서 user 또는 userInfo 찾기
  foundEmail = extractEmailFromStorage(localStorage, 'user') || 
               extractEmailFromStorage(localStorage, 'userInfo');

  // 2. sessionStorage에서 user 또는 userInfo 찾기
  if (!foundEmail) {
    foundEmail = extractEmailFromStorage(sessionStorage, 'user') || 
                 extractEmailFromStorage(sessionStorage, 'userInfo');
  }

  // 3. Supabase Auth 세션에서 user.email 찾기
  if (!foundEmail) {
    try {
      const { supabase } = await import('./supabase');
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!error && user && user.email) {
        foundEmail = user.email;
      }
    } catch (error) {
      // Supabase 확인 실패는 무시
      console.warn('Supabase 사용자 확인 실패:', error);
    }
  }

  // 결과 처리
  if (foundEmail) {
    currentUserEmail = foundEmail;
    console.log(`로그인 이메일: ${foundEmail}`);
  } else {
    currentUserEmail = null;
    console.log('로그인 정보 없음');
  }
};

