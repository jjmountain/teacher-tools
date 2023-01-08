const Header = () => {
return (
  <nav className="h-[50px] bg-gray-700 flex flex-row justify-center items-center">
  <a className="text-blue-400 m-10 flex items-center" href='/' >Home</a>
  <a className="text-blue-400 m-10" href='/stopwatch' >Stopwatch</a>
  <a className="text-blue-400 m-10" href='/timer' >Timer</a>
</nav>
)
};

export default Header;