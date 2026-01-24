import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // 현재 사용자 정보 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "로그인 후 이용해주세요.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      setUser(user);
      setEmail(user.email || "");
    };

    getUser();
  }, [navigate, toast]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) throw error;

      toast({
        title: "이메일 업데이트 요청",
        description: "새 이메일 주소로 확인 메일이 발송되었습니다. 이메일을 확인해주세요.",
      });
    } catch (error: any) {
      toast({
        title: "이메일 변경 실패",
        description: error.message || "이메일 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast({
        title: "비밀번호 변경 실패",
        description: error.message || "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setLoading(true);

    try {
      // Supabase에서는 관리자 API를 통해 사용자를 삭제해야 합니다.
      // 클라이언트에서는 직접 삭제할 수 없으므로, 로그아웃만 수행합니다.
      toast({
        title: "계정 삭제",
        description: "계정 삭제는 관리자에게 문의해주세요.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.message,
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
          <h1 className="text-3xl font-bold">계정 설정</h1>
          <p className="text-muted-foreground mt-2">
            회원 정보를 관리하고 계정 설정을 변경하세요
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">이메일</TabsTrigger>
            <TabsTrigger value="password">비밀번호</TabsTrigger>
            <TabsTrigger value="account">계정 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>이메일 변경</CardTitle>
                <CardDescription>
                  이메일 주소를 변경하려면 새 이메일 주소를 입력하세요. 확인 메일이 발송됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">현재 이메일</Label>
                    <Input
                      id="currentEmail"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">새 이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="new@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading || email === user.email}>
                    {loading ? "처리 중..." : "이메일 변경"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>비밀번호 변경</CardTitle>
                <CardDescription>
                  새 비밀번호는 최소 6자 이상이어야 합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      * Supabase는 현재 비밀번호 확인 없이 변경이 가능합니다
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "처리 중..." : "비밀번호 변경"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>계정 관리</CardTitle>
                <CardDescription>
                  계정 정보 및 삭제 옵션
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>계정 생성일</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>사용자 ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {user.id}
                  </p>
                </div>
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">위험 구역</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    계정 삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

