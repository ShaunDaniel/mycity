import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Routes, Route} from 'react-router-dom';
import Login from "./components/Login";
import Navbar from "./components/Nav";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import theme from "./theme";
import Footer from "./components/Footer";
import FinishRegister from "./pages/FinishRegister";
import userService from "./services/userService.js";
import UserContext from './components/UserContext';
import City from "./components/City.jsx";
import NotFound from "./pages/NotFound";
import CityFeed from "./pages/CityFeed.jsx";

function App() {

  const [user, setUser] = useState();


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ChakraProvider theme={theme}>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register/1" element={<Register/>} />
          <Route path="/register/2" element={<FinishRegister/>} />
          <Route path="/feed/:city" element={<CityFeed user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default App;