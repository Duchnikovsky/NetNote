import { useQuery } from "@tanstack/react-query";
import CSS from "../styles/directory.module.css";
import { useNavigate, useParams } from "react-router";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Note } from "../types/directories";

export default function Directory() {
  const route = useNavigate();
  const { id } = useParams();

  const {
    data: notes,
    isFetched,
    isLoading,
  } = useQuery({
    queryKey: ["directory-query"],
    queryFn: async () => {
      try {
        const query = `${
          import.meta.env.VITE_SERVER_URL
        }/getDirectory?id=${id}`;
        const { data } = await axios.get(query, { withCredentials: true });
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          route("/dashboard");
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
        route("/dashboard");
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

  if (isLoading)
    return (
      <div
        className={CSS.main}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Loader2 className={CSS.loader} />
      </div>
    );
  return (
    <div className={CSS.main}>
      {isFetched && notes.flatMap((note: Note) => (
        <div key={note.id}>

        </div>
      ))}
    </div>
  );
}
