import CSS from "../styles/root.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export default function Root() {
  const route = useNavigate();

  const {} = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const query = `${import.meta.env.VITE_SERVER_URL}/getSession`;
        const { data } = await axios.get(query, { withCredentials: true });
        route("/dashboard");
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          route("/signIn");
          return;
        }
        route("/signIn");
        return;
      }
    },
  });

  return (
    <div className={CSS.main}>
      <Outlet />
    </div>
  );
}
