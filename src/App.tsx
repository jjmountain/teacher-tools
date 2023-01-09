import { Routes, Route } from "react-router";
import Stopwatch from "./app/Stopwatch";
import Timer from "./app/Timer";
import Homepage from "./app/Homepage";
import Header from "./app/Header";
import Footer from "./app/components/Footer";
import NamePicker from "./app/NamePicker";

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
