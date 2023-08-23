import CSS from "../styles/directory.module.css";
import { Note } from "../types/directories";
import { useState } from "react";
import NoteEditorModal from "./modals/NoteEditorModal";
import DeleteDropdown from "./ui/DeleteDropdown";

interface ListNoteProps {
  note: Note;
}

export default function ListNote({ note }: ListNoteProps) {
  const [modal, toggleModal] = useState<boolean>();

  const date = new Date(note.createdAt);
  const formattedDate =
    date.toISOString().slice(0, 10) + " " + date.toISOString().slice(11, 16);

  return (
    <div>
      <li className={CSS.listArea} key={note.id}>
        <div className={CSS.listItem} onClick={() => toggleModal(true)}>
          <div className={CSS.listTitleArea}>
            <div className={CSS.listTitle}>{note.title}</div>
          </div>
          <div className={CSS.listContentCut}>{note.content}</div>
          <div className={CSS.listCreateDate}>{formattedDate}</div>
        </div>
        <div className={CSS.listMore}>
          <DeleteDropdown noteId={note.id} />
        </div>
      </li>
      {modal && (
        <NoteEditorModal
          toggleModal={(bool) => toggleModal(bool)}
          note={note}
        />
      )}
    </div>
  );
}
