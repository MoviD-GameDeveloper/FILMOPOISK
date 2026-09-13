import { useInfiniteQuery } from '@tanstack/react-query';
import { View, TextInput, Pressable, FlatList, Text, ActivityIndicator,} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { GetSearchResults } from '@/src/services/tmdb';
import { RequestComponent } from "@/src/components/RequestComponent";
import  useSearchStore  from "@/src/store/useSearchStore";
import useHomeStore from '@/src/store/useHomeStore';
import MovieList from '@/src/components/MovieList';

export function SearchScreen(){
    const searchStore = useSearchStore(state => state.searchStory);
    const deleteRequest = useSearchStore(state => state.deleteRequest)
    const addRequest = useSearchStore(state => state.addRequest)
    const [query, SetQuery] = useState<string>('')
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const { data, isLoading, isError, refetch } = useInfiniteQuery({
            queryKey: ['searchResults', debouncedQuery],
            queryFn: () =>  GetSearchResults({query:debouncedQuery}),
            initialPageParam: 1,
            enabled: debouncedQuery.trim().length > 0,
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length > 0 ? allPages.length + 1 : undefined;
            }
        });
        const films = data?.pages.flat() ?? []


    return(
        <SafeAreaView className="flex-1 items-center px-2.5 py-[20px] bg-[#1F1F23]">
            <View className="flex-row items-center w-full h-[53px] border border-black-400 bg-[#1F1F23] border-[#3A3A44] text-white rounded-xl px-[10]">
                <TextInput
                    className="w-full h-full px-[30px] text-base text-[#EFEFF1] text-[16px]"
                    placeholder="Поиск..."
                    placeholderTextColor="#ADADB8"
                    onChangeText={(text) => SetQuery(text)}
                    onSubmitEditing={() => query.trim() && addRequest(query.trim())}
                    value={query}
                />
                <Ionicons className="absolute top-50% left-2" name="search" size={23} color={'#ADADB8'}/>        
                {query.length > 0 && (
                    <Pressable onPress={() => SetQuery('')} className="absolute top-50% right-2">
                        <Ionicons  name='close-sharp' size={25} color={'white'}/>
                    </Pressable> 
                )}   
            </View>
                <View className='px-4 w-full max-h-[120px]'>
                    <FlatList
                        data={searchStore}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({item, index}) => <RequestComponent title={searchStore[index]} index={index} deleteRequest={deleteRequest} SetQuery={() => SetQuery(item)}/>}
                        contentContainerClassName="gap-1"             
                    />
                </View>
            
            {debouncedQuery.length > 0 && (
                <View className='justify-center flex-1 w-full mt-1'>
                    {isLoading ? (
                        <View>
                            <ActivityIndicator size={'large'} color="#9146FF"/>
                            <Text className="text-[#EFEFF1] text-center py-2 text-[17px]">Ищем...</Text>
                        </View>
                        
                    ) : isError ? (
                        <View className='flex-1 justify-center items-center'>
                            <Text className="text-[#EFEFF1] text-center">Произошла ошибка при загрузке.</Text>
                            <Pressable onPress={() => refetch()} className='w-[170px] h-[50px] bg-[#9146FF] justify-center items-center m-3'><Text className='text-white'>Перезагрузить</Text></Pressable>
                        </View>
                    ) : (
                        <MovieList films={films} inSearch={query} isEndlessList={false}/>
                    )}
                    
                </View>
            )}
            
        </SafeAreaView>
    )
}

export default SearchScreen;