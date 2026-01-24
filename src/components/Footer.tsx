import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-walnut py-12 text-primary-foreground/80">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                <span className="font-serif text-xl text-gold">W</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-primary-foreground">
                  Woody Home
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              시간이 만든 아름다움을 전하는
              <br />
              엔틱 가구 전문 마켓플레이스
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              카테고리
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">소파</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">침대</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">식탁</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">고가구</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              고객지원
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">배송 안내</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">안전거래 가이드</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">1:1 문의</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-primary-foreground mb-4">
              회사 정보
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">회사 소개</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">제휴 문의</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/50">
              © 2024 Woody Home. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-primary-foreground/50">
              Made with <Heart className="h-4 w-4 text-accent fill-accent" /> for antique lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
