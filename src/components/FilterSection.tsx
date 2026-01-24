import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";

const styles = [
  "전체",
  "미드센추리",
  "빅토리안",
  "아르데코",
  "프로방스",
  "스칸디나비안",
  "쇼와",
  "조선",
];

const materials = [
  "전체",
  "오크",
  "월넛",
  "티크",
  "마호가니",
  "체리",
  "삼나무",
];

interface FilterSectionProps {
  selectedStyle?: string;
  selectedMaterial?: string;
  onStyleChange?: (style: string) => void;
  onMaterialChange?: (material: string) => void;
}

const FilterSection = ({ 
  selectedStyle: externalStyle, 
  selectedMaterial: externalMaterial,
  onStyleChange,
  onMaterialChange 
}: FilterSectionProps) => {
  const [internalStyle, setInternalStyle] = useState("전체");
  const [internalMaterial, setInternalMaterial] = useState("전체");
  const [showFilters, setShowFilters] = useState(false);

  // 외부 props가 있으면 사용, 없으면 내부 state 사용
  const selectedStyle = externalStyle !== undefined ? externalStyle : internalStyle;
  const selectedMaterial = externalMaterial !== undefined ? externalMaterial : internalMaterial;

  const handleStyleChange = (style: string) => {
    if (onStyleChange) {
      onStyleChange(style);
    } else {
      setInternalStyle(style);
    }
  };

  const handleMaterialChange = (material: string) => {
    if (onMaterialChange) {
      onMaterialChange(material);
    } else {
      setInternalMaterial(material);
    }
  };

  const hasActiveFilters = selectedStyle !== "전체" || selectedMaterial !== "전체";

  const clearFilters = () => {
    handleStyleChange("전체");
    handleMaterialChange("전체");
  };

  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        {/* Mobile Toggle */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            필터
            {hasActiveFilters && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                !
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        {/* Filter Content */}
        <div className={`space-y-4 ${showFilters ? "block" : "hidden md:block"}`}>
          {/* Style Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-primary">스타일</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="hidden md:flex text-muted-foreground h-auto p-0 hover:text-accent"
                >
                  필터 초기화
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <Button
                  key={style}
                  variant={selectedStyle === style ? "default" : "warm"}
                  size="sm"
                  onClick={() => handleStyleChange(style)}
                  className={`rounded-full transition-all ${
                    selectedStyle === style
                      ? "shadow-soft"
                      : ""
                  }`}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">소재</h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <Button
                  key={material}
                  variant={selectedMaterial === material ? "default" : "warm"}
                  size="sm"
                  onClick={() => handleMaterialChange(material)}
                  className={`rounded-full transition-all ${
                    selectedMaterial === material
                      ? "shadow-soft"
                      : ""
                  }`}
                >
                  {material}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
