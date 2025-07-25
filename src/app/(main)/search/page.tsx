
'use client';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Plus } from 'lucide-react';
import Image from 'next/image';
import { PlayerContext, type Track } from '@/context/player-context';
import { PlaylistContext } from '@/context/playlist-context';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { searchYouTube } from '@/services/youtube';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<Track[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { playTrack } = useContext(PlayerContext);
    const { playlists, addTrackToPlaylist } = useContext(PlaylistContext);
    const { toast } = useToast();
  
    useEffect(() => {
        let isCancelled = false;

        const fetchResults = async () => {
            if (query) {
                setLoading(true);
                setResults(null);
                try {
                    const searchData = await searchYouTube(query);
                    if (!isCancelled) {
                      setResults(searchData);
                    }
                } catch (error) {
                    if (!isCancelled) {
                      console.error('Search Error:', error);
                      toast({
                          variant: "destructive",
                          title: "Search failed",
                          description: (error as Error).message || "Could not fetch search results. Please check your API key.",
                      });
                    }
                } finally {
                    if (!isCancelled) {
                      setLoading(false);
                    }
                }
            } else {
                setResults([]);
            }
        };

        fetchResults();

        return () => {
          isCancelled = true;
        };
    }, [query, toast]);
    
    const handlePlayTrack = (track: Track) => {
        playTrack(track, results || []);
    };

    const handleAddTrackToPlaylist = (playlistId: string, track: Track) => {
      addTrackToPlaylist(playlistId, track);
      const playlist = playlists.find(p => p.id === playlistId);
      toast({
        title: "Track added",
        description: `"${track.title}" has been added to "${playlist?.name}".`,
      });
    };

    if (!query) {
      return <div className="text-center text-muted-foreground mt-10">Please enter a search term to begin.</div>;
    }

    if (loading) {
        return (
          <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary"/>
          </div>
        );
    }
    
    if (!results || results.length === 0) {
        return <div className="text-center text-muted-foreground mt-10">No results found for "{query}".</div>
    }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline font-bold">Search results for "{query}"</h1>

      <section>
          <h2 className="text-2xl font-headline font-bold mb-4">Tracks</h2>
          <div className="space-y-2">
              {results.map((track) => (
                  <div key={track.id} className="flex items-center p-2 rounded-md hover:bg-muted/50 group">
                      <div className="flex items-center flex-1 cursor-pointer min-w-0" onClick={() => handlePlayTrack(track)}>
                          <Image
                              src={track.thumbnailUrl}
                              alt={track.title || ""}
                              width={80}
                              height={60}
                              className="rounded-md mr-4 aspect-video object-cover"
                              data-ai-hint="music video"
                          />
                          <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{track.title}</p>
                              <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span>{track.artist}</span>
                              </div>
                          </div>
                      </div>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100">
                                  <Plus />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                               {playlists.length > 0 ? (
                                playlists.map(playlist => (
                                  <DropdownMenuItem key={playlist.id} onSelect={() => handleAddTrackToPlaylist(playlist.id, track)}>
                                      Add to {playlist.name}
                                  </DropdownMenuItem>
                                ))
                               ) : (
                                <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
                               )}
                          </DropdownMenuContent>
                      </DropdownMenu>
                      <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => handlePlayTrack(track)}>
                          <Play />
                      </Button>
                  </div>
              ))}
          </div>
        </section>
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading search results...</div>}>
            <SearchResults />
        </Suspense>
    )
}
