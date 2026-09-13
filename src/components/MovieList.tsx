import { ActivityIndicator, FlatList, View } from "react-native";
import { MovieCard } from "./MovieCard";
import useHomeStore from "../store/useHomeStore";
import { Movie } from "../store/useHomeStore";

type MovieListProps = {
    films: Movie[];
    inSearch?: string;
    isEndlessList: boolean;
    loadMore?: () => void;
    isFetchingNextPage?: boolean;
};

function MovieList({
    films,
    inSearch = '',
    isEndlessList,
    loadMore,
    isFetchingNextPage,
}: MovieListProps) {
    const getGenreName = useHomeStore(state => state.getGenreName);

    return (
        <FlatList
            className="flex-1"
            data={films}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperClassName="justify-center gap-2 p-2"
            contentContainerClassName="gap-2 p-2 pb-32"
            onEndReached={isEndlessList ? loadMore : undefined}
            onEndReachedThreshold={isEndlessList ? 0.4 : undefined}
            ListFooterComponent={
                isEndlessList && isFetchingNextPage ? (
                    <View className="py-4 items-center">
                        <ActivityIndicator size="small" color="#9146FF" />
                    </View>
                ) : null
            }
            renderItem={({ item }) => (
                <MovieCard
                    id={item.id}
                    title={item.title}
                    year={item.year!}
                    genre={getGenreName(item.genres) ?? "Неизвестный жанр"}
                    poster={item.poster ?? ""}
                    rating={item.rating}
                    inSearch={inSearch}
                />
            )}
        />
    );
}

export default MovieList;