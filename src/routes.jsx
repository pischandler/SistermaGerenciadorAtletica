import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Eventos from "./pages/Eventos/Eventos";
import Jogos from "./pages/Jogos/Jogos";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}>
          {" "}
        </Route>
        <Route path="/home" element={<Home />}>
          {" "}
        </Route>
        <Route path="/eventos" element={<Eventos />}>
          {" "}
        </Route>
        <Route path="/jogos" element={<Jogos />}>
        {" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
