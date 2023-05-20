import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignUp from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import InitialPage from "./pages/InitialPage/InitialPage";
import HomePage from "./pages/Homepage/HomePage";
import Initial from "./components/InitialComponent/InitialComponent";

const router = createBrowserRouter([
  {
    path: "/",
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
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
