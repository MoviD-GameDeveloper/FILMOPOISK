import {create} from 'zustand'

export interface Movie {
  id: string;
  title: string;
  poster: string | null;
  year: string | null;
  genres: string | null;
  rating: number;
}

interface HomeStore {
  genres: Record<string, string>;
  currentGenre: string;
  loadGenres: () => Promise<void>;
  getGenreName: (id: string | null) => string | null;
  setCurrentGenre: (name: string) => void;
}

const useHomeStore = create<HomeStore>((set, get) => ({
    genres: { '': 'Все' }, 
    currentGenre: '',
    loadGenres: async () => {
        try {
            const apiKey = process.env.EXPO_PUBLIC_API_KEY;
            const genreMap = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=ru-RU&api_key=${apiKey}`)
            .then(r => r.json())
            .then(result =>
                result.genres.reduce(
                    (acc: Record<string, string>, genre: { id: number; name: string }) => {
                        acc[String(genre.id)] = genre.name;
                        return acc;
                    },
                    {}
                )
            );
            console.log(genreMap)
            set({
                genres: {'': 'Все', ...genreMap},
            });
        } catch (err) {
            console.error('Ошибка загрузки жанров:', err);
        }
    },
    getGenreName: (id: string | null) => {
        if (!id) return null
        const {genres} = get()
        return genres[id] || null
    },
    setCurrentGenre: (name : string) => {
        set({
            currentGenre: name,
        });

    }, 

}))

export default useHomeStore;