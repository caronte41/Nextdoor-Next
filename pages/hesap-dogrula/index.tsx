import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Button_Custom from "@/nextdoor/components/Button_Custom";
import Routes from "@/nextdoor/helpers/constants/route";
import { CancelCircleIcon } from "@/nextdoor/icons/CancelCircleIcon";
import { CheckmarkBadge01Icon } from "@/nextdoor/icons/CheckMarkBadgeIcon";
import MainLayoutWithoutSideBar from "@/nextdoor/layouts/MainLayoutWithoutSideBar";
import { verifyAccount } from "@/nextdoor/services/accountServices.js";
import { useRouter } from "next/router";

export default function VerifyAccount({ isVerified }) {
  //context
  const router = useRouter();
  return (
    <div className="flex mt-40 justify-center h-screen">
      <Card className="w-[20%] h-[50%] flex flex-col items-center justify-center">
        <div
          className={`w-20 h-20 inline-flex justify-center rounded-full items-center ${
            isVerified
              ? "bg-success-50 text-success-500"
              : "bg-danger-50 text-danger-500"
          }`}
        >
          {isVerified ? (
            <CheckmarkBadge01Icon
              className="text-success-700"
              width={48}
              height={48}
            />
          ) : (
            <CancelCircleIcon
              className="text-danger-700"
              width={48}
              height={48}
            />
          )}
        </div>

        <CardHeader className="text-center">
          <CardTitle className="font-bold text-4x">
            {isVerified
              ? "Hesabınız Başarıyla Doğrulanmıştır"
              : "Hesabınızı Doğrularken Bir Sorun Oluştu"}
          </CardTitle>
          <Button_Custom
            onClick={() =>
              router.push(`${isVerified ? Routes.login : Routes.createAccount}`)
            }
          >
            {isVerified ? "Giriş Yap" : "Hesap Oluştur"}
          </Button_Custom>
        </CardHeader>
      </Card>
    </div>
  );
}

VerifyAccount.Layout = MainLayoutWithoutSideBar;

export async function getServerSideProps(context) {
  let isVerified = false;

  await verifyAccount(context.query.token, context).then((res) => {
    isVerified = res?.result;
  });

  return {
    props: { isVerified: isVerified },
  };
}
