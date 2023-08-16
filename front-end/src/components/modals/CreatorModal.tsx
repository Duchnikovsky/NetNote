import MODAL from "../../styles/modal.module.css";
import CSS from "../../styles/creator.module.css";
import { Input } from "../ui/Input";
import { FolderEdit } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface CreatorModalProps {
  toggleModal: () => void;
}

export default function CreatorModal({ toggleModal }: CreatorModalProps) {
  const route = useNavigate();
  const [name, setName] = useState<string>();

  const { mutate: create, isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/createDirectory`,
        payload,
        { withCredentials: true }
      );
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
      route(0);
      toggleModal()
      return toast.success("Directory successfully created", {
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
  });
  
  return (
    <div className={MODAL.background}>
      <div className={CSS.main}>
        <div className={CSS.upperText}>Create new directory</div>
        <Input
        type={"text"}
        maxLength={16}
        isDisabled={false}
        width="70%"
        height="2.75rem"
        fontSize="16px"
        placeholder="Name of directory"
        spellCheck={false}
        icon={
          <FolderEdit
            stroke="#fff5cc"
            strokeWidth={1.5}
            size={22}
            style={{ paddingTop: "0.25rem" }}
          />
        }
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        isLoading={isLoading}
        isDisabled={false}
        fontSize="18px"
        width="70%"
        height="2.5rem"
        type="submit"
        onClick={() => create()}
      >
        Create directory
      </Button>
      <Button
        isLoading={false}
        isDisabled={false}
        fontSize="18px"
        width="70%"
        height="2.5rem"
        type="submit"
        onClick={() => toggleModal()}
      >
        Close creator
      </Button>
      </div>
    </div>
  );
}
