import React from "react";
import { Link } from "react-router-dom";

type AppCardProps = {
  name: string;
  route: string;
  underConstruction?: boolean;
};

const AppCard = ({ name, route, underConstruction }: AppCardProps) => {
  return (
    <Link to={route}>
      <div
        className={`p-4 text-sm md:text-xl uppercase text-center text-gray-900 border border-slate-900 flex justify-center items-center h-full ${
          underConstruction && "opacity-20"
        }`}
      >
        {name}
      </div>
    </Link>
  );
};

export default AppCard;
