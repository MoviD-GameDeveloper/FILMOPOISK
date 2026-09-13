import { QueryClient ,QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import '../global.css';
import { useEffect } from 'react';
import useHomeStore from '@/src/store/useHomeStore';

export default function RootLayout(){
    const queryClient = new QueryClient();

    useEffect(() => {
        useHomeStore.getState().loadGenres()
    },[])

    return(
        <QueryClientProvider client={queryClient}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="[id]" options={{ headerShown: false }} />
            </Stack>
        </QueryClientProvider>
    )
}

