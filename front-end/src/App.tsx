import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Providers from "./components/Providers";

import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

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
    </Providers>
  );
}

export default App;
