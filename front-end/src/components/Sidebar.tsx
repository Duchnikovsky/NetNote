import CSS from "../styles/sidebar.module.css";
import logo from "../assets/netnote.png";
import { List } from "lucide-react";
import Directories from "./Directories";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function Sidebar() {

  const route = useNavigate();

  const { mutate: singOut, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/signOut`,
        {},
        { withCredentials: true }
      );
      route('/signIn')
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data, {
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
      return toast.error("An error occured", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onSuccess: () => {
      toast.info("You have signed out", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return setTimeout(() => {
        route("/");
      }, 2000);
    },
  });



  return (
    <div className={CSS.main}>
      <div className={CSS.logoArea}>
        <img src={logo} alt="logo" className={CSS.logo} />
      </div>
      <List size={40} className={CSS.listIcon} />
      <Directories />
      <Button
        width="90%"
        height="2.5rem"
        fontSize="20px"
        isDisabled={false}
        isLoading={isLoading}
        margin={"0 auto"}
        onClick={() => singOut()}
      >
        Sign out
      </Button>
    </div>
  );
}
