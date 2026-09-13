import * as z from 'zod'
import { movieSchema } from "../schemas/MovieSchema";
import { movieDetailSchema } from '../schemas/MovieDetailSchema';
import { movieVideosSchema } from '../schemas/MovieDetailSchema';

const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export async function GetMovies({ pageParam = 1, genre }: { pageParam?: number; genre: string | null;}) {
  const apiCall = genre
    ? `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=ru-RU&page=${pageParam}&sort_by=popularity.desc&api_key=${apiKey}&with_genres=${genre}`
    : `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=ru-RU&page=${pageParam}&sort_by=popularity.desc&api_key=${apiKey}`;
  const res = await fetch(
    apiCall,
  )
  const data = await res.json()
  const parsed = z.array(movieSchema).safeParse(data.results)

  if(parsed.success){
    const filteredMovies = genre === null 
      ? parsed.data 
      : parsed.data.filter(movie => movie.genres === genre);
    return {
      movies: filteredMovies,
      page: data.page as number,
      totalPages: data.total_pages as number,
    };
  }
  else{
    console.error("Ошибка Zod:", parsed.error.format());
    throw new Error("Ошибка валидации данных");
  }
}

export async function GetSearchResults({query} : {query : string}){   
  if (!query) return [];  
  try {
      const data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&language=ru-RU&api_key=${apiKey}`)
        .then(res => res.json())
      const parsed = z.array(movieSchema).safeParse(data.results)

      if(parsed.success){
        return parsed.data
      }
      else{
        console.error("Ошибка Zod:", parsed.error.format());
        throw new Error("Ошибка валидации данных");
      }
      
  }
  catch (err) {
    console.error('Ошибка загрузки поиска :', err)
    throw err;
  }
}

export async function GetDetails({ id }: { id: string }) {
  try {
    const [detailsResponse, videosResponse] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=ru-RU&api_key=${apiKey}`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${apiKey}`
      ),
    ]);

    const detailsData = await detailsResponse.json();
    const videosData = await videosResponse.json();

    const details = movieDetailSchema.safeParse(detailsData);
    const videos = movieVideosSchema.safeParse(videosData);

    if (!details.success) {
      console.error('Ошибка Zod details:', details.error.format());
      throw new Error('Ошибка валидации деталей фильма');
    }

    if (!videos.success) {
      console.error('Ошибка Zod videos:', videos.error.format());
      throw new Error('Ошибка валидации видео');
    }

    const trailer = videos.data.results.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        video.official === true
    );

    return {
      ...details.data,
      trailerLink: trailer?.key ?? null,
      site: trailer?.site ?? null,
    };
  } catch (err) {
    console.error('Ошибка загрузки деталей:', err);
    throw err;
  }
}