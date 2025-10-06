import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function MomoResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "fail" | null>(null);

  useEffect(() => {
    const resultCode = params.get("resultCode");
    if (resultCode === "0") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [params]);

  if (status === null)
    return <p className="text-center mt-10">Đang kiểm tra kết quả...</p>;

  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      {status === "success" ? (
        <>
          <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
          <p className="text-foreground/70 mb-6">
            Cảm ơn bạn đã thanh toán qua MoMo. Đơn hàng của bạn đã được ghi
            nhận.
          </p>
          <Button onClick={() => navigate("/order-success")}>
            Xem đơn hàng
          </Button>
        </>
      ) : (
        <>
          <XCircle className="h-20 w-20 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Thanh toán thất bại!</h1>
          <p className="text-foreground/70 mb-6">
            Giao dịch chưa được thực hiện thành công. Vui lòng thử lại.
          </p>
          <Button onClick={() => navigate("/checkout")}>
            Quay lại thanh toán
          </Button>
        </>
      )}
    </div>
  );
}
