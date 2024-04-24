import { useQuery } from "@tanstack/react-query";
import CSS from "../styles/directories.module.css";
import axios, { AxiosError } from "axios";
import { Directory } from "../types/directories";
import { toast } from "react-toastify";
import { Folder, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Directories() {
  const [selected, setSelected] = useState<string>();

  const route = useNavigate();

  const { data: queryResults, isLoading } = useQuery({
    queryKey: ["get-directories"],
    queryFn: async () => {
      try {
        const query = `${import.meta.env.VITE_SERVER_URL}/directory/getAll`;
        const { data } = await axios.get(query, { withCredentials: true });
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data, {
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
        return toast.error("Could not fetch directories", {
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
    },
  });

  const directories =
    queryResults?.flatMap((directory: Directory) => directory) || [];

  if (isLoading)
    return (
      <div className={CSS.loadingArea}>
        <Loader2 className={CSS.loader} />
      </div>
    );

  return (
    <div className={CSS.main}>
      <div className={CSS.directories}>
        {directories.flatMap((directory: Directory) => (
          <div
            key={directory.id}
            className={
              selected === directory.id ? CSS.directorySelected : CSS.directory
            }
            onClick={() => {
              setSelected(directory.id);
              route(`/dashboard/${directory.id}`);
            }}
          >
            <div className={CSS.folderArea}>
              <Folder
                stroke="#fff5bd"
                strokeWidth={1.5}
                size={26}
                className={CSS.folder}
              />
            </div>
            <div className={CSS.directoryName}>{directory.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
