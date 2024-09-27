import * as Yup from "yup";

const LoginValidation = () =>
  Yup.object({
    Password: Yup.string().required("Lütfen şifrenizi giriniz."),
    Email: Yup.string()
      .email("Geçersiz e-mail adresi.")
      .required("Lütfen mail adresinizi giriniz.")
      .typeError("Geçersiz e-mail adresi."),
  });
export default LoginValidation;
