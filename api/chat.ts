// Vercel Serverless Function - OpenAI API 프록시
// 프로덕션 배포 시 CORS 및 API 키 보안을 위해 사용

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req: any, res: any) {
  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY가 설정되지 않았습니다.");
    return res.status(500).json({
      error: "서버 설정 오류",
      message: "OpenAI API 키가 설정되지 않았습니다. Vercel 환경변수에 OPENAI_API_KEY를 추가해주세요.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("OpenAI API 프록시 오류:", error);
    return res.status(500).json({
      error: "API 호출 실패",
      message: error.message || "OpenAI API 호출 중 오류가 발생했습니다.",
    });
  }
}

