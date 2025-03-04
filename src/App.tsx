import './App.css'
import {Heading, Theme} from "@radix-ui/themes";
import {Calculator} from "./Calculator.tsx";
import {GiHedgehog} from "react-icons/gi";

function App() {

  return (
      <Theme accentColor="teal" radius="small">
          <div className="wrapper">
              <div className="title">
                  <GiHedgehog size="100px"/>
                  <Heading>Hedgehog sleepy time</Heading>
              </div>
              <Calculator />
          </div>
      </Theme>
  )
}

export default App
