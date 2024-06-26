import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export default function Root() {
  const route = useNavigate();
  const location = useLocation();

  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const query = `${import.meta.env.VITE_SERVER_URL}/auth/getSession`;
        const { data } = await axios.get(query, { withCredentials: true });
        if (location.pathname === "/") {
          route("/dashboard");
        }
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
    <div key={data}>
      <Outlet />
    </div>
  );
}
