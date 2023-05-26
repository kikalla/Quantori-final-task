import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignUp from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import InitialPage from "./pages/InitialPage/InitialPage";
import HomePage from "./pages/Homepage/HomePage";
import Initial from "./components/InitialComponent/InitialComponent";
import TableComponent from "./components/TableComponent/TableComponent";
import ProteinComponent from "./components/ProteinComponent/ProteinComponent";
import ProteinDetails from "./components/ProteinComponent/ProteinDetails";
import ProteinFeature from "./components/ProteinComponent/ProteinFeature";
import ProteinPublications from "./components/ProteinComponent/ProteinPublications";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <InitialPage />,
    children: [
      { index: true, element: <Initial /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
  {
    path: "/home",
    element: <HomePage />,
    children: [
      { index: true, element: <TableComponent /> },
      {
        path: ":id",
        element: <ProteinComponent />,
        children: [
          { path: "details", element: <ProteinDetails /> },
          { path: "feature", element: <ProteinFeature /> },
          { path: "publications", element: <ProteinPublications /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
