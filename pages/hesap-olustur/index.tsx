//React
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
//Context

//Third Party
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//Services
import { CreateAccount } from "@/nextdoor/services/accountServices.js";
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

export default function CreateAccountPage() {
  //context
  const router = useRouter();
  //states
  const [step, setStep] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [lngLatValue, setLngLatValue] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const labelsForSteps = [
    { subTitle: "Hesabının bilgilerini gir." },
    { subTitle: "Kimlik bilgilerini gir." },
    { subTitle: "Şu anda bulunduğun adresini gir." },
  ];

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    resolver: yupResolver(CreateAccountValidation()),
  });

  //custom events
  const handleAdminLogin = async (data: unknown) => {
    const cookieOptions = {
      secure: false,
      sameSite: "strict",
    };

    await CreateAccount(data)
      .then((res) => {
        SetCookie(
          process.env.NEXT_PUBLIC_AUTH,
          JSON.stringify(res.data),
          cookieOptions
        );
        router.push(Routes.newsFeed);
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
      <Card className="w-[20%] h-[50%] flex flex-col items-center justify-center">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-4x">
            Etrafındaki Mahalleleri Keşfet
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
                    name="Email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">E-Mail</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="email"
                            className="w-full"
                            placeholder="Your email"
                            type="email"
                            //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                            errorMessage={form.formState.errors.Email?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    name="Password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Şifre</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="password"
                            className="w-full"
                            placeholder="Your password"
                            type="password"
                            //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                            errorMessage={
                              form.formState.errors.Password?.message
                            }
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
                    name="FirstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="firstName">İsim</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="firstName"
                            className="w-full"
                            placeholder="Adınız"
                            type="text"
                            //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                            errorMessage={
                              form.formState.errors.FirstName?.message
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    name="LastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="lastName">Soyisim</Label>
                        <FormControl>
                          <Input_Custom
                            {...field}
                            id="lastName"
                            className="w-full"
                            placeholder="İsminiz"
                            type="text"
                            //isInvalid={!_isEmpty(errors.emailAddress?.message)}
                            errorMessage={
                              form.formState.errors.LastName?.message
                            }
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
                            value={field.value} // Controlled value from react-hook-form
                            onChange={field.onChange} // Pass the onChange handler to update form state
                            onInputChange={fetchPredictions} // Custom handler to fetch predictions
                            predictions={predictions.map(
                              (option) => option.description
                            )} // Array of address predictions
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            <CardFooter className="flex flex-col items-center justify-between w-full">
              <Button_Custom
                type={step === 3 ? "submit" : "button"}
                onClick={() => setStep(step + 1)}
                className="w-full mb-4"
              >
                Devam Et
              </Button_Custom>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

CreateAccountPage.Layout = MainLayoutWithoutSideBar;
