import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Navbar from "./components/Nav";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import theme from "./theme";
import Footer from "./components/Footer";
import FinishRegister from "./pages/FinishRegister";
import UserContext from './components/UserContext';
import NotFound from "./pages/NotFound";
import CityFeed from "./pages/CityFeed.jsx";
import Post from "./pages/Post.jsx";
import Profile from "./pages/Profile.jsx";

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
          <Route path="/feed/:city" element={<CityFeed />} />
          <Route path="/post/:id" element={<Post />} /> 
          <Route path="/profile/:id" element={<Profile />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default App;