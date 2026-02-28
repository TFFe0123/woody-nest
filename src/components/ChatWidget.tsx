import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { callOpenAI, checkOpenAIConnection } from "@/lib/openai";
import { checkUserLogin, currentUserEmail } from "@/lib/user";
import { lastSearchResults, setLastSearchResults } from "@/lib/search";
import { requestTossPayment } from "@/lib/tossPayments";

const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  products?: Array<{
    id: number | string;
    title: string;
    price: number;
    image_url?: string;
    location?: string;
    material?: string;
    stock_quantity?: number;
  }>;
}

// 가구 데이터 (실제로는 Supabase에서 가져올 수 있음)
const furnitureDatabase = [
  {
    id: 1,
    title: "1950년대 덴마크 티크 사이드보드",
    price: 1850000,
    location: "서울 강남구",
    material: "티크우드",
    style: "미드센추리",
    condition: "최상",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    stock: 1,
  },
  {
    id: 2,
    title: "프렌치 프로방스 앤틱 다이닝 테이블",
    price: 3200000,
    location: "경기 성남시",
    material: "오크우드",
    style: "프로방스",
    condition: "상",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
    stock: 2,
  },
  {
    id: 3,
    title: "빅토리안 체스터필드 3인 소파",
    price: 2800000,
    location: "서울 용산구",
    material: "월넛 + 가죽",
    style: "빅토리안",
    condition: "상",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    stock: 1,
  },
  {
    id: 4,
    title: "일본 쇼와시대 찬장",
    price: 890000,
    location: "부산 해운대구",
    material: "삼나무",
    style: "쇼와",
    condition: "중",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop",
    stock: 3,
  },
];

// Function Calling 함수 정의
const availableFunctions = [
  {
    name: "search_products",
    description: "Supabase에서 실제 등록된 상품을 검색합니다. 사용자가 상품명, 가구 종류, 키워드를 말하면 이 함수를 사용하세요.",
    parameters: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "검색할 상품명 또는 키워드 (예: 소파, 테이블, 의자, 침대 등)",
        },
      },
      required: ["keyword"],
    },
  },
  {
    name: "search_furniture",
    description: "샘플 가구 데이터베이스에서 가구를 검색합니다. 스타일, 소재, 가격대 등으로 검색할 수 있습니다.",
    parameters: {
      type: "object",
      properties: {
        style: {
          type: "string",
          description: "가구 스타일 (예: 미드센추리, 빅토리안, 프로방스, 쇼와 등)",
        },
        material: {
          type: "string",
          description: "가구 소재 (예: 티크우드, 오크우드, 월넛, 삼나무 등)",
        },
        max_price: {
          type: "number",
          description: "최대 가격 (원)",
        },
        min_price: {
          type: "number",
          description: "최소 가격 (원)",
        },
      },
    },
  },
  {
    name: "get_furniture_details",
    description: "특정 가구의 상세 정보를 조회합니다.",
    parameters: {
      type: "object",
      properties: {
        furniture_id: {
          type: "number",
          description: "가구 ID",
        },
      },
      required: ["furniture_id"],
    },
  },
  {
    name: "recommend_furniture",
    description: "사용자의 선호도나 용도에 맞는 가구를 추천합니다.",
    parameters: {
      type: "object",
      properties: {
        purpose: {
          type: "string",
          description: "가구 용도 (예: 거실, 침실, 식당, 서재 등)",
        },
        budget: {
          type: "number",
          description: "예산 (원)",
        },
      },
    },
  },
  {
    name: "create_order",
    description: "상품을 주문하고 결제를 진행합니다.",
    parameters: {
      type: "object",
      properties: {
        product_id: {
          type: "string",
          description: "상품 ID (AI가 '1번'을 숫자/문자로 변환. lastSearchResults[0]의 id면 1번)",
        },
        quantity: {
          type: "number",
          description: "주문 수량 (AI가 '2개'를 숫자 2로 변환)",
        },
        customer_email: {
          type: "string",
          description: "고객 이메일 (비로그인 시 AI가 물어봐서 받음, 선택사항)",
        },
        customer_name: {
          type: "string",
          description: "고객 이름 (customers에 없을 때 AI가 물어봐서 받음, 선택사항)",
        },
      },
      required: [],
    },
  },
];

