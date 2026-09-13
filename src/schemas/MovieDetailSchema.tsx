import * as z from 'zod'


export const movieDetailSchema = z.object({
    id: z.number().transform(id => id.toString()),
    backdrop_path: z
        .string()
        .nullable()
        .transform(val =>
            val ? `https://image.tmdb.org/t/p/w500${val}` : null
        ),
    overview: z
        .string()
        .nullable(),
    
}).transform((movie) => {

  return {
    id: movie.id,
    backdrop: movie.backdrop_path,
    overview: movie.overview,
  };
});

export const movieVideosSchema = z.object({
  results: z.array(
    z.object({
      key: z.string(),
      site: z.string(),
      type: z.string(),
      official: z.boolean().optional(),
    })
  ),
});