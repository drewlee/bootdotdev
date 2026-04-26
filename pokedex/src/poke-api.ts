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
  // add properties here
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
      console.log('Unable to fetch location data. Please try again later.');
    }

    return data;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    // implement this
    return {};
  }
}
