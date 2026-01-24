import { Armchair, BedDouble, UtensilsCrossed, Lamp, Archive, Crown } from "lucide-react";

const categories = [
  { name: "소파", icon: Armchair, count: 324 },
  { name: "침대", icon: BedDouble, count: 187 },
  { name: "식탁", icon: UtensilsCrossed, count: 256 },
  { name: "조명", icon: Lamp, count: 142 },
  { name: "수납장", icon: Archive, count: 298 },
  { name: "고가구", icon: Crown, count: 89 },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">
            카테고리
          </h2>
          <p className="text-muted-foreground">
            원하시는 가구 종류를 선택해보세요
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className="group p-6 bg-background rounded-xl border border-border hover:border-gold/50 hover:shadow-card transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-beige-warm group-hover:bg-gold/20 transition-colors">
                  <category.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-serif font-semibold text-primary group-hover:text-accent transition-colors">
                    {category.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {category.count}개
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
