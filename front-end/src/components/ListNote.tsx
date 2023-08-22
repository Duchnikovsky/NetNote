import { MoreHorizontal } from "lucide-react";
import CSS from "../styles/directory.module.css";
import { Note } from "../types/directories";

interface ListNoteProps {
  note: Note;
}

export default function ListNote({ note }: ListNoteProps) {
  const date = new Date(note.createdAt);
  const formattedDate =
    date.toISOString().slice(0, 10) + " " + date.toISOString().slice(11, 16);
  return (
    <li className={CSS.listItem} key={note.id}>
      <div className={CSS.listTitle}>{note.title}</div>
      <div className={CSS.listContentCut}>{note.content}</div>
      <div className={CSS.listCreateDate}>{formattedDate}</div>
      <div className={CSS.listMore}>
        <MoreHorizontal className={CSS.more} />
      </div>
    </li>
  );
}
