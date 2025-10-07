import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pokemonApi } from '../services/pokemonApi';
import { usePokemon } from '../context/PokemonContext';
import { Pokemon } from '../api/pokemon';

const DetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentList } = usePokemon();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPokemon(parseInt(id));
    }
  }, [id]);

  const fetchPokemon = async (pokemonId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pokemonApi.getPokemonById(pokemonId);
      setPokemon(data);
    } catch (err) {
      setError('Failed to load Pokemon details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonId = (url: string): number => {
    const parts = url.split('/').filter(part => part);
    return parseInt(parts[parts.length - 1]);
  };

  const handlePrevious = () => {
    if (currentList.length === 0) return;

    const currentId = parseInt(id || '1');
    const currentIndex = currentList.findIndex(p => getPokemonId(p.url) === currentId);

    if (currentIndex === -1) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentList.length - 1;
    const prevId = getPokemonId(currentList[prevIndex].url);
    navigate(`/pokemon/${prevId}`);
  };

  const handleNext = () => {
    if (currentList.length === 0) return;

    const currentId = parseInt(id || '1');
    const currentIndex = currentList.findIndex(p => getPokemonId(p.url) === currentId);

    if (currentIndex === -1) return;

    const nextIndex = currentIndex < currentList.length - 1 ? currentIndex + 1 : 0;
    const nextId = getPokemonId(currentList[nextIndex].url);
    navigate(`/pokemon/${nextId}`);
  };

  if (loading) return <div className="loading">Loading Pokemon...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!pokemon) return <div className="error">Pokemon not found</div>;

  return (
    <div className="detail">
      <div className="detail-nav">
        <button onClick={handlePrevious}>← Previous</button>
        <button onClick={handleNext}>Next →</button>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-title">
            {pokemon.name}
            <span className="detail-number">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h1>
        </div>

        <div className="detail-content">
          <div className="detail-img">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <div className="detail-types">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className={`type type-${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-info-section">
            <div className="info">
              <div className="info-item">
                <span className="info-label">Height</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Base XP</span>
                <span className="info-value">{pokemon.base_experience}</span>
              </div>
            </div>

            <div className="section">
              <h3>Abilities</h3>
              <div className="abilities">
                {pokemon.abilities.map((ability) => (
                  <span key={ability.ability.name} className="ability">
                    {ability.ability.name}
                    {ability.is_hidden && ' (Hidden)'}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Base Stats</h3>
              <div className="stats">
                {pokemon.stats.map((stat, index) => (
                  <div key={stat.stat.name} className={`stat stat-${index + 1}`}>
                    <span className="stat-name">{stat.stat.name}</span>
                    <div className="stat-bg">
                      <div className={`stat-bar stat-bar-${Math.min(Math.round(stat.base_stat / 25.5), 10)}`} />
                    </div>
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
