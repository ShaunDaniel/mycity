import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";

import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Navbar from "./components/Nav";
import Register from "./components/Register";
import Homepage from "./pages/Homepage";
import theme from "./theme";
import Footer from "./components/Footer";
function App() {
  return (
    <ChakraProvider theme={theme}>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
        <Footer/>
    </ChakraProvider>
  );
}


export default App;
