import { create } from "zustand";
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SearchStore {
    searchStory: string[];
    addRequest: (title: string) => void;
    deleteRequest: (index: number) => void;
}

export const useSearchStore = create<SearchStore>()(
    persist(
        (set, get) => ({
            searchStory: [],

            addRequest: (title: string) => {
                const { searchStory } = get();
                const filteredStory = searchStory.filter(item => item !== title);
                
                set({
                    searchStory: produce(filteredStory, (draft) => {
                        draft.unshift(title); 
                    })
                });
            },

            deleteRequest: (index: number) => {
                const { searchStory } = get();
                set({
                    searchStory: produce(searchStory, (draft) => {
                        draft.splice(index, 1); 
                    })
                });
            }
        }),
        {
            name: 'search-story',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSearchStore;