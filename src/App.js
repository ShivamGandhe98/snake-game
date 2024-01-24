import './App.css';
import image from './image/snake_game.jpg'
import GameState from './components/GameState';
function App() {
  return (
    <div className="container">
    <img className="image" src={image}/>
      <div className="snake-game">
        <GameState />
      </div>
    </div>
  );
}

export default App;
