import { Routes, Route } from "react-router";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";
import Homepage from "./Homepage";
import Header from "./Header";
import Footer from "./Footer";
import NamePicker from "./NamePicker";

const App = () => {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/name-picker" element={<NamePicker />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
