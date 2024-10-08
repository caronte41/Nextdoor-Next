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
import {
  getBusinessProfileByAccountId,
  getIndividualProfileByAccountId,
  updateIndividualProfile,
  upsertBusinessProfile,
} from "@/nextdoor/services/profileServices.js";
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

export default function ProfilePage({
  profileData,
  businessCategoriesData,
  user,
}) {
  //context
  const router = useRouter();
  const daysOfWeek = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];
  //states
  const [isOwnerOfPage] = useState(
    user.accountId === _firstOrDefault(router.query.recordId)
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sortedHours, setSortedHours] = useState([]);
  const [distance, setDistance] = useState(null);
  const currentDay = getCurrentDay();

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    // resolver: yupResolver(CreateAccountValidation()),
  });

  //custom events
  const onSubmit = async (data) => {
    data = {
      ...data,
      CategoryId: data.CategoryId.map((categoryLabel) => {
        const matchingCategory = businessCategoriesData.find(
          (obj) => obj.label === categoryLabel
        );
        return matchingCategory ? matchingCategory.value : null;
      }),
      BusinessHours: JSON.stringify(
        data.BusinessHours.reduce((acc, curr, index) => {
          acc[daysOfWeek[index]] = curr;
          return acc;
        }, {})
      ),
      AccountId: _firstOrDefault(router.query.recordId),
      CoverPhoto: await convertToBase64(data.CoverPhoto),
      LogoPhoto: await convertToBase64(data.LogoPhoto),
    };
    debugger;
    await upsertBusinessProfile(data)
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

  //react events
  useEffect(() => {
    const businessHours = JSON.parse(profileData.businessHours); // Parse once
    const daysOfWeek = Object.keys(businessHours); // Get all the days from the businessHours object
    const currentDayIndex = daysOfWeek.indexOf(currentDay); // Find the current day's index

    // Reorder days starting from the current day
    const reorderedDays = [
      ...daysOfWeek.slice(currentDayIndex),
      ...daysOfWeek.slice(0, currentDayIndex),
    ];

    // Map to a new array with the day and the hours object (opening and closing)
    const sortedHours = reorderedDays.map((day) => ({
      day,
      hours: businessHours[day],
    }));

    setSortedHours(sortedHours);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;

          // Calculate distance to the corporate location
          const distanceFromCorporate = calculateDistance(
            userLatitude,
            userLongitude,
            profileData.latitude,
            profileData.longitude
          );

          // Set the distance in the state
          setDistance(distanceFromCorporate);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-8 justify-center items-center h-screen ">
      <div className="flex justify-end gap-4 w-[100%] h-[100%]">
        <div className="flex-grow gap-4 flex flex-col items-start w-[75%]">
          <Card className="w-full min-h-[50%] flex flex-col items-start relative">
            <div className="relative w-full h-1/2">
              <Image
                src={`${
                  _isNullorUndefined(profileData.coverPhoto)
                    ? "/Cityscape.png"
                    : `https://localhost:7071${profileData.coverPhoto}`
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
                      _isNullorUndefined(profileData.logoPhoto)
                        ? "/Certificate.png"
                        : `https://localhost:7071${profileData.logoPhoto}`
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
                    {profileData.businessName}
                  </Typography_Custom>

                  <Typography_Custom variant="h6">
                    {profileData.categoryNames.join(", ")}
                  </Typography_Custom>
                  <Typography_Custom variant="h6">
                    {profileData.about}
                  </Typography_Custom>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {!isOwnerOfPage && (
                      <Button_Custom className="">
                        Favorilere Ekle
                      </Button_Custom>
                    )}
                    <Button_Custom
                      icon={
                        <TelephoneIcon width={18} height={18} color="#fff" />
                      }
                      variant="secondary"
                      className="bg-secondary-100 rounded-lg"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      {isHovered ? profileData.phone : "Ara"}
                    </Button_Custom>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mr-4">
                {isOwnerOfPage && (
                  <Button_Custom className="bg-primary-100">
                    Profil Değiştir
                  </Button_Custom>
                )}
                <Sheet>
                  <SheetTrigger asChild>
                    {isOwnerOfPage && (
                      <Button_Custom className="bg-primary-100">
                        Düzenle
                      </Button_Custom>
                    )}
                  </SheetTrigger>
                  <SheetContent
                    style={{ maxWidth: "40vw" }}
                    className="h-full  overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                      >
                        <div className="grid gap-4 py-4">
                          <div className="flex gap-4">
                            <div className="flex w-full flex-col space-y-1.5">
                              <FormField
                                name="About"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input_Custom
                                        {...field}
                                        id="bio"
                                        label="Hakkında"
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
                                name="Email"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input_Custom
                                        {...field}
                                        id="bio"
                                        label="E-Mail"
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
                          </div>
                          <div className="flex gap-4">
                            <div className="flex w-full flex-col space-y-1.5">
                              <FormField
                                name="Website"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input_Custom
                                        {...field}
                                        id="bio"
                                        label="Web Sitesi"
                                        className="w-full"
                                        placeholder="Web Sitesi"
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
                                name="Phone"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input_Custom
                                        {...field}
                                        id="bio"
                                        label="Telefon"
                                        className="w-full"
                                        placeholder="Telefon"
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
                          </div>
                          <div className="flex gap-4">
                            <div className="flex w-full flex-col space-y-1.5">
                              <FormField
                                name="BusinessStatus"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Combobox_Custom
                                        {...field}
                                        //className="w-full"
                                        label="İş Durumu"
                                        onSelect={field.onChange}
                                        placeholder="İş Durumu"
                                        items={BusinessStatusDropdown}
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
                                name="CategoryId"
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormControl>
                                        <MultiSelect_Custom
                                          label="Kategoriler"
                                          options={businessCategoriesData}
                                          //value={field.value}
                                          onChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                          </div>
                          {daysOfWeek.map((day, index) => (
                            <div
                              key={day}
                              className="flex gap-4 items-center mb-4"
                            >
                              <div className="w-32">
                                <Typography_Custom>{day}</Typography_Custom>
                              </div>

                              <div>
                                <FormField
                                  control={form.control}
                                  name={`BusinessHours.${index}.openingHour`}
                                  render={({ field }) => (
                                    <Combobox_Custom
                                      {...field}
                                      label="Opening Hour"
                                      onSelect={field.onChange}
                                      placeholder="Select opening hour"
                                      items={TimeEnum}
                                    />
                                  )}
                                />
                              </div>

                              <div>
                                <FormField
                                  control={form.control}
                                  name={`BusinessHours.${index}.closingHour`}
                                  render={({ field }) => (
                                    <Combobox_Custom
                                      {...field}
                                      label="Closing Hour"
                                      onSelect={field.onChange}
                                      placeholder="Select closing hour"
                                      items={TimeEnum}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          ))}

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
                              name="LogoPhoto"
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
        <Card className="w-[23.7%] min-h-[40%] max-h-[50%] flex flex-col px-4 justify-start py-4 overflow-auto">
          <div className="flex flex-wrap flex-col gap-4">
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Clock01Icon />
              {!isExpanded && (
                <Typography_Custom variant="small">
                  {`${currentDay}: ${
                    JSON.parse(profileData.businessHours)[currentDay]
                      ?.openingHour
                  } - ${
                    JSON.parse(profileData.businessHours)[currentDay]
                      ?.closingHour
                  }`}
                </Typography_Custom>
              )}
              {isExpanded && (
                <div className="mt-2">
                  {sortedHours.map(({ day, hours }) => (
                    <div key={day} className="flex pr-4 justify-between">
                      <Typography_Custom variant="small">
                        {day}
                      </Typography_Custom>
                      <Typography_Custom variant="small">
                        {hours.openingHour} - {hours.closingHour}
                      </Typography_Custom>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2">
              <MapsIcon width={50} height={50} />
              <Typography_Custom variant="small" className="break-words">
                {profileData.address}
              </Typography_Custom>
            </div>

            <div className="flex items-center gap-2">
              <Location04Icon />
              <Typography_Custom variant="small" className="break-words">
                {distance} KM Ötede
              </Typography_Custom>
            </div>

            <div className="flex items-center gap-2">
              <Mail01Icon />
              <Link href={`mailto:${profileData.email}`}>
                <Typography_Custom
                  variant="small"
                  weight="semiBold"
                  className="break-all underline"
                >
                  {profileData.email}
                </Typography_Custom>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link04Icon />
              <Link
                href={
                  profileData.website.startsWith("http")
                    ? profileData.website
                    : `https://${profileData.website}`
                }
                passHref
              >
                <Typography_Custom
                  variant="small"
                  weight="semiBold"
                  className="truncate underline"
                  as="a" // Render as anchor tag
                  target="_blank" // Opens in new window
                  rel="noopener noreferrer" // Security best practice
                >
                  {profileData.website}
                </Typography_Custom>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

ProfilePage.Layout = MainLayout;

export async function getServerSideProps(context) {
  let profileData = {};

  let businessCategoriesData = [];

  let cookie = await GetCookie(process.env.NEXT_PUBLIC_AUTH, context);
  cookie = JSON.parse(cookie);

  await getAllBusinessCategories(context).then((res) => {
    console.log(res.data);
    return (businessCategoriesData = res.data.map((obj) => {
      return { label: obj.categoryName, value: obj.id };
    }));
  });

  console.log("hebelehübele:", businessCategoriesData);

  await getBusinessProfileByAccountId(
    _firstOrDefault(context.query.recordId),
    context
  ).then((res) => {
    console.log(res?.data);
    profileData = res?.data;
  });

  return {
    props: {
      user: cookie,
      profileData: profileData,
      businessCategoriesData: businessCategoriesData,
    },
  };
}
