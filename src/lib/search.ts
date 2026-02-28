// search_products 검색 결과 전역 변수
// 사용자가 "1번", "2번" 등으로 선택할 때 lastSearchResults[index] 사용
export type SearchProductItem = {
  id: number | string;
  title: string;
  price: number;
  image_url?: string;
  location?: string;
  material?: string;
  stock_quantity?: number;
};

export let lastSearchResults: SearchProductItem[] = [];

export const setLastSearchResults = (results: SearchProductItem[]) => {
  lastSearchResults = results;
};

