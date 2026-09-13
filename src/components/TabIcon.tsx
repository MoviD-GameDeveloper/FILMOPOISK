import { View, Text } from "react-native";
import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabIconProps {
  color: string;
  focused: boolean;
  size: number;
  icon: ComponentProps<typeof Ionicons>['name']; 
  panelHeight?: number;
  label: string
}

export function TabIcon({color, focused, icon, panelHeight=70, label} : TabIconProps){
    const circleSize = panelHeight * 0.9;
    return (
        <View style={{ height: panelHeight }} className="h-full  items-center justify-center">
            <View 
            style={{ width: circleSize, height: circleSize }}
            className={"items-center justify-center"}
            //className={focused ? "bg-[#49248a] rounded-full items-center justify-center" : "items-center justify-center"}
        >
            <Ionicons name={icon} size={focused ? 22 : 20} color={color} />
            <Text style={{ fontSize: 10 }} className="text-gray-600 mt-0.5 ">{label}</Text>
        </View>
        </View>
    )
}