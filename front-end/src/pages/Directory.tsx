import { useQuery } from "@tanstack/react-query";
import CSS from "../styles/directory.module.css";
import { useNavigate, useParams } from "react-router";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Directory, Note } from "../types/directories";
import { useEffect, useState } from "react";
import DirectoryModal from "../components/modals/DirectoryModal";
import NotesHeader from "../components/NotesHeader";
import GridNote from "../components/GridNote";
import ListNote from "../components/ListNote";
import NoteCreatorModal from "../components/modals/NoteCreatorModal";

interface ApiResponse {
  notes: Note[];
  directory: Directory;
}

export default function DirectoryComponent() {
  const [mode, setMode] = useState<string>("");
  const [modal, toggleModal] = useState<boolean>(false);
  const [editorModal, toggleEditorModal] = useState<boolean>(false);
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
        }/directory/get?id=${id}`;
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
      setMode("grid");
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
      <div className={CSS.main}>
        <Loader2 className={CSS.loader} />
      </div>
    );

  return (
    <div className={CSS.main}>
      {mode === "grid" && (
        <div className={CSS.grid}>
          <NotesHeader
            mode={"grid"}
            name={directoryName}
            toggleModal={(bool) => toggleModal(bool)}
            setMode={(mode) => setMode(mode)}
          />
          {notes.flatMap((note: Note) => (
            <GridNote note={note} key={note.id} />
          ))}
          <div className={CSS.newNote} onClick={() => toggleEditorModal(true)}>
            <div className={CSS.noteTitle}>New note</div>
            <div className={CSS.noteContent}>Click here to create new note</div>
          </div>
        </div>
      )}
      {mode === "list" && (
        <ul className={CSS.list}>
          <NotesHeader
            mode={"list"}
            name={directoryName}
            toggleModal={(bool) => toggleModal(bool)}
            setMode={(mode) => setMode(mode)}
          />
          <li className={CSS.listHeader}>
            <div className={CSS.listTitleArea}>Title</div>
            <div className={CSS.listContent}>Content</div>
            <div className={CSS.listCreateDate}>Creation time</div>
          </li>
          {notes.flatMap((note: Note) => (
            <ListNote note={note} key={note.id} />
          ))}
          <li className={CSS.listItem} onClick={() => toggleEditorModal(true)}>
            <div className={CSS.listTitleArea}>New note</div>
            <div className={CSS.listContentCut} style={{ color: "#bcbcbc" }}>
              Click here to create new note
            </div>
          </li>
        </ul>
      )}
      {modal && (
        <DirectoryModal
          toggleModal={() => toggleModal(!modal)}
          directory={directory}
        />
      )}
      {editorModal && (
        <NoteCreatorModal
          toggleModal={() => toggleEditorModal(!editorModal)}
          directoryId={directory.id}
        />
      )}
    </div>
  );
}
