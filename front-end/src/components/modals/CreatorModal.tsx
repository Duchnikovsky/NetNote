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

  const { mutate: create, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/directory/create`,
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
      route(0);
      toggleModal();
      return toast.success("Directory successfully created");
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
          type="button"
          onClick={() => toggleModal()}
        >
          Close creator
        </Button>
      </div>
    </div>
  );
}
