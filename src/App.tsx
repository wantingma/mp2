import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { PokemonProvider } from './context/PokemonContext';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';

function App() {
  return (
    <Router basename="/mp2">
      <PokemonProvider>
        <div className="App">
          <header className="header">
            <h1 className="title">Pokémon Museum</h1>
            <nav className="nav">
              <Link to="/">Search</Link>
              <Link to="/gallery">Gallery</Link>
            </nav>
          </header>

          <main className="main">
            <Routes>
              <Route path="/" element={<ListView />} />
              <Route path="/gallery" element={<GalleryView />} />
              <Route path="/pokemon/:id" element={<DetailView />} />
            </Routes>
          </main>
        </div>
      </PokemonProvider>
    </Router>
  );
}

export default App;
