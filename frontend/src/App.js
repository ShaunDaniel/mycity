import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Navbar from "./components/Nav";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import theme from "./theme";
import Footer from "./components/Footer";
import FinishRegister from "./pages/FinishRegister";
import userService from "./services/userService.js";
import UserContext from './components/UserContext';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      console.log("Inside user_details",jwtToken);
        userService.user_details(jwtToken)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
        });
   
  } else {
    setUser(null);
  } }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ChakraProvider theme={theme}>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register/1" element={<Register/>} />
          <Route path="/register/2" element={<FinishRegister/>} />
        </Routes>
        <Footer/>
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default App;