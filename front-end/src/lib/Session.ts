import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getSession() {
  const { data } = useQuery({});
  console.log("ok");
  return data;
}
