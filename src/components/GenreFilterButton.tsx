import { Text, Pressable } from "react-native";
import useHomeStore from "../store/useHomeStore";

type Genre = [string, string];

type GenreFilterButtonProps = {
    name: Genre;
    genresFilter: (name: Genre) => void;
};

export function GenreFilterButton({
    name,
    genresFilter,
}: GenreFilterButtonProps) {
    const isSelected = useHomeStore(
        state => state.currentGenre === name[0]
    );
    const setSelectedGenre = useHomeStore(
        state => state.setCurrentGenre
    );

    return (
        <Pressable
            className={`${isSelected ?  'bg-[#49248a]'  : 'bg-[#9146FF]'} rounded-[10px] px-[14px] py-[10px] active:bg-[#A970FF]`}
            onPress={() => {
                setSelectedGenre(name[0]);
                genresFilter(name);
            }}
        >
            <Text className="text-white">{name[1]}</Text>
        </Pressable>
    );
}