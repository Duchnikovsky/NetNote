import CSS from "../styles/sidebar.module.css";
import logo from "../assets/netnote.png";
import { List } from "lucide-react";
import Directories from "./Directories";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useState } from "react";
import CreatorModal from "./modals/CreatorModal";

export default function Sidebar() {
  const route = useNavigate();
  const [menu, setOpen] = useState<boolean>(true);
  const [modal, toggleModal] = useState<boolean>(false)

  const { mutate: singOut, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/signOut`,
        {},
        { withCredentials: true }
      );
      route("/signIn");
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
    <div className={menu ? CSS.main : CSS.miniMain}>
      <div className={CSS.navbar}>
        <div className={CSS.logoArea}>
          <img src={logo} alt="logo" className={CSS.logo} />
        </div>
        <List
          size={40}
          className={CSS.listIcon}
          onClick={() => setOpen(!menu)}
        />
      </div>
      {menu && <Directories />}
      {menu && (
        <Button
          width="90%"
          height="2.5rem"
          fontSize="20px"
          isDisabled={false}
          isLoading={false}
          margin={"0 auto"}
          onClick={() => toggleModal(true)}
        >
          New directory
        </Button>
      )}
      {menu && (
        <div className={CSS.buttonArea}>
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
      )}
      {modal && <CreatorModal toggleModal={() => toggleModal(!modal)}/>}
    </div>
  );
}
