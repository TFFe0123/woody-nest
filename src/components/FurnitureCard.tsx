import { Heart, MapPin, Clock, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface FurnitureCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  timeAgo: string;
  image: string;
  material: string;
  dimensions: string;
  condition: string;
  style?: string;
  isLiked?: boolean;
}

const FurnitureCard = ({
  id,
  title,
  price,
  location,
  timeAgo,
  image,
  material,
  dimensions,
  condition,
  style,
  isLiked = false,
}: FurnitureCardProps) => {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };
  
  const handleCardClick = () => {
    navigate(`/furniture/${id}`);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "최상":
        return "bg-green-100 text-green-700 border-green-200";
      case "상":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "중":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <article className="group bg-card rounded-xl overflow-hidden border border-border hover:border-gold/40 shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden" onClick={handleCardClick}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card ${
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            // 좋아요 기능 추가 가능
          }}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        {/* Style Badge */}
        {style && (
          <Badge className="absolute top-3 left-3 bg-gold/90 text-primary-foreground border-0 font-serif">
            {style}
          </Badge>
        )}

        {/* Material Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-card/90 backdrop-blur-sm rounded-full text-primary border border-primary/20">
            {material}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3" onClick={handleCardClick}>
        {/* Title and Price */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-primary line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          <p className="font-serif text-xl font-bold text-accent mt-1">
            ₩{formatPrice(price)}
          </p>
        </div>

        {/* Dimensions */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ruler className="h-4 w-4" />
          <span>{dimensions}</span>
        </div>

        {/* Location and Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="pt-2 border-t border-border">
          <Badge
            variant="outline"
            className={`${getConditionColor(condition)} font-medium`}
          >
            상태: {condition}
          </Badge>
        </div>
      </div>
    </article>
  );
};

export default FurnitureCard;
