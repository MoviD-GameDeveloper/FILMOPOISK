import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable,  ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { GetDetails } from "@/src/services/tmdb";
import { SafeAreaView } from "react-native-safe-area-context"
import useFavoriteStore from "@/src/store/useFavoriteStore";
import { TrailerVideo } from "@/src/components/TrailerVideo";
import Animated ,{
    withSpring,
    withSequence,
    useSharedValue,
    useAnimatedStyle,
    createAnimatedComponent,
} from "react-native-reanimated";

const AnimatedPressable = createAnimatedComponent(Pressable)

function DetailScreen(){
    const {
        id,
        title,
        year,
        genre,
        poster,
        rating,
    } = useLocalSearchParams<{
        id: string;
        title: string;
        year: string;
        genre: string;
        poster: string;
        rating: string;
    }>()
    const router = useRouter()
    const favoriteFilms = useFavoriteStore(state => state.favoriteFilms)
    const addFavoriteFilm = useFavoriteStore(state => state.addFavoriteFilm)
    const removeFavoriteFilm = useFavoriteStore(state => state.removeFavoriteFilm)
    const scale = useSharedValue(1)
    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['DetailInfo', id],
        queryFn: () => GetDetails({id : String(id)}),
    })

    function onRefetch(){
        refetch()
    }

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
        <SafeAreaView className="flex-1 bg-[#1F1F23]">
            <ScrollView
                showsVerticalScrollIndicator = {false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                {isLoading? (
                    <View className='w-full h-[300px] justify-center items-center bg-white'>
                        <ActivityIndicator size={'small'} color="#1a1a23"/>
                        <Text className='text-black'>Загрузка шапки...</Text>
                    </View>
                ) : isError? (
                    <View className='w-full h-[300px] justify-center items-center bg-white'>
                        <Text>Произошла ошибка при загрузке.</Text>
                    </View>
                ) : (
                    <Image
                        className="w-full h-[300px]"
                        resizeMode="cover"
                        source={{uri : data!.backdrop || undefined}}
                    />
                    //<TrailerVideo width={'200'} videoId={data?.trailerLink || ''}/>
                )}
                
                <Text className="px-2 py-2 text-[18px] font-bold text-[#EFEFF1]">{title}</Text>
                <View className="flex-row gap-3 px-2">
                    <Text style={{color: Number(rating) > 7 ? '#16A34A' : Number(rating) > 4 ? '#d6c52c'  : '#DC2626'}}>{Number(rating).toFixed(2)}</Text>
                    <Text className="text-[#ADADB8]">{year}</Text>
                    <Text className="text-[#ADADB8]">{genre}</Text>
                </View>
                <Text className="px-2 py-[15px] text-white">
                    {
                        isLoading? 'Загружаем' : isError? 'Не удалось загрузить' : data?.overview
                    }
                </Text>
            </ScrollView>
            <View className="absolute bottom-[50px] flex-row gap-2 justify-center items-center w-full ">
                <Pressable 
                    className="bg-[#9146FF] rounded-[20px] justify-center items-center w-[250px] py-[20px]"
                    disabled={true}
                >
                    <Text className="font-bold text-white">Смотреть онлайн</Text>
                </Pressable>
                <AnimatedPressable  
                    className="absolute top-4 right-2"
                    style={scaleAnimation}
                    onPress={() => {
                        if (id in favoriteFilms) {
                            removeFavoriteFilm(id);
                        } else {
                            addFavoriteFilm(
                                id, 
                                {
                                    id: id,
                                    title: title,
                                    poster: poster,
                                    year: year,     
                                    genres: genre,  
                                    rating: Number(rating),
                                    backdrop: data?.backdrop || undefined,
                                    overview: data?.overview || undefined,
                                }
                            );
                            scale.value = withSequence(
                            withSpring(1.3, { damping: 1000, stiffness: 50000 }),
                            withSpring(1, { damping: 1000, stiffness: 50000 }),       
            )
                        }
                    }}
                >
                    <Ionicons  name='heart' size={40} color={id in favoriteFilms? 'red' : 'white'}/>
                </AnimatedPressable>
            </View>
            <Pressable 
                    className="absolute justify-center items-center bg-black rounded-xl z-10"
                    style={{ top: 48, left: 16, height: 40, width: 40 }}
                    onPress={() => router.back()}
                >
                    <Ionicons  name='chevron-back' size={30} color={'white'}/>
            </Pressable>
        </SafeAreaView>
    )
}

export default DetailScreen