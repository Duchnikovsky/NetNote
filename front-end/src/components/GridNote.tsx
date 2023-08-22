import { MoreHorizontal } from "lucide-react";
import CSS from "../styles/directory.module.css";
import { Note } from "../types/directories";

interface GridNoteProps {
  note: Note;
}

export default function GridNote({ note }: GridNoteProps) {
  return (
    <div className={CSS.note} key={note.id}>
      <div className={CSS.noteTitle}>
        {note.title}
        <MoreHorizontal className={CSS.more} />
      </div>
      <div className={CSS.noteContent}>{note.content}</div>
    </div>
  );
}
