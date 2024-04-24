import MODAL from "../../styles/modal.module.css";
import CSS from "../../styles/editor.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";
import { PencilLine } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface NoteCreatorModal {
  toggleModal: (bool: boolean) => void;
  directoryId: string;
}

export default function NoteCreatorModal({
  toggleModal,
  directoryId,
}: NoteCreatorModal) {
  const route = useNavigate();
  const [title, setTitle] = useState<string>();
  const [value, setValue] = useState<string>();

  const { mutate: create, isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title,
        content: value,
        directoryId: directoryId,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/note/create`,
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
      setTimeout(() => {
        route(0);
      }, 1000);
      toggleModal(false);
      return toast.success("Note successfully created", {
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
        <Input
          type={"text"}
          maxLength={16}
          isDisabled={false}
          width="300px"
          height="2.75rem"
          fontSize="16px"
          placeholder="Title of note"
          spellCheck={false}
          icon={
            <PencilLine
              stroke="#fff5cc"
              strokeWidth={1.5}
              size={22}
              style={{ paddingTop: "0.25rem" }}
            />
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          maxLength={1000}
          isDisabled={false}
          width="100%"
          height="30rem"
          fontSize="14px"
          placeholder="Note text"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          isLoading={isLoading}
          isDisabled={false}
          fontSize="18px"
          width="100%"
          height="2.5rem"
          type="submit"
          onClick={() => create()}
        >
          Create note
        </Button>
        <Button
          isLoading={false}
          isDisabled={false}
          fontSize="18px"
          width="100%"
          height="2.5rem"
          type="button"
          onClick={() => toggleModal(false)}
        >
          Close creator
        </Button>
      </div>
    </div>
  );
}
