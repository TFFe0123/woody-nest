import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";

const AddFurniture = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [condition, setCondition] = useState("상");
  const [style, setStyle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "가구 등록은 로그인 후 이용 가능합니다.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setUser(user);
    };

    checkUser();
  }, [navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "이미지 파일은 5MB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      toast({
        title: "잘못된 파일 형식",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('로그인이 필요합니다');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('furniture-images')
      .upload(fileName, file);

    if (error) {
      // 버킷이 없는 경우 더 자세한 에러 메시지
      if (error.message.includes('Bucket not found')) {
        throw new Error('Supabase Storage 버킷이 생성되지 않았습니다. URL을 직접 입력하거나 관리자에게 문의하세요.');
      }
      throw error;
    }

    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('furniture-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!title || !price || !location || !material || !dimensions) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!imageFile && !image) {
      toast({
        title: "이미지 필수",
        description: "가구 이미지를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = image;

      // 파일이 선택된 경우 업로드
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const { data, error } = await supabase
        .from('furniture')
        .insert([
          {
            user_id: user.id,
            title,
            price: parseInt(price),
            location,
            image: imageUrl,
            material,
            dimensions,
            condition,
            style: style || null,
            description: description || null,
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "가구 등록 완료!",
        description: "가구가 성공적으로 등록되었습니다.",
      });

      navigate("/");
    } catch (error: any) {
      console.error('가구 등록 오류:', error);
      toast({
        title: "등록 실패",
        description: error.message || "가구 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold font-serif">가구 등록</h1>
          <p className="text-muted-foreground mt-2">
            판매하고 싶은 가구 정보를 입력해주세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>가구 정보</CardTitle>
            <CardDescription>
              정확한 정보를 입력하면 더 빠르게 판매할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 가구 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  가구 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="예: 1950년대 덴마크 티크 사이드보드"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* 가격 */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  가격 (원) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1850000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* 위치 */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  위치 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="예: 서울 강남구"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  가구 이미지 <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-4">
                  {/* 파일 업로드 */}
                  <div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading || uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 JPG, PNG, GIF 형식 / 최대 5MB
                    </p>
                  </div>
                  
                  {/* 또는 URL 입력 */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">또는</span>
                    </div>
                  </div>
                  
                  <div>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="이미지 URL 입력 (https://...)"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImagePreview(e.target.value);
                        setImageFile(null);
                      }}
                      disabled={loading || uploading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 이미지 URL을 직접 입력할 수도 있습니다
                    </p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img src={imagePreview} alt="미리보기" className="w-full h-64 object-cover" onError={() => {
                      toast({
                        title: "이미지 로드 실패",
                        description: "올바른 이미지 URL인지 확인해주세요.",
                        variant: "destructive",
                      });
                    }} />
                  </div>
                )}
              </div>

              {/* 재질 */}
              <div className="space-y-2">
                <Label htmlFor="material">
                  재질 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="material"
                  placeholder="예: 티크우드"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* 크기 */}
              <div className="space-y-2">
                <Label htmlFor="dimensions">
                  크기 (가로 × 세로 × 높이) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dimensions"
                  placeholder="예: 180 × 45 × 80cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="condition">
                  상태 <span className="text-red-500">*</span>
                </Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="최상">최상</SelectItem>
                    <SelectItem value="상">상</SelectItem>
                    <SelectItem value="중">중</SelectItem>
                    <SelectItem value="하">하</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 스타일 */}
              <div className="space-y-2">
                <Label htmlFor="style">스타일 (선택)</Label>
                <Input
                  id="style"
                  placeholder="예: 미드센추리, 프로방스, 빅토리안"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* 설명 */}
              <div className="space-y-2">
                <Label htmlFor="description">상세 설명 (선택)</Label>
                <Textarea
                  id="description"
                  placeholder="가구에 대한 자세한 설명을 입력해주세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={5}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || uploading}
                >
                  {uploading ? "이미지 업로드 중..." : loading ? "등록 중..." : "가구 등록하기"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddFurniture;

