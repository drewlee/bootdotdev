import { Cache } from './pokecache.js';

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type Location = {
  encounter_method_rates: {
    encounter_method: {
      name: string;
      url: string;
    };
    version_details: {
      rate: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
  game_index: number;
  id: number;
  location: {
    name: string;
    url: string;
  };
  name: string;
  names: {
    language: {
      name: string;
      url: string;
    };
    name: string;
  }[];
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
    version_details: {
      encounter_details: {
        chance: string;
        condition_values: unknown[];
        max_level: number;
        method: {
          name: string;
          url: string;
        };
        min_level: number;
      }[];
      max_chance: number;
      version: {
        name: string;
        url: string;
      };
    }[];
  }[];
};

let cache = new Cache(30000);

export class PokeAPI {
  private static readonly baseURL = 'https://pokeapi.co/api/v2';

  constructor() {}

  async fetchLocations(pageURL: string): Promise<ShallowLocations | undefined> {
    let data: ShallowLocations | undefined = cache.get(pageURL);

    if (data) {
      return data;
    }

    try {
      const response = await fetch(pageURL);
      data = (await response.json()) as ShallowLocations;
      cache.add(pageURL, data);
    } catch (error) {
      console.log(`Error: Failed fetching data for location areas at ${pageURL}`);
    }

    return data;
  }

  async fetchLocation(locationName: string): Promise<Location | undefined> {
    const pageURL = `${PokeAPI.baseURL}/location-area/${locationName}/`;
    let data: Location | undefined = cache.get(pageURL);

    if (data) {
      return data;
    }

    try {
      const response = await fetch(pageURL);
      data = (await response.json()) as Location;
      cache.add(pageURL, data);
    } catch (error) {
      console.log(`Error: Failed fetching data for location area at ${pageURL}`);
    }

    return data;
  }
}
