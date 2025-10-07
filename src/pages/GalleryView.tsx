import { useState, useEffect, useCallback } from 'react';
import { usePokemon } from '../context/PokemonContext';
import PokemonCardWithType from '../components/PokemonCardWithType';

const GalleryView = () => {
  const { pokemonWithTypes, loading, loadingDetails, setCurrentList } = usePokemon();
  const [filteredPokemon, setFilteredPokemon] = useState<Array<{ pokemon: any; types: string[] }>>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Array<{ pokemon: any; types: string[] }>>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availableTypes] = useState<string[]>([
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 54;

  const filterPokemon = useCallback(() => {
    let filtered;
    if (selectedTypes.length === 0) {
      filtered = pokemonWithTypes;
    } else {
      filtered = pokemonWithTypes.filter(item =>
        selectedTypes.some(type => item.types.includes(type))
      );
    }
    setFilteredPokemon(filtered);
    setCurrentList(filtered.map(item => item.pokemon));
    setCurrentPage(1);
  }, [selectedTypes, pokemonWithTypes, setCurrentList]);

  const updateDisplayedPokemon = useCallback(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setDisplayedPokemon(filteredPokemon.slice(startIndex, endIndex));
  }, [filteredPokemon, currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    filterPokemon();
  }, [filterPokemon]);

  useEffect(() => {
    updateDisplayedPokemon();
  }, [updateDisplayedPokemon]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = currentPage * ITEMS_PER_PAGE < filteredPokemon.length;

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (loading) return <div className="loading">Loading Gallery...</div>;

  return (
    <div className="view">
      <div className="filter-buttons">
        {availableTypes.map(type => (
          <button
            key={type}
            className={`type type-${type} ${selectedTypes.includes(type) ? 'active' : ''}`}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loadingDetails && <div className="loading">Loading Pokemon details...</div>}

      <div className="results">
        Showing {displayedPokemon.length} of {filteredPokemon.length} Pokemon
      </div>

      <div className="grid">
        {displayedPokemon.map(({ pokemon, types }) => (
          <PokemonCardWithType key={pokemon.name} pokemon={pokemon} types={types} />
        ))}
      </div>

      {hasMore && (
        <div className="more">
          <button onClick={loadMore}>
            Load More ({filteredPokemon.length - displayedPokemon.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
