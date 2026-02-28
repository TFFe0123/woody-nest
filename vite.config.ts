import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // OpenAI API 프록시 (CORS 및 API 키 보안)
      "/api/chat": {
        target: "https://api.openai.com",
        changeOrigin: true,
        rewrite: (path) => "/v1/chat/completions",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // 테스트 환경용 하드코딩 제거 (빈 문자열). 실제 키는 .env에서 주입 필요.
            const TEST_KEY = "";
            const apiKey = process.env.VITE_OPENAI_API_KEY || TEST_KEY;
            if (apiKey) {
              proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
            }
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
