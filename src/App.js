import logo from './logo.svg';
import './App.css';
import DrawingTool from './DrawingTool';
import { writingData } from './Constants/constants.jsx';

function App() {
  return (
    <div className="App">
      tester toool
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <DrawingTool writingData ={writingData}
        width={window.innerWidth - 30}
        height={window.innerHeight - 30}
        zIndex={0}
      />
    </div>
  );
}

export default App;
