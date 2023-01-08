import { Routes, Route } from "react-router";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";
import Homepage from "./Homepage";
import Header from "./Header";
import Footer from "./Footer";

const App = () => {

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/stopwatch' element={<Stopwatch/>} />
        <Route path='/timer' element={<Timer/>}/>  
        <Route path='/' element={<Homepage/>} />
      </Routes>
      <Footer/>
    </>
  )

};

export default App;
