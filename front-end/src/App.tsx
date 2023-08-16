import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Providers from "./components/Providers";
import { ToastContainer } from "react-toastify";

import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Directory from "./pages/Directory";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path=":id" element={<Directory />} />
        </Route>
      </Route>
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
    </>
  )
);


function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <ToastContainer />
    </Providers>
  );
}

export default App;
