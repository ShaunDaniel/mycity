import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";

import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Navbar from "./components/Nav";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import theme from "./theme";
import Footer from "./components/Footer";
import FinishRegister from "./pages/FinishRegister";
function App() {
  return (
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
  );
}


export default App;
