import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";

import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import theme from "./theme";
function App() {
  return (
    <ChakraProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
    </ChakraProvider>
  );
}


export default App;
