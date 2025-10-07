import { useState, useEffect } from 'react';
import { usePokemon } from '../context/PokemonContext';
import { PokemonListItem } from '../api/pokemon';
import PokemonCard from '../components/PokemonCard';

const ListView = () => {
  const { allPokemon, loading, error, setCurrentList } = usePokemon();
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'id'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 54;

  useEffect(() => {
    filterAndSortPokemon();
  }, [searchQuery, sortBy, sortOrder, allPokemon]);

  useEffect(() => {
    updateDisplayedPokemon();
  }, [filteredPokemon, currentPage]);

  const getPokemonNumber = (url: string): number => {
    const parts = url.split('/').filter(part => part);
    return parseInt(parts[parts.length - 1]);
  };

  const filterAndSortPokemon = () => {
    let result = [...allPokemon];

    // Filter 
    if (searchQuery.trim()) {
      result = result.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const numA = getPokemonNumber(a.url);
        const numB = getPokemonNumber(b.url);
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });

    setFilteredPokemon(result);
    setCurrentList(result); 
    setCurrentPage(1); //  first page when filtering changes
  };

  const updateDisplayedPokemon = () => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setDisplayedPokemon(filteredPokemon.slice(startIndex, endIndex));
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = currentPage * ITEMS_PER_PAGE < filteredPokemon.length;

  if (loading) return <div className="loading">Loading Pokemon...</div>;
  if (error) return <div className="error">{error}</div>;
  if (allPokemon.length === 0) return <div className="loading">No Pokemon found</div>;

  return (
    <div className="view">
      <div className="controls">
        <div className="search">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sort">
          <label>
            Sort:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'id')}>
              <option value="id">Id</option>
              <option value="name">Name</option>
            </select>
          </label>

          <label>
            Order:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="results">
        Showing {displayedPokemon.length} of {filteredPokemon.length} Pokemon
      </div>

      <div className="grid">
        {displayedPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
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

export default ListView;
