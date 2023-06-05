import {
  Route,
  Routes,
} from "react-router-dom";
import Login from "./page/login";
import { AuthContextProvider } from "./api/AuthContext";
import Success from "./page/success";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/",
  //     element: <Success />,
  //   }
  // ]);
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Success />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </AuthContextProvider>
    </>
  );

  //   return (
  //     <RouterProvider router={router} />
  // );
}

export default App;
