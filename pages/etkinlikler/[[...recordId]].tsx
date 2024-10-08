//React
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
//Third Party
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deviceDetect } from "react-device-detect";
import moment from "moment/moment";
import { toast } from "sonner";
//Context
import { AuthContext } from "@/nextdoor/context/AuthContext";
//Services
import {
  createEvent,
  getAllEventsByProfileId,
} from "@/nextdoor/services/eventServices.js";
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
import {
  BusinessStatusDropdown,
  TimeEnum,
  TimeEnumFifteen,
} from "@/nextdoor/helpers/enums";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Calendar03Icon } from "@/nextdoor/icons/CalendarIcon";
import { ThumbsUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkoutRunIcon } from "@/nextdoor/icons/WorkoutRunIcon";
import { TickDouble03Icon } from "@/nextdoor/icons/ThickDoubleCheckIcon";
import { ThumbsUpIcon2 } from "@/nextdoor/icons/ThumbsUpIcons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft01Icon } from "@/nextdoor/icons/ArrowLeftIcon";
import { DatePicker_Custom } from "@/nextdoor/components/DatePicker_Custom";
import Autocomplete_Custom from "@/nextdoor/components/Autocomplete";

export default function EventsPage({ eventsData, user }) {
  //context
  const router = useRouter();

  //states
  const [isOwnerOfPage] = useState(
    user.accountId === _firstOrDefault(router.query.recordId)
  );
  const [predictions, setPredictions] = useState([]);
  const [lngLatValue, setLngLatValue] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    // resolver: yupResolver(CreateAccountValidation()),
  });

  //custom events
  const onSubmit = async (data) => {
    const formatDateForBackend = async (date) => {
      // Format date and time
      const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

      // Get timezone offset in hours and minutes (e.g., +0300)
      const offset = -date.getTimezoneOffset();
      const sign = offset >= 0 ? "+" : "-";
      const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
      const minutes = String(Math.abs(offset) % 60).padStart(2, "0");

      // Return final formatted string
      return `${formattedDate}.${String(date.getMilliseconds()).padStart(
        3,
        "0"
      )} ${sign}${hours}${minutes}`;
    };
    data = {
      ...data,
      eventEndDay: null,
      eventEndHour: null,
      eventDay: data.eventDay,
      eventHour: `${data.eventHour}:00`,
      profileId: user.profiles.find((obj) => obj.profileType === "0").id,
      coverPhoto: await convertToBase64(data.coverPhoto),
      latitude: lngLatValue.lat,
      longitude: lngLatValue.lng,
    };
    debugger;
    await createEvent(data)
      .then((res) => {
        toast.success("Etkinlik başarıyla yaratılmıştır.");
      })
      .catch((err) => exceptionHandler(err));
  };

  const fetchPredictions = (inputValue) => {
    if (!inputValue || !isLoaded) {
      setPredictions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input: inputValue,
        componentRestrictions: { country: "tr" }, // Restrict search to Turkey
        types: ["address"], // Optionally restrict to address types
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyBkBErYTxs3Rhosq2Z9C3kD2oPMxQV5oa4`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results[0]) {
      const location = data.results[0].geometry.location;
      console.log(
        `Latitude: ${location.lat}, Longitude: ${location.lng}, Address:${address}`
      );
      setLngLatValue({ lat: location.lat, lng: location.lng });
    }
  };

  //react events

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsApi = (callback) => {
      if (window.google && window.google.maps) {
        callback();
      } else {
        const script = document.createElement("script");
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.maps) {
            callback();
          }
        };
        document.head.appendChild(script);
      }
    };

    loadGoogleMapsApi(() => setIsLoaded(true));
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-8 items-start h-screen">
      <div>
        <Typography_Custom weight="bold" variant="h2">
          Yakınınızdaki Etkinlikler
        </Typography_Custom>
      </div>
      <div className="flex gap-4">
        <Dialog>
          <Form {...form}>
            <DialogTrigger asChild>
              <Button_Custom>Etkinlik Yarat</Button_Custom>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] sm:max-h-[70%] px-8 overflow-y-scroll">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <DialogHeader>
                  <div className="flex items-center justify-between mt-4">
                    <Button_Custom
                      size="icon"
                      variant={"ghost"}
                      icon={<ArrowLeft01Icon />}
                    ></Button_Custom>
                    <Typography_Custom weight="bold" variant="h4">
                      Etkinlik Yarat
                    </Typography_Custom>
                    <Button_Custom type="submit">İleri</Button_Custom>
                  </div>
                </DialogHeader>
                <div className="">
                  <FormField
                    name="coverPhoto"
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
                <FormField
                  name="eventName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input_Custom
                          {...field}
                          id="eventName"
                          label="Etkinlik İsmi"
                          className="w-full"
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="organizatorName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input_Custom
                          {...field}
                          id="organizatorName"
                          label="Etkinliği Düzenleyen"
                          className="w-full"
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-12   items-center">
                  <Typography_Custom weight="semiBold">
                    Başlangıç
                  </Typography_Custom>
                  <FormField
                    name="eventDay"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DatePicker_Custom
                            {...field}
                            label="Tarih"
                            className="w-full"
                            placeholder=""
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"eventHour"}
                    render={({ field }) => (
                      <Combobox_Custom
                        {...field}
                        label="Opening Hour"
                        onSelect={field.onChange}
                        placeholder="Select opening hour"
                        items={TimeEnumFifteen}
                      />
                    )}
                  />
                </div>
                <div className="flex gap-12  items-center">
                  <Typography_Custom className="mr-12" weight="semiBold">
                    Bitiş
                  </Typography_Custom>
                  <FormField
                    name="eventEndDay"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DatePicker_Custom
                            {...field}
                            label="Tarih"
                            className="w-full"
                            placeholder=""
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"eventEndHour"}
                    render={({ field }) => (
                      <Combobox_Custom
                        {...field}
                        label="Opening Hour"
                        onSelect={field.onChange}
                        placeholder="Select opening hour"
                        items={TimeEnumFifteen}
                      />
                    )}
                  />
                </div>
                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Autocomplete_Custom
                          placeholder="Search for an address"
                          label="Lokasyon"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            debugger;
                            geocodeAddress(e);
                          }}
                          onInputChange={fetchPredictions}
                          predictions={predictions.map(
                            (option: unknown) => option.description
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input_Custom
                          {...field}
                          id="description"
                          label="Etkinlik Detayları"
                          className="w-full"
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </DialogContent>
          </Form>
        </Dialog>

        <Button_Custom>Benim Etkinliklerim</Button_Custom>
        <Button_Custom>Top</Button_Custom>
      </div>
      <div>
        {eventsData.map((event, index) => (
          <Card
            key={index}
            className="px-2 p-4 flex flex-col gap-2 w-80 h-auto"
          >
            <div className="relative w-full h-64 mb-10">
              <Image
                src="/Cityscape.png"
                layout="responsive"
                width={240}
                height={240}
                objectFit="cover"
                alt="Event Image"
              />
            </div>

            <Typography_Custom variant="h5" weight="semiBold">
              {event.eventName}
            </Typography_Custom>
            <div className="flex gap-4 ">
              <div className="flex">
                <Calendar03Icon />
                <Typography_Custom>
                  {moment(event.eventDay).format("DD/MM/YYYY")}
                </Typography_Custom>
              </div>
              <div className="flex">
                <Clock01Icon />
                <Typography_Custom>{event.eventHour}</Typography_Custom>
              </div>
            </div>
            <Typography_Custom>{event.address}</Typography_Custom>
            <div className="flex gap-4 mb-2 justify-between">
              <Badge variant="secondary">
                <ThumbsUpIcon2 />
                <Typography_Custom>
                  {event.interestedCount} İlgilenen
                </Typography_Custom>
              </Badge>
              <Badge variant="success">
                <TickDouble03Icon />
                <Typography_Custom>{event.goingCount} Giden</Typography_Custom>
              </Badge>
            </div>
            <Button_Custom>İlgileniyorum</Button_Custom>
          </Card>
        ))}
      </div>
    </div>
  );
}

EventsPage.Layout = MainLayout;

export async function getServerSideProps(context) {
  let eventsData = [];

  let cookie = await GetCookie(process.env.NEXT_PUBLIC_AUTH, context);
  cookie = JSON.parse(cookie);

  await getAllEventsByProfileId(
    cookie.profiles.find((obj) => obj.profileType === "0").id,
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
