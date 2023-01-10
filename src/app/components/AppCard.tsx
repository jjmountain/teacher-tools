import React from 'react'
import { Link } from 'react-router-dom'

type AppCardProps = {
  name: string
  route: string
  underConstruction?: boolean
}

const AppCard = ({ name, route, underConstruction }: AppCardProps) => {
  return (
    <Link to={route}>
      <div
        className={`p-4 bg-spring-wood-100 hover:bg-spring-wood-200 text-sm md:text-xl uppercase text-center font-light hover:font-medium border text-gray-900 border-gray-500 hover:border-gray-900 flex justify-center items-center h-full ${
          underConstruction && 'opacity-20'
        }`}
      >
        {name}
      </div>
    </Link>
  )
}

export default AppCard
