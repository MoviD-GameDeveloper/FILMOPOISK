import { View, Text, FlatList, } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import useFavoriteStore from "@/src/store/useFavoriteStore"
import { useMemo } from "react"
import MovieList from "@/src/components/MovieList"

export function FavoriteScreen(){
    const favoriteFilmsMap = useFavoriteStore(state => state.favoriteFilms);
    const filmsArray = useMemo(() => {
        return Object.values(favoriteFilmsMap || {}).sort((a,b) => (a.addedAt ?? 0) - (b.addedAt ?? 0));
    }, [favoriteFilmsMap]);
    
    return(
        <SafeAreaView className="flex-1 bg-[#1F1F23]">
            {filmsArray.length !== 0
            ?(
                <MovieList films={filmsArray} isEndlessList={false}/>
            )
            : <View className="flex-1 justify-center items-center">
                <Text className="text-[#EFEFF1] text-center">Ваша фильмотека пуста</Text>
              </View>
            } 
            
        </SafeAreaView>
    )
}

export default FavoriteScreen