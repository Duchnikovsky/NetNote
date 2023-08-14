import CSS from '../styles/directory.module.css'
import { useParams } from "react-router";


export default function Directory() {
  const { id } = useParams();

  return <div className={CSS.main}>{id}</div>;
}
