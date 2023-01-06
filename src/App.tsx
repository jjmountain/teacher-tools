import { Routes, Route } from "react-router";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";
import Homepage from "./Homepage";

const App = () => {

  return (
    <Routes>
      <Route path='/stopwatch' element={<Stopwatch/>} />
      <Route path='/timer' element={<Timer/>}/>  
      <Route path='/' element={<Homepage/>} />
    </Routes>
  )

};

export default App;