// 함수 실행 핸들러
const executeFunctionCall = async (functionName: string, args: any): Promise<string> => {
  switch (functionName) {
    case "search_products":
      try {
        const keyword = args.keyword.toLowerCase();
        let allResults: any[] = [];

        console.log("🔍 상품 검색 시작:", keyword);

        // 1. 먼저 로컬 샘플 데이터에서 검색
        const localResults = furnitureDatabase.filter((item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.style.toLowerCase().includes(keyword) ||
          item.material.toLowerCase().includes(keyword)
        );

        console.log("📦 로컬 데이터 검색 결과:", localResults.length, "개");

        allResults = localResults.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          location: item.location,
          material: item.material,
          style: item.style,
          condition: item.condition,
          image_url: (item as any).image,
          stock: (item as any).stock ?? 1,
          source: "샘플 데이터",
        }));

        // 2. Supabase에서도 검색 시도 (실패해도 계속 진행)
        try {
          console.log("🔗 Supabase 연결 시도...");
          
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,material.ilike.%${keyword}%,style.ilike.%${keyword}%`)
            .limit(50); // 최대 50개까지 검색

          if (error) {
            console.error("❌ Supabase 검색 오류:", error);
          } else if (data && data.length > 0) {
            console.log("✅ Supabase 데이터 검색 성공:", data.length, "개");
            const supabaseResults = data.map((product) => ({
              id: product.id,
              title: product.title,
              price: product.price,
              description: product.description,
              location: product.location,
              material: product.material,
              style: product.style,
              image_url: product.image_url || product.image,
              stock: product.stock ?? 1,
              source: "Supabase 등록 상품",
            }));
            allResults = [...allResults, ...supabaseResults];
          } else {
            console.log("ℹ️ Supabase에서 검색 결과 없음");
          }
        } catch (supabaseError: any) {
          console.log("⚠️ Supabase 검색 건너뜀:", supabaseError.message);
          // Supabase 오류는 무시하고 계속 진행
        }

        console.log("📊 전체 검색 결과:", allResults.length, "개");

        // 3. 결과 반환
        if (allResults.length === 0) {
          return JSON.stringify({
            success: true,
            count: 0,
            message: `'${args.keyword}' 관련 상품을 찾을 수 없습니다.`,
            items: [],
          });
        }

        return JSON.stringify({
          success: true,
          count: allResults.length,
          message: `'${args.keyword}' 검색 결과 ${allResults.length}개의 상품을 찾았습니다.`,
          items: allResults,
        });
      } catch (error: any) {
        console.error("💥 search_products 실행 오류:", error);
        
        // 오류 발생 시에도 최소한 로컬 데이터 검색 시도
        const keyword = args.keyword.toLowerCase();
        const localResults = furnitureDatabase.filter((item) =>
          item.title.toLowerCase().includes(keyword)
        );

        if (localResults.length > 0) {
          return JSON.stringify({
            success: true,
            count: localResults.length,
            message: `'${args.keyword}' 검색 결과 ${localResults.length}개의 상품을 찾았습니다.`,
            items: localResults,
          });
        }

        return JSON.stringify({
          success: false,
          message: "상품 검색 중 오류가 발생했습니다.",
          error: error.message,
        });
      }

    case "search_furniture":
      const filtered = furnitureDatabase.filter((item) => {
        if (args.style && item.style !== args.style) return false;
        if (args.material && !item.material.includes(args.material)) return false;
        if (args.max_price && item.price > args.max_price) return false;
        if (args.min_price && item.price < args.min_price) return false;
        return true;
      });

      if (filtered.length === 0) {
        return JSON.stringify({
          success: false,
          message: "검색 조건에 맞는 가구를 찾을 수 없습니다.",
        });
      }

      return JSON.stringify({
        success: true,
        count: filtered.length,
        items: filtered.map((f) => ({
          id: f.id,
          title: f.title,
          price: f.price,
          location: f.location,
          material: f.material,
          style: f.style,
          image_url: (f as any).image,
          stock: (f as any).stock ?? 1,
        })),
      });

    case "get_furniture_details":
      const furniture = furnitureDatabase.find((f) => f.id === args.furniture_id);
      if (!furniture) {
        return JSON.stringify({
          success: false,
          message: "해당 가구를 찾을 수 없습니다.",
        });
      }
      return JSON.stringify({
        success: true,
        furniture: furniture,
      });

    case "recommend_furniture":
      const budget = args.budget || 5000000;
      const recommendations = furnitureDatabase
        .filter((f) => f.price <= budget)
        .slice(0, 3);
      return JSON.stringify({
        success: true,
        recommendations: recommendations,
        message: `${args.purpose || "일반 용도"}에 적합한 가구 ${recommendations.length}개를 찾았습니다.`,
      });

    case "create_order": {
      // product_id가 1, 2, 3 등 숫자면 lastSearchResults 인덱스로 해석 (1번 = index 0)
      let productId = args.product_id;
      const numId = typeof productId === "string" ? parseInt(productId, 10) : productId;
      if (!isNaN(numId) && numId >= 1 && lastSearchResults.length >= numId) {
        productId = lastSearchResults[numId - 1].id;
      }

      // 1. 이메일 결정: customer_email 우선, 없으면 currentUserEmail
      const email = args.customer_email || currentUserEmail;
      if (!email || !email.trim()) {
        return JSON.stringify({
          success: false,
          message: "이메일을 알려주세요.",
        });
      }

      // 2. customers 테이블에서 이메일로 조회
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("id, name")
        .eq("email", email.trim())
        .maybeSingle();

      if (customerError) {
        console.error("customers 조회 오류:", customerError);
        return JSON.stringify({
          success: false,
          message: "고객 정보 조회 중 오류가 발생했습니다.",
        });
      }

      // 3. 이름 결정: customers에서 찾은 이름 사용, 없으면 customer_name
      const name = customer?.name || args.customer_name;
      if (!name || !String(name).trim()) {
        return JSON.stringify({
          success: false,
          message: "이름을 알려주세요.",
        });
      }

      // 4. 수량 정규화
      const quantity = Number(args.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return JSON.stringify({
          success: false,
          message: "수량이 올바르지 않습니다.",
        });
      }

      let orderProductId = String(productId);
      let productName = "";
      let unitPrice = 0;
      let stock = 0;

      if (!isUUID(orderProductId)) {
        // 로컬/숫자 ID: lastSearchResults에서 찾기
        const local = lastSearchResults.find((p) => String(p.id) === orderProductId);
        if (!local) {
          return JSON.stringify({
            success: false,
            message: "상품을 찾을 수 없어요",
          });
        }
        productName = local.title;
        unitPrice = Number(local.price ?? 0);
        stock = Number(local.stock_quantity ?? 0);

        // 재고 확인 (로컬 데이터)
        if (stock < quantity) {
          return JSON.stringify({
            success: false,
            message: `재고가 부족해요 (현재 재고: ${stock}개)`,
          });
        }
      } else {
        // 6. UUID이면 products 테이블 조회
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("id, title, price, stock")
          .eq("id", orderProductId)
          .maybeSingle();

        if (productError) {
          console.error("products 조회 오류:", productError);
        }

        // 7. 상품 없으면 에러
        if (productError || !product) {
          return JSON.stringify({
            success: false,
            message: "상품을 찾을 수 없어요",
          });
        }

        // 8. 재고 확인
        stock = Number(product.stock ?? 0);
        if (stock < quantity) {
          return JSON.stringify({
            success: false,
            message: `재고가 부족해요 (현재 재고: ${stock}개)`,
          });
        }

        productName = product.title;
        unitPrice = Number(product.price ?? 0);
        orderProductId = product.id;
      }

      // 9. 총 금액 계산
      const totalPrice = unitPrice * quantity;

      // 주문 정보 객체 만들기 (주문 INSERT는 다음 단계에서 구현)
      const order = {
        customer_name: String(name).trim(),
        customer_email: email.trim(),
        product_id: orderProductId,
        product_name: productName,
        quantity: quantity,
        total_price: totalPrice,
        status: "pending" as const,
      };

      // 결제 성공 시 /payment-success 에서 처리하기 위해 임시 저장
      const orderId = `product_order_${orderProductId}_${Date.now()}`;
      try {
        sessionStorage.setItem(`pending_order_${orderId}`, JSON.stringify(order));
      } catch (e) {
        console.warn("pending_order 저장 실패:", e);
      }

      // 결제 진행 (기존 토스페이먼츠 결제 기능 재사용)
      const orderName = `${order.product_name} ${order.quantity}개`;
      try {
        await requestTossPayment({
          amount: order.total_price,
          orderId,
          orderName,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          successUrl: `${window.location.origin}/payment-success`,
          failUrl: `${window.location.origin}/payment-fail`,
        });
      } catch (error: any) {
        // 사용자가 결제창을 닫은 경우 등
        if (error?.code === "USER_CANCEL") {
          return JSON.stringify({ success: false, message: "결제가 취소되었습니다" });
        }
        console.error("결제 오류:", error);
        return JSON.stringify({
          success: false,
          message: error?.message || "결제 처리 중 오류가 발생했습니다.",
        });
      }

      return JSON.stringify({
        success: true,
        message: "결제를 진행합니다.",
        order,
        payment: { orderId, orderName, amount: order.total_price },
      });
    }

    default:
      return JSON.stringify({
        success: false,
        message: "알 수 없는 함수입니다.",
      });
  }
};

/** currentUserEmail에 따라 시스템 프롬프트 동적 생성 */
const buildSystemPromptContent = (): string => {
  const basePrompt = `당신은 우디홈(Woody Home) 엔틱 가구 전문 마켓플레이스의 AI 어시스턴트입니다. 
사용자가 상품명이나 가구 종류를 언급하면 search_products 함수를 사용해서 실제 등록된 상품을 검색하세요.
사용자가 스타일이나 소재로 검색하면 search_furniture 함수를 사용하세요.
사용자가 "1번 주문해줘", "2번 2개 주문" 등으로 요청하면 create_order 함수를 사용하세요. product_id는 검색 결과의 해당 번호 상품 id를 전달하세요.

중요: 검색 결과는 모두 빠짐없이 나열해주세요.
- 검색된 모든 상품을 번호를 매겨서 목록으로 보여주세요.
- 각 상품마다 제목, 가격, 위치/소재를 포함해주세요.
- 가격은 원(₩) 단위로 표시하고, 천 단위로 쉼표를 넣어주세요.
- 예시 형식:
  1. 상품명 - ₩1,850,000 (위치/소재)
  2. 상품명 - ₩3,200,000 (위치/소재)
  ...

검색 결과가 많아도 모두 보여주세요. 생략하지 마세요.
한국어로 답변해주세요.

[주문 규칙]
- 번호 인식 → lastSearchResults 기반:
  "1번", "첫 번째" → lastSearchResults[0].id를 product_id로 사용
  "2번", "두 번째" → lastSearchResults[1].id를 product_id로 사용
- 수량 인식: "2개" → quantity 2, "세 개" → quantity 3 (한국어 수량을 숫자로 변환)
- 예외: lastSearchResults가 비어있으면 "먼저 상품을 검색해주세요"라고 안내하고 주문 함수를 호출하지 마세요.
`;

  const userEmailInstruction = currentUserEmail
    ? `\n\n[고객 정보] 사용자 이메일은 이미 확인되었습니다: ${currentUserEmail} 이메일을 다시 묻지 마세요. customers 테이블에 이 이메일이 없으면 이름만 물어보세요.`
    : `\n\n[고객 정보] 주문할 때 이메일을 먼저 물어보세요. 그 이메일로 customers 테이블을 조회해서 고객 정보가 없으면 이름도 물어보세요.`;

  return basePrompt + userEmailInstruction;
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    let session = sessionStorage.getItem("chat_session_id");
    if (!session) {
      session = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("chat_session_id", session);
    }
    return session;
  });
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 로그인 정보 확인
    checkUserLogin();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    }).catch((error) => {
      console.warn('사용자 정보 로드 실패:', error);
      setUserId(null);
    });

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserId(session?.user?.id || null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('인증 상태 감지 실패:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "안녕하세요! 우디홈 AI 어시스턴트입니다. 가구 검색, 추천, 상세 정보 조회 등을 도와드립니다. 무엇을 도와드릴까요?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      // OpenAI 연결 상태 확인
      const connectionCheck = checkOpenAIConnection();
      if (!connectionCheck.ok) {
        console.warn("⚠️ OpenAI API:", connectionCheck.message);
      } else {
        console.log("✅ OpenAI API 연결 준비됨");
      }

      // Supabase 연결 테스트
      const testSupabaseConnection = async () => {
        try {
          const { error } = await supabase.from("products").select("count").limit(1);
          if (error) console.error("❌ Supabase 연결 실패:", error);
          else console.log("✅ Supabase 연결 성공!");
        } catch (err) {
          console.error("💥 Supabase 테스트 오류:", err);
        }
      };
      testSupabaseConnection();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 대화 히스토리를 OpenAI 형식으로 변환
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      // 시스템 프롬프트 동적 생성 (currentUserEmail에 따라)
      const systemPrompt = {
        role: "system" as const,
        content: buildSystemPromptContent(),
      };

      // 사용자 메시지 추가
      const userPrompt = {
        role: "user" as const,
        content: userMessageText,
      };

      // OpenAI API 호출 (Function Calling 포함)
      const response = await callOpenAI(
        [systemPrompt, ...conversationHistory, userPrompt],
        "gpt-4o-mini",
        availableFunctions
      );

      let finalResponse = "";

      // Function call이 있는 경우
      if (response.functionCall) {
        const { name, arguments: argsString } = response.functionCall;
        const args = JSON.parse(argsString);

        console.log(`Function called: ${name}`, args);

        // 함수 실행 (async 함수 지원)
        const functionResult = await executeFunctionCall(name, args);

        // 검색 결과 파싱
        let parsedResult;
        try {
          parsedResult = JSON.parse(functionResult);
        } catch (e) {
          parsedResult = { success: false, message: functionResult };
        }

        // 함수 결과를 포함해서 다시 OpenAI 호출
        const followUpResponse = await callOpenAI(
          [
            systemPrompt,
            ...conversationHistory,
            userPrompt,
            {
              role: "assistant" as const,
              content: null,
              function_call: {
                name: name,
                arguments: argsString,
              },
            },
            {
              role: "function" as const,
              name: name,
              content: functionResult,
            },
          ],
          "gpt-4o-mini"
        );

        finalResponse = followUpResponse.content || "응답을 생성할 수 없습니다.";

        // 검색 함수인 경우 상품 카드 데이터 추가
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: finalResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        if (name === "search_products" || name === "search_furniture") {
          if (parsedResult.success && parsedResult.items && parsedResult.items.length > 0) {
            const productItems = parsedResult.items.map((item: any) => ({
              id: item.id,
              title: item.title,
              price: item.price || 0,
              image_url: item.image_url || item.image,
              location: item.location,
              material: item.material,
              stock_quantity: item.stock ?? item.stock_quantity ?? 1,
            }));
            botMessage.products = productItems;

            // search_products 결과만 lastSearchResults에 저장 (나중에 "1번" 등 선택 시 사용)
            if (name === "search_products") {
              setLastSearchResults(productItems);
            }
          } else if (name === "search_products") {
            // 검색 결과 없을 때도 lastSearchResults 초기화
            setLastSearchResults([]);
          }
        }

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // 일반 응답
        finalResponse = response.content || "응답을 생성할 수 없습니다.";
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: finalResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error: any) {
      console.error("챗봇 응답 오류:", error);
      const errorText = error?.message || "알 수 없는 오류";
      const userFriendlyMessage =
        errorText.includes("API 키") || errorText.includes("설정되지 않았습니다")
          ? `${errorText}\n\n.env 파일에 VITE_OPENAI_API_KEY를 설정하고 개발 서버를 재시작해주세요.`
          : `죄송합니다. 응답 생성 중 오류가 발생했습니다.\n\n${errorText}\n\n다시 시도해주세요.`;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: userFriendlyMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated bg-gradient-walnut hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 bg-card rounded-2xl shadow-elevated border border-border z-50 flex flex-col transition-all ${
            isMinimized ? "h-16" : "h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-walnut rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-primary-foreground">
                  우디홈 AI 어시스턴트
                </h3>
                <p className="text-xs text-primary-foreground/70">
                  {isLoading ? "입력 중..." : "온라인"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* 상품 카드 - Grid 레이아웃 */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 gap-2 max-w-full">
                          {message.products.map((product, index) => (
                            <div
                              key={product.id}
                              className="relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 flex flex-col"
                            >
                              {/* 번호 배지 */}
                              <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                                {index + 1}
                              </div>

                              {/* 상품 이미지 */}
                              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 
                                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                    <svg
                                      className="w-10 h-10"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* 상품 정보 */}
                              <div className="p-2.5 flex flex-col flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
                                  {product.title}
                                </h4>
                                <p className="text-base font-bold text-accent mt-1">
                                  ₩{(product.price || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  재고 {product.stock_quantity ?? 1}개
                                </p>
                                
                                <Button
                                  size="sm"
                                  className="mt-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs py-1.5"
                                  onClick={() => {
                                    const cartMessage: Message = {
                                      id: Date.now().toString(),
                                      text: `"${product.title}"을(를) 장바구니에 담았습니다! 🛒`,
                                      sender: "bot",
                                      timestamp: new Date(),
                                    };
                                    setMessages((prev) => [...prev, cartMessage]);
                                  }}
                                >
                                  장바구니 담기
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  "소파 찾아줘" 또는 "테이블 검색" 또는 "미드센추리 가구"
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
