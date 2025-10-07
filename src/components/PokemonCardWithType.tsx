import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PokemonListItem } from '../api/pokemon';

interface PokemonCardWithTypeProps {
  pokemon: PokemonListItem;
  types: string[];
}

const PokemonCardWithType = ({ pokemon, types }: PokemonCardWithTypeProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const getId = (url: string): string => {
    const parts = url.split('/').filter(part => part);
    return parts[parts.length - 1];
  };

  const id = getId(pokemon.url);
  // item media
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const handleClick = () => {
    navigate(`/pokemon/${id}`);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {imageError ? (
        <div className="placeholder">?</div>
      ) : (
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="image"
          onError={handleImageError}
        />
      )}
      <h3 className="name">
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h3>
      <p className="id">#{id.padStart(3, '0')}</p>
      {types.length > 0 && (
        <div className="types">
          {types.map(type => (
            <span key={type} className={`type type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonCardWithType;
