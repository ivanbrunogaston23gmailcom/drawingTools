import logo from './logo.svg';
import './App.css';
import DrawingTool from './DrawingTool';
import { writingData } from './Constants/constants.jsx';

function App() {
  return (
    <div className="App">

      tester toool
      <DrawingTool writingData ={writingData}/>
    </div>
  );
}

export default App;
