//React
import { useRouter } from "next/router";
//Third Party
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
//Services
import {
  getIndividualProfileByAccountId,
  updateIndividualProfile,
} from "@/nextdoor/services/profileServices.js";
import { getAllGenders } from "@/nextdoor/services/masterdataServices.js";
//Helpers
import Routes from "@/nextdoor/helpers/constants/route";
import {
  _firstOrDefault,
  _isNullorUndefined,
} from "@/nextdoor/helpers/objectHelper.js";
import { convertToBase64 } from "@/nextdoor/helpers/commonHelpers";
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

export default function ProfilePage({ profileData, gendersData }) {
  //context
  const router = useRouter();
  //states

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    // resolver: yupResolver(CreateAccountValidation()),
  });

  //custom events
  const onSubmit = async (data) => {
    data = {
      ...data,
      AccountId: _firstOrDefault(router.query.recordId),
      CoverPhoto: await convertToBase64(data.CoverPhoto),
      ProfilePhoto: await convertToBase64(data.ProfilePhoto),
    };
    debugger;
    await updateIndividualProfile(data)
      .then(async (res) => {
        await getIndividualProfileByAccountId(
          _firstOrDefault(router.query.recordId)
        ).then((res) => {
          profileData = res?.data;
        });
        toast.success("Profil Baraşıyla Güncellenmiştir.");
      })
      .catch((err) => exceptionHandler(err));
  };

  return (
    <div className="flex flex-col gap-4 mt-8 justify-center items-center h-screen ">
      <Card className="w-[50%] h-[100%] flex flex-col items-start relative">
        <div className="relative w-full h-1/2">
          <Image
            src={`${
              _isNullorUndefined(profileData.CoverPhoto)
                ? "/Cityscape.png"
                : `https://localhost:7071${profileData.CoverPhoto}`
            }`}
            layout="fill"
            objectFit="cover"
            alt="Left Side Image"
          />
        </div>

        <div className="flex justify-between mt-8 items-center absolute top-[50%] w-full transform -translate-y-1/2">
          <div className="ml-4">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={`${
                  _isNullorUndefined(profileData.ProfilePhoto)
                    ? "/BasicAvatar.png"
                    : `https://localhost:7071${profileData.ProfilePhoto}`
                }`}
                layout="intrinsic"
                width={128}
                height={128}
                objectFit="cover"
                alt="Profile Picture"
              />
            </div>

            <div className="mt-4 ">
              <Typography_Custom weight="bold" variant="h3">
                {profileData.Profile.ProfileName}
              </Typography_Custom>
              <Typography_Custom weight="light" variant="h6">
                {profileData.Bio}
              </Typography_Custom>
              <Typography_Custom variant="h6">
                {profileData.Address}
              </Typography_Custom>
            </div>
          </div>

          <div className="flex space-x-4 mr-4">
            <Button_Custom className="bg-primary-100">
              Profil Değiştir
            </Button_Custom>
            <Sheet>
              <SheetTrigger asChild>
                <Button_Custom
                  onClick={() => form.reset(profileData)}
                  className="bg-primary-100"
                >
                  Düzenle
                </Button_Custom>
              </SheetTrigger>
              <SheetContent className="h-full overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                  >
                    <div className="grid gap-4 py-4">
                      <div className="flex w-full flex-col space-y-1.5">
                        <FormField
                          name="Bio"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="bio">Biyografi</Label>
                              <FormControl>
                                <Input_Custom
                                  {...field}
                                  id="bio"
                                  className="w-full"
                                  placeholder="Bio"
                                  type="text"
                                  //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                                  //   errorMessage={
                                  //     form.formState.errors.Email?.message
                                  //   }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex w-full flex-col space-y-1.5">
                        <FormField
                          name="GenderId"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Combobox_Custom
                                  {...field}
                                  //className="w-full"
                                  label="Cinsiyet"
                                  onSelect={field.onChange}
                                  placeholder="Cinsiyet"
                                  items={gendersData}
                                  //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                                  //   errorMessage={
                                  //     form.formState.errors.Email?.message
                                  //   }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex w-full flex-col space-y-1.5">
                        <FormField
                          name="CoverPhoto"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileInput_Custom
                                  label="Arka Plan Resmi"
                                  onChange={(file) => field.onChange(file)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex w-full flex-col space-y-1.5">
                        <FormField
                          name="ProfilePhoto"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileInput_Custom
                                  label="Profil Resmi"
                                  onChange={(file) => field.onChange(file)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Kaydet</Button>
                      </SheetClose>
                    </SheetFooter>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>

      <Card className="w-[50%] h-[50%] flex  flex-col px-4 justify-center">
        <div>
          <Typography_Custom weight="semiBold" variant="h4">
            Etkinlikler
          </Typography_Custom>
        </div>
      </Card>
      <Card className="w-[50%] h-[50%] flex flex-col px-4 justify-center">
        <div>
          <Typography_Custom weight="semiBold" variant="h4">
            Gönderiler
          </Typography_Custom>
        </div>
      </Card>
    </div>
  );
}

ProfilePage.Layout = MainLayout;

export async function getServerSideProps(context) {
  let profileData = {};
  let gendersData = [];

  await getAllGenders(context).then(
    (res) =>
      (gendersData = res.data.map((obj) => {
        return { label: obj.GenderName, value: obj.Id };
      }))
  );

  await getIndividualProfileByAccountId(
    _firstOrDefault(context.query.recordId),
    context
  ).then((res) => {
    console.log(res?.data);
    profileData = res?.data;
  });

  return {
    props: { profileData: profileData, gendersData: gendersData },
  };
}
