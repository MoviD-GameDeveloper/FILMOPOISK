import { Pressable, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export function RequestComponent({title, index, deleteRequest, SetQuery} : {title : string; index : number; deleteRequest:  (id: number) => void; SetQuery: (title: string) => void ; }){
    return(
        <Pressable 
            onPress={() => SetQuery(title)} 
            android_ripple={{
                color: 'rgba(23, 21, 21, 0.3)',
                borderless: false,
            }}
            className="rounded-[5px]  w-full h-[40px] px-[5] my-[15] justify-center "
        >
            <Ionicons className="absolute top-50% left-0 " name="timer-outline" size={23} color={'#d8d8e0'}/>
            <Text className="px-[30px]   text-[#EFEFF1] ">{title}</Text>
            <Pressable onPress={() => deleteRequest(index)} className="absolute top-50% right-2">
                <Ionicons  name='close-sharp' size={25} color={'#d8d8e0'}/>
            </Pressable> 
        </Pressable>
    )
}