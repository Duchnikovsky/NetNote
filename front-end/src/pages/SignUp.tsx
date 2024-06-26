import CSS from "../styles/auth.module.css";
import logo from "../assets/netnote.png";
import { Mail, KeyRound } from "lucide-react";
import { useState } from "react";
import { InputTypes } from "../types/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { SignInRequest } from "../lib/validators/auth";

interface Values {
  [key: string]: string;
}

export default function SignUp() {
  const route = useNavigate();

  const [values, setValues] = useState<Values>({
    email: "",
    password: "",
    rep_password: "",
  });

  const input: InputTypes[] = [
    {
      name: "email",
      type: "email",
      pattern: "[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+",
      maxlenght: 100,
      icon: (
        <Mail
          stroke="#fff5cc"
          strokeWidth={1.5}
          size={22}
          style={{ paddingTop: "0.25rem" }}
        />
      ),
    },
    {
      name: "password",
      type: "password",
      pattern: "^[A-Za-z0-9]{6,18}$",
      maxlenght: 18,
      icon: (
        <KeyRound
          stroke="#fff5cc"
          strokeWidth={1.5}
          size={22}
          style={{ paddingTop: "0.25rem" }}
        />
      ),
    },
    {
      name: "rep_password",
      type: "password",
      pattern: "^[A-Za-z0-9]{6,18}$",
      maxlenght: 18,
      icon: (
        <KeyRound
          stroke="#fff5cc"
          strokeWidth={1.5}
          size={22}
          style={{ paddingTop: "0.25rem" }}
        />
      ),
    },
  ];

  const {
    mutate: signUp,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const payload: SignInRequest = {
        email: values["email"],
        password: values["password"],
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/signUp`,
        payload,
        { withCredentials: true }
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data);
      }
      return toast.error("An error occured");
    },
    onSuccess: () => {
      toast.success("You have successfully signed up");

      return setTimeout(() => {
        route("/signIn");
      }, 2000);
    },
  });

  function checkPassword() {
    if (values["password"] !== values["rep_password"]) {
      return toast.error("Passwords aren't the same", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    signUp();
  }

  return (
    <div className={CSS.main}>
      <div className={CSS.logoArea}>
        <img src={logo} alt="logo" className={CSS.logo} />
      </div>
      <div className={CSS.formArea}>
        <div className={CSS.welcomeText}>
          <span className={CSS.wTBig}>Create new account</span>
          <span className={CSS.wTSmall}>Sign up to NetNote</span>
        </div>
        <form
          className={CSS.form}
          onSubmit={(e) => {
            e.preventDefault();
            checkPassword();
          }}
        >
          {input.map((input) => (
            <Input
              key={input.name}
              type={input.type}
              pattern={input.pattern}
              maxLength={input.maxlenght}
              isDisabled={false}
              width="75%"
              height="2.5rem"
              fontSize="16px"
              icon={input.icon}
              value={values[input.name]}
              onChange={(e) =>
                setValues({ ...values, [input.name]: e.target.value })
              }
            />
          ))}
          <Button
            isLoading={isLoading}
            isDisabled={isSuccess}
            fontSize="18px"
            width="75%"
            height="2.25rem"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
        <div className={CSS.change}>
          Go back to{" "}
          <Link to={"/signIn"} className={"link"}>
            sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
