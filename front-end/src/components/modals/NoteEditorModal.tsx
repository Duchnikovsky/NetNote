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
import { Note } from "../../types/directories";

interface EditorModalProps {
  toggleModal: (bool: boolean) => void;
  note: Note;
}
export default function NoteEditorModal({
  toggleModal,
  note,
}: EditorModalProps) {
  const route = useNavigate();
  const [title, setTitle] = useState<string>(note.title);
  const [value, setValue] = useState<string>(note.content);

  const { mutate: edit, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title,
        content: value,
        note: note.id,
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/note/edit`,
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
      setTimeout(() => {
        route(0);
      }, 2000);
      toggleModal(false);
      return toast.success("Note changes were saved");
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
          onClick={() => edit()}
        >
          Save changes
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
