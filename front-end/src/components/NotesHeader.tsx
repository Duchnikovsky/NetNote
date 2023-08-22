import { AlignJustify, LayoutPanelTop, Settings } from "lucide-react";
import CSS from "../styles/directory.module.css";

interface NotesHeaderProps {
  mode: string;
  name: string;
  toggleModal: (bool: boolean) => void;
  setMode: (bool: string) => void;
}

export default function NotesHeader({
  mode,
  name,
  toggleModal,
  setMode,
}: NotesHeaderProps) {
  if (mode === "list")
    return (
      <li className={CSS.header}>
        <div className={CSS.name}>
          {name}
          <Settings
            className={CSS.settings}
            onClick={() => toggleModal(true)}
          />
        </div>
        <div className={CSS.modes}>
          <AlignJustify
            className={CSS.modeActive}
            onClick={() => {
              setMode("list");
              localStorage.setItem("notesmode", "list");
            }}
          />
          <LayoutPanelTop
            className={CSS.mode}
            onClick={() => {
              setMode("grid");
              localStorage.setItem("notesmode", "grid");
            }}
          />
        </div>
      </li>
    );

  return (
    <div className={CSS.header}>
      <div className={CSS.name}>
        {name}
        <Settings className={CSS.settings} onClick={() => toggleModal(true)} />
      </div>
      <div className={CSS.modes}>
        <AlignJustify
          className={CSS.mode}
          onClick={() => {
            setMode("list");
            localStorage.setItem("notesmode", "list");
          }}
        />
        <LayoutPanelTop
          className={CSS.modeActive}
          onClick={() => {
            setMode("grid");
            localStorage.setItem("notesmode", "grid");
          }}
        />
      </div>
    </div>
  );
}
