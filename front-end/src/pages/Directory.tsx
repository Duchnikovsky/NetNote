import { useQuery } from "@tanstack/react-query";
import CSS from "../styles/directory.module.css";
import { useNavigate, useParams } from "react-router";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AlignJustify, LayoutPanelTop, Loader2, Settings } from "lucide-react";
import { Directory, Note } from "../types/directories";
import { useEffect, useState } from "react";
import DirectoryModal from "../components/modals/DirectoryModal";

interface ApiResponse {
  notes: Note[];
  directory: Directory;
}

export default function DirectoryComponent() {
  const [mode, setMode] = useState<string>("");
  const [modal, toggleModal] = useState<boolean>(false);
  const route = useNavigate();
  const { id } = useParams();

  const {
    data: queryResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["directory-query"],
    queryFn: async () => {
      try {
        const query = `${
          import.meta.env.VITE_SERVER_URL
        }/getDirectory?id=${id}`;
        const { data } = await axios.get<ApiResponse>(query, {
          withCredentials: true,
        });

        const { notes, directory } = data;

        return { notes, directory };
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

  useEffect(() => {
    refetch();
    const mode = localStorage.getItem("notesmode");
    if (mode) {
      setMode(mode);
    } else {
      localStorage.setItem("notesmode", "grid");
    }
  }, [id]);

  let notes: Note[] = [];
  let directory: Directory = {
    id: "",
    name: "",
    createdAt: new Date(),
    userId: "",
  };
  let directoryName = "";

  if (
    typeof queryResults === "object" &&
    queryResults !== null &&
    "notes" in queryResults &&
    "directory" in queryResults
  ) {
    notes = queryResults.notes.flatMap((note: Note) => note) || [];
    directory = queryResults.directory;
    directoryName = queryResults.directory.name;
  }

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
      <div className={CSS.grid}>
        <div className={CSS.header}>
          <div className={CSS.name}>
            {directoryName}
            <Settings
              className={CSS.settings}
              onClick={() => toggleModal(true)}
            />
          </div>
          <div className={CSS.modes}>
            <AlignJustify
              className={mode === "list" ? CSS.modeActive : CSS.mode}
              onClick={() => {
                setMode("list");
                localStorage.setItem("notesmode", "list");
              }}
            />
            <LayoutPanelTop
              className={mode === "grid" ? CSS.modeActive : CSS.mode}
              onClick={() => {
                setMode("grid");
                localStorage.setItem("notesmode", "grid");
              }}
            />
          </div>
        </div>
        <div className={CSS.gridElement}>aaa</div>
        <div className={CSS.gridElement}>bbb</div>
        <div className={CSS.gridElement}>ccc</div>
        <div className={CSS.gridElement}>ddd</div>
        <div className={CSS.gridElement}>eee</div>
        <div className={CSS.gridElement}>aaa</div>
        <div className={CSS.gridElement}>bbb</div>
        <div className={CSS.gridElement}>ccc</div>
        <div className={CSS.gridElement}>ddd</div>
        <div className={CSS.gridElement}>eee</div>
        <div className={CSS.gridElement}>aaa</div>
        <div className={CSS.gridElement}>bbb</div>
        <div className={CSS.gridElement}>ccc</div>
        <div className={CSS.gridElement}>ddd</div>
        <div className={CSS.gridElement}>eee</div>
        <div className={CSS.gridElement}>bbb</div>
        <div className={CSS.gridElement}>ccc</div>
        <div className={CSS.gridElement}>ddd</div>
        <div className={CSS.gridElement}>eee</div>
        {notes.flatMap((note: Note) => (
          <div key={note.id}></div>
        ))}
      </div>
      {modal && (
        <DirectoryModal
          toggleModal={() => toggleModal(!modal)}
          directory={directory}
        />
      )}
    </div>
  );
}
