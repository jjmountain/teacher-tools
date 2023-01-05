import { Routes, Route } from "react-router";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";

const App = () => {

  return (
    <Routes>
      <Route path='/stopwatch' element={<Stopwatch/>} />
      <Route path='/timer' element={<Timer/>}/>  
    </Routes>
  )

};

export default App;
