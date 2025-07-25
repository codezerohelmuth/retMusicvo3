
'use client';

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export interface Track {
  id: string; // videoId
  title: string;
  artist: string; // author
  thumbnailUrl: string;
}

interface PlayerState {
    track: Track | null;
    queue: Track[];
    originalQueue: Track[];
    currentIndex: number;
    isPlaying: boolean;
    isShuffled: boolean;
    isRepeated: boolean;
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  shuffle: () => void;
  repeat: () => void;
  setState: (newState: Partial<PlayerState> | ((prevState: PlayerState) => PlayerState)) => void;
}

const initialState: PlayerState = {
    track: null,
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    isPlaying: false,
    isShuffled: false,
    isRepeated: false,
};

export const PlayerContext = createContext<PlayerContextType>({
    ...initialState,
    playTrack: () => {},
    play: () => {},
    pause: () => {},
    nextTrack: () => {},
    prevTrack: () => {},
    shuffle: () => {},
    repeat: () => {},
    setState: () => {},
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [playerState, setPlayerState] = useLocalStorage<PlayerState>('playerState', initialState);

  const setState = useCallback((newState: Partial<PlayerState> | ((prevState: PlayerState) => PlayerState)) => {
    setPlayerState(prev => (typeof newState === 'function' ? newState(prev) : { ...prev, ...newState }));
  }, [setPlayerState]);

  const playTrack = useCallback((newTrack: Track, newQueue: Track[] = []) => {
    const fullQueue = newQueue.length > 0 ? newQueue : [newTrack];
    const trackIndex = fullQueue.findIndex(t => t.id === newTrack.id);

    setState(prev => ({
        ...prev,
        track: newTrack,
        queue: fullQueue,
        originalQueue: fullQueue,
        currentIndex: trackIndex,
        isPlaying: true,
        isShuffled: prev.isShuffled ? true : false,
    }));
  }, [setState]);

  const play = useCallback(() => {
    if (playerState.track) setState({ isPlaying: true });
  }, [playerState.track, setState]);

  const pause = useCallback(() => {
    setState({ isPlaying: false });
  }, [setState]);

  const nextTrack = useCallback(() => {
    setState(prevState => {
      const { queue, currentIndex, isRepeated } = prevState;
      if (!queue.length) return prevState;
      
      if (isRepeated) {
        return { ...prevState, track: { ...queue[currentIndex] }, isPlaying: true };
      }
  
      let nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = 0; 
      }
      
      if (queue[nextIndex]) {
          return {
              ...prevState,
              currentIndex: nextIndex,
              track: queue[nextIndex],
              isPlaying: true,
          };
      } 
      
      return { ...prevState, isPlaying: false, track: null, currentIndex: -1 };
    });
  }, [setState]);

  const prevTrack = useCallback(() => {
    setState(prevState => {
      const { queue, currentIndex } = prevState;
      if (!queue.length) return prevState;

      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = queue.length - 1; 
      }
      return {
          ...prevState,
          currentIndex: prevIndex,
          track: queue[prevIndex],
          isPlaying: true,
      };
    });
  }, [setState]);
  
  const shuffle = useCallback(() => {
    setState(prevState => {
      const { track, originalQueue, isShuffled } = prevState;
      if (!track) return prevState;
      
      const willBeShuffled = !isShuffled;
      if (willBeShuffled) {
        const shuffledQueue = [...originalQueue].sort(() => Math.random() - 0.5);
        // Ensure the currently playing track is first to not interrupt playback
        const currentTrackIndex = shuffledQueue.findIndex(t => t.id === track.id);
        if (currentTrackIndex > -1) {
            const [currentTrackItem] = shuffledQueue.splice(currentTrackIndex, 1);
            shuffledQueue.unshift(currentTrackItem);
        }
        
        return {
          ...prevState,
          queue: shuffledQueue,
          currentIndex: 0,
          isShuffled: true,
        };
      } else {
          const newIndex = originalQueue.findIndex(t => t.id === track.id);
          return {
              ...prevState,
              queue: originalQueue,
              currentIndex: newIndex,
              isShuffled: false
          };
      }
    });
  }, [setState]);

  const repeat = useCallback(() => {
    setState(prevState => ({ ...prevState, isRepeated: !prevState.isRepeated }));
  }, [setState]);


  return (
    <PlayerContext.Provider value={{ 
        ...playerState, 
        playTrack, 
        play, 
        pause, 
        nextTrack, 
        prevTrack, 
        shuffle, 
        repeat,
        setState,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
