import * as z from 'zod'


export const movieSchema = z.object({
    id: z.number().transform(id => id.toString()),
    title: z.string(),
    poster_path: z
        .string()
        .nullable()
        .transform(val =>
            val ? `https://image.tmdb.org/t/p/w500${val}` : null
        ),
    release_date: z
        .string()
        .nullable()
        .transform(val => (val ? val.slice(0, 4) : null)),
    genre_ids: z
        .array(z.number())
        .nullable()
        .transform(val => val?.[0]?.toString() ?? null),
    vote_average: z.number(),
}).transform((movie) => {

  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    year: movie.release_date,
    genres: movie.genre_ids, 
    rating: movie.vote_average,
  };
});