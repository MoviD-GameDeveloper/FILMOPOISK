import { create } from "zustand";
import { produce } from "immer";
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface Movie {
  id: string;
  title: string;
  poster: string | null;
  year: string | null;
  genres: string | null;
  rating: number;
  addedAt?: number;
  backdrop? : string;
  overview? : string;
}

interface FavoriteStore {
    favoriteFilms: Record<string, Movie>;
    addFavoriteFilm: (id : string, movie : Movie) => void;
    removeFavoriteFilm: (id : string) => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            favoriteFilms: {},

            addFavoriteFilm: (id, movie) => {
                const { favoriteFilms } = get();
                set({
                    favoriteFilms: produce(favoriteFilms, (draft) => {
                        draft[id] = {
                            ...movie,
                            addedAt: Date.now()
                        };
                    }),
                });
            },

            removeFavoriteFilm: (id) => {
                const { favoriteFilms } = get();
                set({
                    favoriteFilms: produce(favoriteFilms, (draft) => {
                        delete draft[id];
                    }),
                });
            },
        }),
        {
            name: 'favorite-films-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useFavoriteStore;