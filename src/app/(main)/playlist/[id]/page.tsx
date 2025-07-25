
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Download, MoreHorizontal, Play, PlusCircle, Music, Mic2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useContext } from 'react';
import { PlayerContext, type Track } from '@/context/player-context';
import { PlaylistContext } from '@/context/playlist-context';
import { notFound } from 'next/navigation';


export default function PlaylistPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { playTrack } = useContext(PlayerContext);
  const { playlists } = useContext(PlaylistContext);

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return notFound();
  }
  
  const handlePlayTrack = (track: Track) => {
    playTrack(track, playlist.tracks);
  };
  
  const handlePlayPlaylist = () => {
      if(playlist.tracks && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0], playlist.tracks);
      }
  }

  // In a real app, you would fetch playlist data using params.id
  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row items-center md:items-end gap-6">
        <Image
          src={playlist.coverUrl || "https://placehold.co/250x250"}
          alt={playlist.name}
          width={250}
          height={250}
          className="rounded-lg shadow-2xl aspect-square object-cover"
          data-ai-hint="abstract music"
        />
        <div className="space-y-3 text-center md:text-left">
          <Badge variant="outline">Playlist</Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold">{playlist.name}</h1>
          <p className="text-muted-foreground">{playlist.description}</p>
          <p className="text-sm">
            Created by <span className="font-semibold text-primary">{playlist.creator}</span> • {playlist.tracks.length} songs
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <Button size="icon" className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90" onClick={handlePlayPlaylist} disabled={!playlist.tracks || playlist.tracks.length === 0}>
            <Play className="h-7 w-7 fill-primary-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-8 w-8 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-6 w-6 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-6 w-6 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
        
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Album</TableHead>
                <TableHead className="text-right">
                  <Clock className="h-4 w-4 inline-block" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlist.tracks.map((track, index) => (
                <TableRow key={track.id} className="group cursor-pointer" onClick={() => handlePlayTrack(track)}>
                  <TableCell className="text-muted-foreground">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="hidden h-4 w-4 group-hover:block" />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-muted-foreground">{track.artist}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{"Album Name"}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{"3:30"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <Music className="w-12 h-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">This playlist is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can add songs to this playlist from the search page.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
