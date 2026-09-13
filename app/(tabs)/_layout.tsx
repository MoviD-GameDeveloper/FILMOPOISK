import { Tabs, usePathname } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from "@/src/components/TabIcon";
import { Dimensions } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

const {width} = Dimensions.get('window')
const panelHeight = 70
const tabCount = 3
const circleSize = 60
const tabBarWidth = width - 60
const tabWidth = tabBarWidth / tabCount

export default function RootLayout(){
     const insets = useSafeAreaInsets()
    const pathname = usePathname();
    const translateX = useSharedValue(
        (tabBarWidth - circleSize) /2
    );
    let activeIndex = 0;
    if (pathname.includes("/search")) {
        activeIndex = 1;
    } else if (pathname.includes("/favorite")) {
        activeIndex = 2;
    }

    useEffect(() => {
        const x = activeIndex * tabWidth + (tabWidth - circleSize) / 2;
        translateX.value = withSpring(x,{
            damping: 100,
            stiffness: 900,
        })
    }, [activeIndex])

    const animatedCircleStyle  = useAnimatedStyle(() => {
        return{
            transform : [
                {
                    translateX: translateX.value
                },
            ]
        }
    })

    return(
        <Tabs 
            screenOptions={{
                headerShown:false,
                tabBarInactiveTintColor: '#70707C',
                tabBarActiveTintColor: '#A970FF',
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    marginHorizontal: 30,
                    bottom: 1 +  insets.bottom,
                    right: 20,
                    left: 20,
                    borderRadius: 30,
                    height: panelHeight,
                    paddingBottom: 0,
                    paddingTop: 0,    
                    borderTopWidth: 0,
                    backgroundColor: '#121214',
                },
                tabBarItemStyle: {
                    paddingVertical: 15,
                    justifyContent: "center",
                    alignItems: 'center',
                },
                tabBarBackground: () => (
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: (panelHeight - circleSize) / 2,
                                width: circleSize,
                                height: circleSize,
                                borderRadius: circleSize/2,
                                backgroundColor: '#49248a',
                            },
                            animatedCircleStyle
                        ]}
                    />
                    
                ),
            }}
        >
            <Tabs.Screen 
                name="index"
                options={{
                    title: 'Главная', 
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon color={color} focused={focused} size={size} icon={"home"} panelHeight={panelHeight} label={'Главная'}/>
                    ),
                }}
            />
            <Tabs.Screen 
                name="search"
                options={{
                    title: 'Поиск', 
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon color={color} focused={focused} size={size} icon={"search"}  panelHeight={panelHeight} label={'Поиск'}/>
                    ),
                }}
            />
            <Tabs.Screen 
                name="favorite"
                options={{
                    title: 'Избранное', 
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon color={color} focused={focused} size={size} icon={"heart"}  panelHeight={panelHeight} label={'Избранное'}/>
                    ),
                }}
            />
        </Tabs>
    )
}