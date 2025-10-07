import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { PokemonListItem } from '../api/pokemon';

interface PokemonWithTypes {
  pokemon: PokemonListItem;
  types: string[];
}

interface PokemonContextType {
  allPokemon: PokemonListItem[];
  pokemonWithTypes: PokemonWithTypes[];
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  currentList: PokemonListItem[];
  setCurrentList: (list: PokemonListItem[]) => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within PokemonProvider');
  }
  return context;
};

interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [pokemonWithTypes, setPokemonWithTypes] = useState<PokemonWithTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentList, setCurrentList] = useState<PokemonListItem[]>([]);

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  const fetchAllPokemon = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pokemonApi.getPokemonList(10000, 0);
      setAllPokemon(data.results);
      setLoading(false);

      setLoadingDetails(true);
      const batchSize = 54;
      const allDetails: PokemonWithTypes[] = [];

      for (let i = 0; i < data.results.length; i += batchSize) {
        const batch = data.results.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
          batch.map(async (p) => {
            try {
              const details = await pokemonApi.getPokemonByName(p.name);
              return {
                pokemon: p,
                types: details.types.map(t => t.type.name)
              };
            } catch (error) {
              return { pokemon: p, types: [] };
            }
          })
        );
        allDetails.push(...batchDetails);
        setPokemonWithTypes([...allDetails]); 
      }

      setLoadingDetails(false);
    } catch (err) {
      setError('Failed to fetch Pokemon');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        allPokemon,
        pokemonWithTypes,
        loading,
        loadingDetails,
        error,
        currentList,
        setCurrentList
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
