import MODAL from "../../styles/modal.module.css";
import CSS from "../../styles/directoryEdit.module.css";
import { Input } from "../ui/Input";
import { FolderEdit } from "lucide-react";
import { useState } from "react";
import { Directory } from "../../types/directories";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface DirectoryModalProps {
  toggleModal: () => void;
  directory: Directory;
}

interface payload {
  id: string;
  name: string;
}

export default function DirectoryModal({
  toggleModal,
  directory,
}: DirectoryModalProps) {
  const route = useNavigate();
  const [name, setName] = useState<string>(directory.name);
  const [confirm, toggleConfirm] = useState<boolean>(false);

  const { mutate: edit, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: payload = {
        id: directory.id,
        name: name,
      };

      const query = `${import.meta.env.VITE_SERVER_URL}/editDirectory`;

      const { data } = await axios.put(query, payload, {
        withCredentials: true,
      });

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
      toggleModal();
      return toast.success("Directory successfully edited", {
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

  const { mutate: remove, isLoading: isRemoveLoading } = useMutation({
    mutationFn: async () => {
      const id = directory.id;

      const query = `${
        import.meta.env.VITE_SERVER_URL
      }/removeDirectory?id=${id}`;

      const { data } = await axios.delete(query, { withCredentials: true });

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
      route('/dashboard');
      route(0)
      toggleModal();
      return toast.info("Directory successfully removed", {
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
        <div className={CSS.upperText}>Directory settings</div>
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
          onClick={() => edit()}
        >
          Save changes
        </Button>
        {confirm ? (
          <Button
            isLoading={isRemoveLoading}
            isDisabled={false}
            fontSize="18px"
            width="70%"
            height="2.5rem"
            type="submit"
            onClick={() => remove()}
          >
            Confirm removing
          </Button>
        ) : (
          <Button
            isLoading={false}
            isDisabled={false}
            fontSize="18px"
            width="70%"
            height="2.5rem"
            type="button"
            onClick={() => toggleConfirm(true)}
          >
            Remove directory
          </Button>
        )}
        <Button
          isLoading={false}
          isDisabled={false}
          fontSize="18px"
          width="70%"
          height="2.5rem"
          type="button"
          onClick={() => toggleModal()}
        >
          Close settings
        </Button>
      </div>
    </div>
  );
}
