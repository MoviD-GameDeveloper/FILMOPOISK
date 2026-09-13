import { useInfiniteQuery } from '@tanstack/react-query';
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {GetMovies} from "@/src/services/tmdb"
import useHomeStore from '@/src/store/useHomeStore';
import { GenreFilterButton } from '@/src/components/GenreFilterButton';
import MovieList from '@/src/components/MovieList';
import { useMemo, useState } from 'react';

type Genre = [string, string];

export function HomeScreen(){

    const genres = useHomeStore(state => state.genres);
    const getGenreName = useHomeStore(state => state.getGenreName)

    const [genre, setGenre] = useState<string | null>(null)

    const { data, isLoading, isError, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ['movies', genre],
        queryFn: ({pageParam = 1}) => GetMovies({pageParam, genre}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
        },
    });

    const films = data?.pages.flatMap(page => page.movies) ?? []


    const genresFilter = (item: Genre) => {
        if (item[0] === "") {
            setGenre(null);
        } else {
            const [id] = item;
            setGenre(id);
        }
    }

    const loadMore = () => {
        if(hasNextPage && !isFetchingNextPage){
            fetchNextPage()
        }
    }

    const genresList = useMemo(() => {
        const { '': _, ...rest } = genres;
        return [['', 'Все'], ...Object.entries(rest)] as Genre[];
    }, [genres]);

    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-[#1F1F23]'>
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator size={'large'} color="#9146FF"/>
                    <Text className='text-[#EFEFF1]'>Загрузка фильмов...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView className='flex-1 bg-[#1F1F23]'>
                <View className='flex-1 justify-center items-center text-[#EFEFF1]'>
                    <Text>Произошла ошибка при загрузке.</Text>
                    <Pressable onPress={() => refetch()} className='w-[170px] h-[50px] bg-[#9146FF] justify-center items-center m-3'><Text className='text-white'>Перезагрузить</Text></Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (isSuccess){
        console.log('ФИЛЬМЫ', films)
        films.map(
          film => getGenreName(film.genres)  
        )
    }

    return(
        <SafeAreaView className='flex-1 bg-[#1F1F23]'>
            <View className='flex-1'>
                <View className='px-[20px] w-full'>
                    <Text className='text-[#EFEFF1] text-[25px]'>ФИЛЬМОПОИСК</Text>
                </View>

                <View className='mx-2'>
                    <FlatList
                        data={genresList}
                        horizontal={true}
                        keyExtractor={(item) => item[0]}
                        renderItem={({item}) => (
                            <GenreFilterButton
                                name={item}
                                genresFilter={genresFilter}
                            />
                        )}
                        contentContainerClassName="gap-1"
                        className='py-4'
                    />
                </View>

                <View className='justify-center flex-1'>
                    <MovieList
                        films={films}
                        isEndlessList={true}
                        loadMore={loadMore}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen