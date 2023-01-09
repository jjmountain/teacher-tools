import AppCard from "./components/AppCard";

const Homepage = () => {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <div className="h-[300px] w-10/12 grid grid-rows-flow grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
        <AppCard name="Timer" route="/timer" />
        <AppCard name="Stopwatch" route="/stopwatch" />
        <AppCard name="Name Picker" route="#" underConstruction />

        <AppCard name="Interval Timer" route="#" underConstruction />
        <AppCard name="Seating Chart" route="#" underConstruction />
        <AppCard name="Feedback Generator" route="#" underConstruction />
      </div>
    </div>
  );
};

export default Homepage;
