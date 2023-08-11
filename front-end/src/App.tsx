import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Providers from "./components/Providers";

import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/signIn" element={<SignIn />} />
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
