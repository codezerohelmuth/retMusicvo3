
'use client';
import { createContext, useState, ReactNode, useCallback } from "react";
import type { Track } from "./player-context";
import { generatePlaylistDescription } from "@/ai/flows/generate-playlist-description";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    creator: string;
    coverUrl?: string;
    tracks: Track[];
}

interface PlaylistContextType {
    playlists: Playlist[];
    createPlaylist: (name: string, description?: string) => Promise<void>;
    addTrackToPlaylist: (playlistId: string, track: Track) => void;
}

const mockTracks: Track[] = [
    { id: '3JZ_D3ELwOQ', title: 'lofi hip hop radio - beats to relax/study to', artist: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/default.jpg' },
    { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to sleep/chill to', artist: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/default.jpg' },
    { id: 'DWcJFNfaw9c', title: '24/7 lofi hip hop radio - beats to relax/study to', artist: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/default.jpg' },
    { id: '5qap5aO4i9A', title: '1 A.M Study Session - lofi beats to study/relax to', artist: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/default.jpg' },
];

const defaultPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'My Supermix',
      description: 'An endless mix of music based on your favorite songs.',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMG1peHxlbnwwfHx8fDE3NTM0ODU2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      creator: 'Ret-Music',
      tracks: mockTracks.slice(0,2)
    },
    { id: '2', name: 'My Mix 1', description: "A personalized mix of songs, perfect for you.", coverUrl: 'https://images.unsplash.com/photo-1516971125232-c15842a297a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGlsbCUyMG11c2ljfGVufDB8fHx8MTc1MzQ4NTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080', creator: 'Ret-Music', tracks: mockTracks.slice(2,4) },
    { id: '3', name: 'My Mix 2', description: "Discover new tracks and enjoy old favorites.", coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMG11c2ljfGVufDB8fHx8MTc1Mzc0NzE2Nnww&ixlib=rb-4.1.0&q=80&w=1080', creator: 'Ret-Music', tracks: [] },
    { id: '4', name: 'My Mix 3', description: "Your weekly dose of fresh music.", coverUrl: 'https://images.unsplash.com/photo-1619983081593-e22f5899fa24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwwfHx8fDE3NTM3NDcxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080', creator: 'Ret-Music', tracks: [] },
    { id: '5', name: 'My Mix 4', description: "A mix of songs to get you through the day.", coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb2NrJTIwbXVzaWN8ZW58MHx8fHwxNzUzNzQ3MjE5fDA&ixlib=rb-4.1.0&q=80&w=1080', creator: 'Ret-Music', tracks: [] },
  ];
  

export const PlaylistContext = createContext<PlaylistContextType>({
    playlists: [],
    createPlaylist: async () => {},
    addTrackToPlaylist: () => {},
});

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
    const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('playlists', defaultPlaylists);

    const createPlaylist = useCallback(async (name: string, description?: string) => {
        let generatedDescription = description || '';
        if (!description) {
            try {
                const result = await generatePlaylistDescription({
                    playlistName: name,
                    songs: [], // no songs yet
                });
                generatedDescription = result.playlistDescription;
            } catch (error) {
                console.error("Failed to generate playlist description", error);
                generatedDescription = "A new playlist.";
            }
        }

        const newPlaylist: Playlist = {
            id: (playlists.length + 1 + Date.now()).toString(), // more unique id
            name,
            description: generatedDescription,
            creator: 'You',
            tracks: [],
        };
        setPlaylists([...playlists, newPlaylist]);
    }, [playlists, setPlaylists]);

    const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId) {
                // Avoid adding duplicate tracks
                if (p.tracks.some(t => t.id === track.id)) {
                    return p;
                }
                return { ...p, tracks: [...p.tracks, track] };
            }
            return p;
        });
        setPlaylists(newPlaylists);
    }, [playlists, setPlaylists]);

    return (
        <PlaylistContext.Provider value={{ playlists, createPlaylist, addTrackToPlaylist }}>
            {children}
        </PlaylistContext.Provider>
    );
}
