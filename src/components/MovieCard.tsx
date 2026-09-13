import { Image, Text, View, Pressable, useWindowDimensions, } from "react-native";
import { useRouter } from "expo-router";
import useSearchStore from "../store/useSearchStore";
import { Ionicons } from "@expo/vector-icons";
import useFavoriteStore from "../store/useFavoriteStore";
import Animated ,{
    withSpring,
    withSequence,
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MovieCard({id, title, year, genre, poster, rating, inSearch = ''} : {id : string, title: string, year: string, genre: string, poster: string, rating: number, inSearch?: string}){
    const isFavorite = useFavoriteStore(state => !!state.favoriteFilms[id]);
    const addFavoriteFilm = useFavoriteStore(state => state.addFavoriteFilm)
    const removeFavoriteFilm = useFavoriteStore(state => state.removeFavoriteFilm)
    const router = useRouter()
    const  { width } = useWindowDimensions()
    const addRequest = useSearchStore(state => state.addRequest)
    const scale = useSharedValue(1)

    const toggleFavorite = (e: any) => {
        e.stopPropagation();
        if (isFavorite) {
            removeFavoriteFilm(String(id));
        } else {
            console.log(genre)
            addFavoriteFilm(String(id), {
                id: String(id),
                title,
                poster,
                year: year || null,    
                genres: genre || null,  
                rating: rating || 0
            });
            scale.value = withSequence(
                withSpring(1.3, { damping: 1000, stiffness: 50000 }),
                withSpring(1, { damping: 1000, stiffness: 50000 }),      
            )
        }
    };

    const handlePress = () => {
        if (inSearch?.trim()) {
            addRequest(inSearch.trim());
        }
        router.push({ 
            pathname: '/[id]', 
            params: {
                id: String(id),
                title,
                year: String(year),
                genre,
                poster,
                rating: String(rating),
            }
        });
    };

    const scaleAnimation = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value
                },
            ]
        }
    })

    return(
        <Pressable  
            className="bg-[#181424] rounded-xl " 
            style={{ width: (width-20) / 2, height: 280}}
            onPress={handlePress}
        >
            <Image
                source={{
                    uri: poster
                }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
            />    
            <View className="w-10 h-8 absolute top-4 left-2 justify-center items-center rounded-[5px]" style={{backgroundColor: rating > 7 ? '#16A34A' : rating > 4 ? '#d6c52c'  : '#DC2626'}} >
                <Text className="text-white">{rating.toFixed(2)}</Text>
            </View>
            
            <AnimatedPressable
                style={scaleAnimation}
                className="absolute top-4 right-2"
                onPress={toggleFavorite}
            >
                <Ionicons  name='heart' size={25} color={isFavorite? 'red' : 'white'}/>
            </AnimatedPressable>
            <View>
                <Text className="text-base font-bold ml-1 p-1 text-[#EFEFF1] text-[14px]" numberOfLines={1}>{title}</Text>
                <Text className="text-base ml-1 p-1 text-[#ADADB8]" numberOfLines={1}>{year}, {genre}</Text>
            </View>
        </Pressable>
    )
}