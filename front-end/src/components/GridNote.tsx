import CSS from "../styles/directory.module.css";
import { Note } from "../types/directories";
import NoteEditorModal from "./modals/NoteEditorModal";
import { useState } from "react";
import DeleteDropdown from "./ui/DeleteDropdown";

interface GridNoteProps {
  note: Note;
}

export default function GridNote({ note }: GridNoteProps) {
  const [modal, toggleModal] = useState<boolean>();

  return (
    <div>
      <div className={CSS.note} key={note.id} onClick={() => toggleModal(true)}>
        <div className={CSS.noteHeader}>
          <div className={CSS.noteTitle}>{note.title}</div>
        </div>
        <div className={CSS.noteContent}>{note.content}</div>
      </div>
      <div className={CSS.noteMore}>
        <DeleteDropdown noteId={note.id} />
      </div>
      {modal && (
        <NoteEditorModal
          toggleModal={(bool) => toggleModal(bool)}
          note={note}
        />
      )}
    </div>
  );
}
