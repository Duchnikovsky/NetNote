import { MoreHorizontal } from "lucide-react";
import CSS from "../../styles/directory.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import "../../styles/dropdown.css";

interface DeleteDropdownProps {
  noteId: string;
}

export default function DeleteDropdown({ noteId }: DeleteDropdownProps) {
  const route = useNavigate();

  const { mutate: remove } = useMutation({
    mutationFn: async () => {
      const query = `${
        import.meta.env.VITE_SERVER_URL
      }/note/remove?id=${noteId}`;

      const { data } = await axios.delete(query, { withCredentials: true });

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
      return toast.info("Note has been removed");
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="trigger">
        <MoreHorizontal className={CSS.more} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="DropdownMenuContent" align="end">
        <DropdownMenu.Item className="DropdownMenuItem" asChild>
          <div onClick={() => remove()}>Delete note</div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
