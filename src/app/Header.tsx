import { NavLink, Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <Link to='/'>
        <header className='w-full h-24 flex justify-center items-center text-4xl'>
          <div></div>
          Classroom Companion
        </header>
      </Link>
      <nav className='h-[50px] text-sm md:text-base uppercase border-t border-b text-black border-slate-900 bg-spring-wood-50 flex flex-row justify-center items-center'>
        <NavLink to='stopwatch' className='mr-10'>
          {({ isActive }) => <span className={isActive ? 'underline' : ''}>Stopwatch</span>}
        </NavLink>
        <NavLink to='timer' className='mr-10'>
          {({ isActive }) => <span className={isActive ? 'underline' : ''}>timer</span>}
        </NavLink>
      </nav>
    </>
  )
}

export default Header
