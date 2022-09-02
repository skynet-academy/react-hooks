import React, { useState, useEffect, useMemo, useRef, createContext } from 'react';
import ChangeThemeClass from "./components/ChangeThemeClass"
import ChangeTheme from "./components/ChangeTheme"

export const ThemeContext = createContext(true)

function App() {
  // there are two ways when we want to pass initial values to 'useState'
  // the first one is by passing a value(when the computation is not big)
  // the second one is when there is a big calculation and we need performance
  // in that case we pase a anonimous function as a parameter

  const [counter, setCounter] = useState(() => 0);
  const [theme, setTheme] = useState(() => 'blue');

  // useState with fetch
  const [resourceType, setResourceType] = useState(() => 'posts')
  const [items, setItems] = useState([])

  // example with useMemo
  const [ number, setNumber ] = useState(0)
  const [ dark, setDark ] = useState(false)

  // using useMemo with our slow function
  const doubleNumber = useMemo(() => {
        return slowFunction(number)
    }, [number]) // the only element that changes

  // using useRef
  const [ name, setName ] = useState('')
  const renderCount = useRef(0)
  useEffect(()=>{
    renderCount.current = renderCount.current + 1
  })

  // using context in react
  const [darkTheme, setDarkTheme] = useState(() => true)

  function toggleTheme(){
    setDarkTheme(prevDarkTheme => !prevDarkTheme)
  }

  // using useMemo to reupdate only when dark variable changes
  const themeStyles = useMemo(() => {
    return {
        backgroundColor: dark? "black": "white",
        color: dark? "white": "black"
    }
  }, [dark])
  // console log when themestyle changes, also the useEffect is executed
  useEffect(() => {
    console.log("changing theme")
  }, [themeStyles])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const incrementValue = () => {
    setCounter(prevVal => prevVal + 1)
    setTheme(preThem => "blue")
  }

  const decrementValue = () => {
    setCounter(prevVal => prevVal - 1)
    setTheme(preThem => "red")
  }

  const handleResize = () =>{
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    // to not add a lot of listeners to our window and slow donw our app,
    // we'll use 'return' in useEffect
    return () => {
        window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(()=> {
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
    .then( response => response.json())
    .then(json => setItems(json))
  }, [resourceType])

  return (
    <div>
        <ThemeContext.Provider value={darkTheme}>
            <button onClick={toggleTheme}>Toggle theme</button>
            <ChangeThemeClass />
            <ChangeTheme />
        </ThemeContext.Provider>
        <div>
            <h1>Example counter with useState</h1>
            <p style={{color: theme, fontSize: "40px"}}>{counter}</p>
            <button onClick={ incrementValue }>+</button>
            <button onClick={ decrementValue }>-</button>
        </div>
        <div>
            <h1>Testing the window width with useEffect</h1>
            <p>Window size: {windowWidth}</p>
        </div>
        <div>
            <h1>Example using useMemo</h1>
            <input type="number" value={number} onChange={e => setNumber(parseInt(
                e.target.value))} />

            <button onClick={()=> setDark(prevDark => !prevDark)}>Change Theme</button>
            <div style={themeStyles}>{doubleNumber}</div>
            <div>the name is {name}</div>
        </div>
        <div>
            <h1>Using useRef</h1>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <div>My name is {name}</div>
            <div>render times: {renderCount.current} </div>
        </div>
        <div>
            <h1>Example counter with useEffect</h1>
            <button onClick={() => setResourceType('posts')}>Post</button>
            <button onClick={() => setResourceType('users')}>Users</button>
            <button onClick={() => setResourceType('comments')}>Comments</button>
            <p>{resourceType}</p>
                { items.map(item => {
                    return <pre>{JSON.stringify(item)}</pre>
                }) }
        </div>

    </div>
  );
}

// a function that allows us to see how to improve our performance by using
// useMemo, this function does nothing
function slowFunction(num: number){
    console.log("making a slow calculation")
    for(let i = 0; i <= 100000000; i++){}
    return num * 2
}

export default App;
