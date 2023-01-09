import { DisplayState } from "../../types";

const Display = ({ seconds, minutes, hours }: DisplayState) => {
  return (
    <div className="stopwatch-display  w-full flex justify-center h-24 mt-8">
      <div className="h-full px-8 md:px-20 bg-spring-wood-100 text-gray-900 text-4xl sm:text-6xl md:text-7xl lg:text-8xl grid grid-cols-8 gap-4 overflow-hidden">
        <div className="flex items-center justify-center mr-2 ">{hours[0]}</div>
        <div className="flex items-center justify-center ">{hours[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-900">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {minutes[0]}
        </div>
        <div className="flex items-center justify-center ">{minutes[1]}</div>

        <div className="flex items-center justify-center mb-1 text-gray-900">
          :
        </div>
        <div className="flex items-center justify-center mr-2">
          {seconds[0]}
        </div>
        <div className="flex items-center justify-center ">{seconds[1]}</div>
      </div>
    </div>
  );
};

export default Display;
