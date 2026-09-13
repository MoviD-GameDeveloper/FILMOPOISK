import React, { useCallback, useState } from "react";
import { View } from "react-native";
import YoutubePlayer from 'react-native-youtube-iframe';

export function TrailerVideo({ width, videoId }: { width: string; videoId: string }) {
    const [playing, setPlaying] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
            setTimeout(() => {
                setPlaying(true);
            }, 50);
        }
    }, []);

    return (
        <View className="w-full h-[200px] overflow-hidden">
            <YoutubePlayer
                height={Number(width) * 2.3}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                pointerEvents="none" 
                initialPlayerParams={{
                    controls: false,         
                    loop: true,
                    playlist: videoId,     
                    modestbranding: true,   
                    rel: false,             
                    preventFullScreen: true, 
                    iv_load_policy: 3,    
                    color: 'white',
                }}
                onReady={() => {
                    setIsReady(true);
                    setHasError(false);
                    setPlaying(true);
                }}
                onError={() => {
                    setHasError(true);
                    setIsReady(false);
                }}
            />
        </View>
    );
}