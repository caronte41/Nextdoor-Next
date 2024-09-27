import Button_Custom from "@/nextdoor/components/Button_Custom";
import { Combobox_Custom } from "@/nextdoor/components/Combobox_Custom";
import { Input_Custom } from "@/nextdoor/components/Input_Custom";
import Typography_Custom from "@/nextdoor/components/Typography_Custom";
import MainLayout from "@/nextdoor/layouts/MainLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loginUser } from "@/nextdoor/services/accountServices.js";
import { SetCookie } from "@/nextdoor/helpers/cookieHelper";
import { useRouter } from "next/router";
import { exceptionHandler } from "@/nextdoor/helpers/exceptionHandler";
import Routes from "@/nextdoor/helpers/constants/route";

export default function Home() {
  //context
  const router = useRouter();
  //States
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  // custom events
  const handleLeftEnter = () => {
    setIsLeftHovered(true);
  };

  const handleLeftLeave = () => {
    setIsLeftHovered(false);
  };

  const handleRightEnter = () => {
    setIsRightHovered(true);
  };

  const handleRightLeave = () => {
    setIsRightHovered(false);
  };

  const handleAdminLogin = async () => {
    const userData = {
      Email: "ufuxkeles@gmail.com",
      Password: "string",
    };

    const cookieOptions = {
      secure: false,
      sameSite: "strict",
    };

    await loginUser(userData)
      .then((res) => {
        SetCookie(process.env.NEXT_PUBLIC_AUTH, res.data, cookieOptions);
        router.push(Routes.newsFeed);
      })
      .catch((err) => {
        exceptionHandler(err);
      });
  };

  const items = [
    "Özellik 1: Kendi hesabını oluşturma.",
    "Özellik 2: Hesabın mahallesini kendi belirleyebilme.",
    "Özellik 3: Kullanıcı geri bildirimi",
    "Özellik 4: Sosyal medya entegrasyonu",
  ];

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div
        id="left"
        className={`w-1/2 flex flex-col pr-16 pl-16 items-center transition-all duration-300 ease-in-out ${
          isLeftHovered || !isRightHovered ? "bg-primary-200" : "bg-primary-700"
        }`}
        onMouseEnter={handleLeftEnter}
        onMouseLeave={handleLeftLeave}
      >
        <Image
          src="/Comp_Memphis_Left_Side.png"
          width={400}
          height={400}
          alt="Left Side Image"
        />
        <Typography_Custom weight="bold" variant="h2" className="mb-5 ">
          Gerçek Site Deneyimi
        </Typography_Custom>
        <Typography_Custom
          weight="semiBold"
          variant="h3"
          className="text-center"
        >
          Sitenin gerçek dünyada çalışacak tüm özelliklerini deneyimlemek için
          bu seçeneği seçin.
        </Typography_Custom>
        <ul className="mt-5 mb-5 space-y-3 list-disc list-inside text-white">
          {items.map((item, index) => (
            <li key={index} className="text-base leading-6 font-normal">
              {item}
            </li>
          ))}
        </ul>
        <Button_Custom onClick={() => router.push(Routes.login)}>
          Devam Et
        </Button_Custom>
      </div>

      {/* Right side */}
      <div
        id="right"
        className={`w-1/2 flex flex-col pr-16 pl-16 items-center transition-all duration-300 ease-in-out ${
          isRightHovered && !isLeftHovered ? "bg-primary-200" : "bg-primary-700"
        }`}
        onMouseEnter={handleRightEnter}
        onMouseLeave={handleRightLeave}
      >
        <Image
          src="/Home_Basic_Style.png"
          width={400}
          height={400}
          alt="Left Side Image"
        />
        <Typography_Custom weight="bold" variant="h2" className="mb-5 ">
          Gerçek Site Deneyimi
        </Typography_Custom>
        <Typography_Custom
          weight="semiBold"
          variant="h3"
          className="text-center"
        >
          Sitenin gerçek dünyada çalışacak tüm özelliklerini deneyimlemek için
          bu seçeneği seçin.
        </Typography_Custom>
        <ul className="mt-5 mb-5 space-y-3 list-disc list-inside text-white">
          {items.map((item, index) => (
            <li key={index} className="text-base leading-6 font-normal">
              {item}
            </li>
          ))}
        </ul>
        <Button_Custom onClick={handleAdminLogin}>Devam Et</Button_Custom>
      </div>
    </div>
  );
}
