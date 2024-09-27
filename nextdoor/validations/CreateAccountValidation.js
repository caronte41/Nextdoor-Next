import * as Yup from "yup";

const CreateAccountValidation = () =>
  Yup.object({
    Password: Yup.string().required("Lütfen şifrenizi giriniz."),
    Email: Yup.string()
      .email("Geçersiz e-mail adresi.")
      .required("Lütfen mail adresinizi giriniz.")
      .typeError("Geçersiz e-mail adresi."),
    FirstName: Yup.string().required("Lütfen adınızı giriniz."),
    LastName: Yup.string().required("Lütfen soyadınızı giriniz."),
    Address: Yup.string().required("Lütfen adres giriniz."),
  });
export default CreateAccountValidation;
