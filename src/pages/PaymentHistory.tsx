import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Receipt, RefreshCw } from "lucide-react";

interface Payment {
  id: string;
  created_at: string;
  product_name: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  payment_method: string;
}

const PaymentHistory = () => {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndFetchPayments = async () => {
      // 현재 사용자 확인
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
      
      // 결제내역 가져오기
      await fetchPayments(user.id);
    };

    checkUserAndFetchPayments();
  }, [navigate, toast]);

  const fetchPayments = async (userId: string) => {
    try {
      setLoading(true);
      
      // Supabase에서 orders 테이블을 조회합니다 (주문 정보가 여기에 저장됨)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // 테이블이 없는 경우
        console.error('주문 내역 테이블 조회 오류:', error);
        // 실제 데이터만 표시
        setPayments([]);
        toast({
          title: "테이블 오류",
          description: "주문 내역 테이블을 찾을 수 없습니다. create-order-table.sql 파일을 확인하세요.",
          variant: "destructive",
        });
      } else {
        // orders 테이블 데이터를 Payment 형식으로 변환
        const formattedData = (data || []).map(item => ({
          id: item.id,
          created_at: item.created_at,
          product_name: item.product_name,
          amount: item.amount,
          status: item.status,
          payment_method: '신용카드', // order 테이블에 payment_method가 없으면 기본값
          order_id: item.order_id || item.order_number,
        }));
        
        setPayments(formattedData);
        if (formattedData.length === 0) {
          console.log('결제 내역이 없습니다.');
        } else {
          console.log(`${formattedData.length}개의 결제 내역을 불러왔습니다.`);
        }
      }
    } catch (error: any) {
      console.error('결제내역 조회 오류:', error);
      // 오류 발생 시 빈 배열로 설정
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getDummyPayments = (): Payment[] => {
    return [
      {
        id: '1',
        created_at: new Date('2024-01-15').toISOString(),
        product_name: '빈티지 우드 테이블',
        amount: 450000,
        status: 'completed',
        payment_method: '신용카드',
      },
      {
        id: '2',
        created_at: new Date('2024-01-10').toISOString(),
        product_name: '북유럽 스타일 의자 세트',
        amount: 280000,
        status: 'completed',
        payment_method: '무통장입금',
      },
      {
        id: '3',
        created_at: new Date('2024-01-05').toISOString(),
        product_name: '원목 책장',
        amount: 320000,
        status: 'completed',
        payment_method: '카카오페이',
      },
      {
        id: '4',
        created_at: new Date('2024-01-03').toISOString(),
        product_name: '앤틱 서랍장',
        amount: 580000,
        status: 'pending',
        payment_method: '신용카드',
      },
      {
        id: '5',
        created_at: new Date('2023-12-28').toISOString(),
        product_name: '우드 선반',
        amount: 150000,
        status: 'cancelled',
        payment_method: '신용카드',
      },
    ];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">완료</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">처리중</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalAmount = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Button>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">결제내역</h1>
            </div>
            <p className="text-muted-foreground">
              구매하신 상품의 결제 내역을 확인하세요
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => user && fetchPayments(user.id)}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>전체 주문</CardDescription>
              <CardTitle className="text-3xl">{payments.length}건</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>완료된 주문</CardDescription>
              <CardTitle className="text-3xl">
                {payments.filter(p => p.status === 'completed').length}건
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>총 결제금액</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(getTotalAmount())}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 결제내역 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>결제 내역</CardTitle>
            <CardDescription>
              최근 결제 내역이 최상단에 표시됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-muted-foreground">로딩 중...</div>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">결제 내역이 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  첫 구매를 시작해보세요!
                </p>
                <Button onClick={() => navigate("/")}>
                  쇼핑하러 가기
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>결제일시</TableHead>
                      <TableHead>결제수단</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          #{(payment as any).order_id ? (payment as any).order_id.slice(0, 8) : payment.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.product_name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(payment.created_at)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {payment.payment_method}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(payment.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 안내 메시지 */}
        {payments.length === 0 && !loading ? (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>참고:</strong> 결제 완료 후 결제 내역이 여기에 표시됩니다. 
              만약 결제 내역이 보이지 않는다면, Supabase에 'orders' 테이블이 생성되어 있는지 확인하세요. 
              자세한 내용은 <code>create-order-table.sql</code> 파일을 참고하세요.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentHistory;

