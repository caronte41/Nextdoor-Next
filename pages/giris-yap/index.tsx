//React
import * as React from "react";
import { useRouter } from "next/router";
//Context

//Third Party
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//Services
import { loginUser } from "@/nextdoor/services/accountServices.js";
//Helpers
import { exceptionHandler } from "@/nextdoor/helpers/exceptionHandler";
import { SetCookie } from "@/nextdoor/helpers/cookieHelper";
import Routes from "@/nextdoor/helpers/constants/route";
//Validation
import LoginValidation from "../../nextdoor/validations/LoginValidation";
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

export default function Login() {
  //context
  const router = useRouter();
  //states

  //react-hook-form definitions
  const form = useForm({
    mode: "onTouched",
    resolver: yupResolver(LoginValidation()),
  });

  //custom events
  const handleAdminLogin = async (data: unknown) => {
    const cookieOptions = {
      secure: false,
      sameSite: "strict",
    };

    await loginUser(data)
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

  return (
    <div className="flex mt-40 justify-center h-screen">
      <Card className="w-[20%] h-[50%] flex flex-col items-center justify-center">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-4x">Hoşgeldiniz</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAdminLogin)}
            className="w-full"
          >
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
                          errorMessage={form.formState.errors.Password?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CardFooter className="flex flex-col items-center justify-between w-full">
              <Button_Custom type="submit" className="w-full mb-4">
                Giriş Yap
              </Button_Custom>

              <div className="flex items-center w-full space-x-2">
                <Separator orientation="horizontal" className="w-1/3" />
                <a
                  href="/create-account"
                  className="text-sm text-secondary-700 w-80 hover:underline"
                >
                  Hesap oluştur
                </a>
                <Separator orientation="horizontal" className="w-1/4" />
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

Login.Layout = MainLayoutWithoutSideBar;
