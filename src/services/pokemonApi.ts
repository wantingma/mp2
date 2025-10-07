import axios from 'axios';
import { PokemonListResponse, Pokemon } from '../api/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const cache = new Map<string, any>();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => {
    cache.set(response.config.url || '', response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const pokemonApi = {

  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    const cacheKey = `/pokemon?limit=${limit}&offset=${offset}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const response = await api.get<PokemonListResponse>('/pokemon', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  },

  async getPokemonByName(name: string): Promise<Pokemon> {
    const cacheKey = `/pokemon/${name}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const response = await api.get<Pokemon>(`/pokemon/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon ${name}:`, error);
      throw error;
    }
  },

  // Get Pokemon by ID
  async getPokemonById(id: number): Promise<Pokemon> {
    const cacheKey = `/pokemon/${id}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const response = await api.get<Pokemon>(`/pokemon/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon with ID ${id}:`, error);
      throw error;
    }
  },


  async searchPokemon(query: string): Promise<PokemonListResponse> {
    try {
      const response = await this.getPokemonList(1000, 0);

      const filtered = response.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
        count: filtered.length,
        next: null,
        previous: null,
        results: filtered
      };
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      throw error;
    }
  }
};

export {};
