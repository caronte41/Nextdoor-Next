//React
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
//Third Party
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deviceDetect } from "react-device-detect";
import { toast } from "sonner";
//Context
import { AuthContext } from "@/nextdoor/context/AuthContext";
//Services
import { getAllEventsByProfileId } from "@/nextdoor/services/eventServices.js";
import {
  getAllBusinessCategories,
  getAllGenders,
} from "@/nextdoor/services/masterdataServices.js";
//Helpers
import Routes from "@/nextdoor/helpers/constants/route";
import {
  _firstOrDefault,
  _isNullorUndefined,
} from "@/nextdoor/helpers/objectHelper.js";
import {
  calculateDistance,
  convertToBase64,
  getCurrentDay,
} from "@/nextdoor/helpers/commonHelpers";
import { BusinessStatusDropdown, TimeEnum } from "@/nextdoor/helpers/enums";
//Components
import { CancelCircleIcon } from "@/nextdoor/icons/CancelCircleIcon";
import { CheckmarkBadge01Icon } from "@/nextdoor/icons/CheckMarkBadgeIcon";
import MainLayout from "@/nextdoor/layouts/MainLayout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Button_Custom from "@/nextdoor/components/Button_Custom";
import Image from "next/image";
import Typography_Custom from "@/nextdoor/components/Typography_Custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input_Custom } from "@/nextdoor/components/Input_Custom";
import { Combobox_Custom } from "@/nextdoor/components/Combobox_Custom";
import { FileInput_Custom } from "@/nextdoor/components/FileInput_Custom";
import { exceptionHandler } from "@/nextdoor/helpers/exceptionHandler";
import { Clock01Icon } from "@/nextdoor/icons/ClockIcon";
import { MapsIcon } from "@/nextdoor/icons/MApIcon";
import { Location04Icon } from "@/nextdoor/icons/LocationIcon";
import { Mail01Icon } from "@/nextdoor/icons/MailIcon";
import { Link04Icon } from "@/nextdoor/icons/LinkIcon";
import { TelephoneIcon } from "@/nextdoor/icons/TelephoneIcon";
import MultiSelect_Custom from "@/nextdoor/components/MultiSelect_Custom";
import { GetCookie } from "@/nextdoor/helpers/cookieHelper";
import Link from "next/link";

export default function ProfilePage({ eventsData, user }) {
  //context
  const router = useRouter();

  //states
  const [isOwnerOfPage] = useState(
    user.AccountId === _firstOrDefault(router.query.recordId)
  );

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    // resolver: yupResolver(CreateAccountValidation()),
  });

  //custom events
  const onSubmit = async (data) => {};

  //react events

  return (
    <div className="flex flex-col gap-4 mt-8 justify-center items-center h-screen ">
      <div className="flex justify-end gap-4 w-[100%] h-[100%]">
        <div className="flex-grow gap-4 flex flex-col items-start w-[75%]">
          <Card className="w-full min-h-[50%] flex flex-col items-start relative"></Card>
          <Card className="w-full h-[50%] flex  flex-col px-4 justify-center">
            <div>
              <Typography_Custom weight="semiBold" variant="h4">
                Etkinlikler
              </Typography_Custom>
            </div>
          </Card>
          <Card className="w-full h-[50%] flex flex-col px-4 justify-center">
            <div>
              <Typography_Custom weight="semiBold" variant="h4">
                Gönderiler
              </Typography_Custom>
            </div>
          </Card>
        </div>
        <Card className="w-[23.7%] min-h-[40%] max-h-[50%] flex flex-col px-4 justify-start py-4 overflow-auto"></Card>
      </div>
    </div>
  );
}

ProfilePage.Layout = MainLayout;

export async function getServerSideProps(context) {
  let eventsData = [];

  let cookie = await GetCookie(process.env.NEXT_PUBLIC_AUTH, context);
  cookie = JSON.parse(cookie);
  console.log(cookie.Profile.find((obj) => obj.ProfileType === "0").Id);

  await getAllEventsByProfileId(
    cookie.Profile.find((obj) => obj.ProfileType === "0").Id,
    context
  ).then((res) => {
    console.log(res?.data);
    eventsData = res?.data;
  });

  return {
    props: {
      user: cookie,
      eventsData: eventsData,
    },
  };
}
