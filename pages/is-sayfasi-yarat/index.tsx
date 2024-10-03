//React
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
//Context
import { AuthContext } from "@/nextdoor/context/AuthContext";
//Third Party
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//Services
import { upsertBusinessProfile } from "@/nextdoor/services/profileServices";
//Helpers
import { exceptionHandler } from "@/nextdoor/helpers/exceptionHandler";
import { SetCookie } from "@/nextdoor/helpers/cookieHelper";
import Routes from "@/nextdoor/helpers/constants/route";
//Validation
import CreateAccountValidation from "../../nextdoor/validations/CreateAccountValidation";
//Components
import MainLayoutWithoutSideBar from "@/nextdoor/layouts/MainLayoutWithoutSideBar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input_Custom } from "@/nextdoor/components/Input_Custom";
import { Label } from "@/components/ui/label";
import Button_Custom from "@/nextdoor/components/Button_Custom";
import Autocomplete_Custom from "@/nextdoor/components/Autocomplete";
import { getAllBusinessCategories } from "@/nextdoor/services/masterdataServices";
import MultiSelect_Custom from "@/nextdoor/components/MultiSelect_Custom";

export default function CreateBusinessPage({ businessCategoriesData }) {
  //context
  const router = useRouter();
  const profileInfo = React.useContext(AuthContext);
  //states
  const [step, setStep] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [lngLatValue, setLngLatValue] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const labelsForSteps = [
    { subTitle: "İş Hesabınızın Adını Girin." },
    { subTitle: "Kimlik bilgilerini gir." },
    { subTitle: "Şu anda bulunduğun adresini gir." },
  ];

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
  });

  //custom events
  const handleAdminLogin = async (data: unknown) => {
    debugger;
    let submitData = {
      ...data,
      CategoryId: data.CategoryId.map((obj) => {
        return businessCategoriesData.find((obj2) => obj2.label === obj).value;
      }),
      AccountId: JSON.parse(profileInfo.user).AccountId,
      Latitude: lngLatValue.lat,
      Longitude: lngLatValue.lng,
    };

    await upsertBusinessProfile(submitData)
      .then((res) => {
        router.push(`${Routes.businessProfile}/${res?.data?.id}`);
      })
      .catch((err) => {
        exceptionHandler(err);
      });
  };

  const fetchPredictions = (inputValue) => {
    if (!inputValue || !isLoaded) {
      setPredictions([]);
      return;
    }
    debugger;
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
          debugger;
          setPredictions(results);
        } else {
          debugger;
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

  //react event
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
    <div className="flex mt-40 justify-center h-screen">
      <Card className="w-[25%] h-[50%] flex flex-col items-center justify-center">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">
            Merhaba {JSON.parse(profileInfo.user)?.FirstName}
          </CardTitle>
          <CardDescription>{labelsForSteps[step].subTitle}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAdminLogin)}
            className="w-full"
          >
            {step === 0 && (
              <div className="grid w-full p-6 items-center gap-4">
                <div className="flex w-full flex-col space-y-1.5">
                  <FormField
                    name="BusinessName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">İş Hesabı Adı</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="email"
                            className="w-full"
                            placeholder="İş adı"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid w-full p-6 items-center gap-4">
                <div className="flex w-full flex-col space-y-1.5">
                  <FormField
                    name="Email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="Email">Şirket E-Mail</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="email"
                            className="w-full"
                            placeholder="Mail adresiniz"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    name="Phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="Phone">Şirket Telefonu</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="phone"
                            className="w-full"
                            placeholder="Telefonunuz"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid w-full p-6 items-center gap-4">
                <div className="flex w-full flex-col space-y-1.5">
                  <FormField
                    name="Address"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Autocomplete_Custom
                            placeholder="Search for an address"
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
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    name="CategoryId"
                    control={form.control}
                    render={({ field }) => {
                      console.log("Field value:", field.value); // Add this line to see the value
                      return (
                        <FormItem>
                          <Label htmlFor="CategoryId">Şirket Telefonu</Label>
                          <FormControl>
                            <MultiSelect_Custom
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
            )}
            <CardFooter className="flex flex-col items-center justify-between w-full">
              <Button_Custom
                type={step === 2 ? "submit" : "button"}
                onClick={() => {
                  if (step < 2) setStep(step + 1);
                }}
                className="w-full mb-4"
              >
                {step === 2 ? "Kaydet" : "Devam Et"}
              </Button_Custom>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

CreateBusinessPage.Layout = MainLayoutWithoutSideBar;

export async function getServerSideProps(context) {
  let businessCategoriesData = [];

  await getAllBusinessCategories(context).then(
    (res) =>
      (businessCategoriesData = res.data.map((obj) => {
        return { label: obj.CategoryName, value: obj.Id };
      }))
  );

  return {
    props: {
      businessCategoriesData: businessCategoriesData,
    },
  };
}
