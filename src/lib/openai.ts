// OpenAI API 유틸리티
// 개발: Vite 프록시(/api/chat) 사용 | 프로덕션: Vercel API 라우트 사용

// 테스트 환경용 하드코딩 제거 (빈 문자열)
const TEST_OPENAI_API_KEY = '';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || TEST_OPENAI_API_KEY;
// API 키는 서버(프록시/API 라우트)에서 사용. 클라이언트는 /api/chat 호출
const API_URL = '/api/chat';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// Function Calling 응답 타입
interface OpenAIResponse {
  content: string | null;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

/** API 연결 상태 확인 */
export const checkOpenAIConnection = (): { ok: boolean; message: string } => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
    return {
      ok: false,
      message: 'OpenAI API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 추가하고 개발 서버를 재시작해주세요.',
    };
  }
  return { ok: true, message: 'API 키 설정됨' };
};

export const callOpenAI = async (
  messages: ChatMessage[],
  model: string = 'gpt-4o-mini',
  functions?: FunctionDefinition[]
): Promise<OpenAIResponse> => {
  const connectionCheck = checkOpenAIConnection();
  if (!connectionCheck.ok) {
    throw new Error(connectionCheck.message);
  }

  try {
    const requestBody: any = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    };

    if (functions && functions.length > 0) {
      requestBody.tools = functions.map(fn => ({
        type: 'function',
        function: fn
      }));
      requestBody.tool_choice = 'auto';
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg = data.error?.message || data.message || `API 오류: ${response.status}`;
      throw new Error(errMsg);
    }

    const choice = data.choices?.[0];
    if (!choice?.message) {
      throw new Error('API 응답 형식이 올바르지 않습니다.');
    }

    if (choice.message.tool_calls?.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      return {
        content: null,
        functionCall: {
          name: toolCall.function.name,
          arguments: toolCall.function.arguments,
        },
      };
    }

    return {
      content: choice.message.content || '응답을 생성할 수 없습니다.',
    };
  } catch (error: any) {
    console.error('OpenAI API 호출 오류:', error);
    throw error;
  }
};
