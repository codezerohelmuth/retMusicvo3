
'use client';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ListMusic, Volume2, Maximize2, VolumeX, Volume1, Plus, Mic2 } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import YouTube, { type YouTubePlayer } from 'react-youtube';
import { PlayerContext } from '@/context/player-context';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaylistContext } from '@/context/playlist-context';
import { useToast } from '@/hooks/use-toast';
import { ExplainLyricsDialog } from './explain-lyrics-dialog';

export function Player() {
  const { track, isPlaying, play, pause, nextTrack, prevTrack, shuffle, repeat, isShuffled, isRepeated } = useContext(PlayerContext);
  const { playlists, addTrackToPlaylist } = useContext(PlaylistContext);
  const { toast } = useToast();
  const playerRef = useRef<YouTubePlayer | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerRef.current) {
      interval = setInterval(async () => {
        const currentTime = await playerRef.current?.getCurrentTime();
        const videoDuration = await playerRef.current?.getDuration();
        setProgress(currentTime);
        setDuration(videoDuration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);
  
  const handleReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    if (isPlaying) {
      playerRef.current?.playVideo();
    }
  };

  const handleStateChange = (event: { data: number }) => {
    if (event.data === 0) { // Ended
      nextTrack();
    }
  };
  
  const handlePlayPause = () => {
    if (!track) return;
    if (isPlaying) {
      playerRef.current?.pauseVideo();
      pause();
    } else {
      playerRef.current?.playVideo();
      play();
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value[0], true);
      setProgress(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return isNaN(mins) || isNaN(secs) ? '0:00' : `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleAddTrackToPlaylist = (playlistId: string) => {
    if (track) {
      const playlist = playlists.find(p => p.id === playlistId);
      addTrackToPlaylist(playlistId, track);
      toast({
        title: "Track added",
        description: `"${track.title}" has been added to "${playlist?.name}".`,
      });
    }
  };
  
  const PlayerIcon = isPlaying ? Pause : Play;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  if (!track) {
    return (
      <footer className="relative z-20 flex-shrink-0 border-t bg-background/95 backdrop-blur-sm">
        <div className="grid h-24 grid-cols-3 items-center px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-muted" />
            <div>
              <h3 className="font-semibold font-headline truncate">No song selected</h3>
              <p className="text-sm text-muted-foreground truncate">Select a song to play</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button disabled variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button disabled variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button disabled variant="default" size="icon" className="h-12 w-12 rounded-full">
                <Play className="h-6 w-6 fill-background" />
              </Button>
              <Button disabled variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button disabled variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Repeat className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
              <span>0:00</span>
              <Slider disabled defaultValue={[0]} max={100} step={1} className="w-full" />
              <span>0:00</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {/* Controls on the right side */}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-20 flex-shrink-0 border-t bg-background/95 backdrop-blur-sm">
      <div className="hidden">
        <YouTube
          key={track.id}
          videoId={track.id}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={(e) => console.error('YouTube Player Error:', e.data)}
        />
      </div>
      <div className="grid h-24 grid-cols-3 items-center px-4">
        <div className="flex items-center gap-4 min-w-0">
          <Image
            src={track.thumbnailUrl || "https://placehold.co/64x64"}
            alt={track.title}
            width={56}
            height={56}
            className="rounded-md"
            data-ai-hint="album cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold font-headline truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                  {playlists.map(playlist => (
                      <DropdownMenuItem key={playlist.id} onSelect={() => handleAddTrackToPlaylist(playlist.id)}>
                          Add to {playlist.name}
                      </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-foreground", isShuffled && "text-primary")} onClick={shuffle}>
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={prevTrack}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={handlePlayPause}>
              <PlayerIcon className={cn("h-6 w-6", { "fill-background": isPlaying, "ml-0": isPlaying, "ml-1": !isPlaying })} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={nextTrack}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-foreground", isRepeated && "text-primary")} onClick={repeat}>
              <Repeat className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <Slider value={[progress]} max={duration || 1} step={1} onValueChange={handleSeek} className="w-full" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <ExplainLyricsDialog>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled={!track}>
              <Mic2 className="h-5 w-5" />
              <span className="sr-only">Explain Lyrics</span>
            </Button>
          </ExplainLyricsDialog>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ListMusic className="h-5 w-5" />
          </Button>
          <div className="flex w-32 items-center gap-2">
            <VolumeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setVolume(v => v > 0 ? 0 : 50)} />
            <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
