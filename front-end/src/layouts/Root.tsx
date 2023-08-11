import CSS from "../styles/root.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Session } from "../types/auth";
export default function Root() {
  const route = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const query = `${import.meta.env.VITE_SERVER_URL}/getSession`;
      const { data } = await axios.get(query, { withCredentials: true });
      return data as Session
    },
  });

  useEffect(() => {
    if(session){
      if(session.authenticated){
        route('/dashboard')
      }else{
        route('/signIn')
      }
    }
  }, [session]);

  return (
    <div className={CSS.main}>
      <Outlet />
    </div>
  );
}
