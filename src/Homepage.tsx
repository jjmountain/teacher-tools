
const Homepage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-gray-700 h-96 w-10/12 flex flex-col items-center justify-center" >
      <h1>Teacher Tools</h1>
      <ul>
        <li><a href='./stopwatch'>Stopwatch</a></li>
        <li><a href='./timer'>Timer</a></li>
        <li><a href='#'>Seat Selector</a></li>
      </ul>
      </div>
    </div>
  )
}


export default Homepage;