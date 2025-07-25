
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';
import { PlayerContext, type Track } from '@/context/player-context';

const featuredPlaylists = [
  { id: '1', name: 'Today\'s Top Hits', description: 'The most played tracks right now.', imageUrl: 'https://images.unsplash.com/photo-1616696893221-0c2578f5b7cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b3AlMjBoaXQlMjBzb25ncyUyMHxlbnwwfHx8fDE3NTMzNzg0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'abstract music' },
  { id: '2', name: 'RapCaviar', description: 'The freshest rap and hip-hop.', imageUrl: 'https://images.unsplash.com/photo-1614573879558-60766894170d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxyYXAlMjBjYWllcnxlbnwwfHx8fDE3NTMzNzg1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'urban graffiti' },
  { id: '3', name: 'lofi beats', description: 'Chill beats to relax/study to.', imageUrl: 'https://images.unsplash.com/photo-1630713815150-2c847025c1d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb2ZpfGVufDB8fHx8MTc1MzM3ODU1MXww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'cozy room' },
  { id: '4', name: 'Rock Classics', description: 'Legends of rock.', imageUrl: 'https://images.unsplash.com/photo-1618972677328-9cd129a74c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyb2NrJTIwY2xhc3NpY3N8ZW58MHx8fHwxNzUzMzc4NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'guitar concert' },
];

const mockTracks: Track[] = [
    { id: '3JZ_D3ELwOQ', title: 'lofi hip hop radio - beats to relax/study to', artist: 'Lofi Girl', thumbnailUrl: `https://i.ytimg.com/vi/3JZ_D3ELwOQ/default.jpg` },
    { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to sleep/chill to', artist: 'Lofi Girl', thumbnailUrl: `https://i.ytimg.com/vi/jfKfPfyJRdk/default.jpg` },
    { id: 'DWcJFNfaw9c', title: '24/7 lofi hip hop radio - beats to relax/study to', artist: 'Lofi Girl', thumbnailUrl: `https://i.ytimg.com/vi/DWcJFNfaw9c/default.jpg` },
    { id: '5qap5aO4i9A', title: '1 A.M Study Session - lofi beats to study/relax to', artist: 'Lofi Girl', thumbnailUrl: `https://i.ytimg.com/vi/5qap5aO4i9A/default.jpg` },
  ];

const recentlyPlayed: Track[] = [
  { id: '3JZ_D3ELwOQ', title: 'Blinding Lights', artist: 'The Weeknd', thumbnailUrl: 'https://images.unsplash.com/photo-1603239699097-dfc6ea19f632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8dGhlJTIwd2Vla25kfGVufDB8fHx8MTc1MzM3NDg3NXww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "neon lights" },
  { id: 'jfKfPfyJRdk', title: 'As It Was', artist: 'Harry Styles', thumbnailUrl: 'https://images.unsplash.com/photo-1658459681470-627c81aeb7a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8aGFycnklMjBzdHlsZXN8ZW58MHx8fHwxNzUzNDA5NjgxfDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "vintage door" },
  { id: 'DWcJFNfaw9c', title: 'Good 4 U', artist: 'Olivia Rodrigo', thumbnailUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8Z29vZCUyMGZvciUyMHlvdXxlbnwwfHx8fDE3NTM0MDk3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "teenager room" },
  { id: '5qap5aO4i9A', title: 'Levitating', artist: 'Dua Lipa', thumbnailUrl: 'https://images.unsplash.com/photo-1638347419042-40d24bb64d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkdWElMjBsaXBhJTIwfGVufDB8fHx8MTc1MzM3ODU3MHww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "disco ball" },
  { id: 'r_p9f2s4-nI', title: 'Peaches', artist: 'Justin Bieber', thumbnailUrl: 'https://images.unsplash.com/photo-1730198887559-0c09bedfc4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxuaWdodHMlMjB8ZW58MHx8fHwxNzUzNDA5NzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "peach fruit" },
  { id: 'av5B1b4s2sM', title: 'Stay', artist: 'The Kid LAROI', thumbnailUrl: 'https://images.unsplash.com/photo-1516916759473-600c07bc12d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb25nc3xlbnwwfHx8fDE3NTM0MDk3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: "couple sunset" },
];

export default function HomePage() {
  const { playTrack } = useContext(PlayerContext);

  const handlePlayPlaylist = (playlistId: string) => {
    // In a real app, you'd fetch the playlist's tracks
    // For now, we'll use a mock list
    playTrack(mockTracks[0], mockTracks);
  };
  
  const handlePlayTrack = (track: Track) => {
    playTrack(track, recentlyPlayed);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-headline font-bold mb-4">Good Afternoon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredPlaylists.map((item) => (
             <Card key={item.id} className="bg-card/50 hover:bg-card/80 transition-colors group border-0 shadow-none">
              <CardContent className="p-0 flex items-center gap-4">
                <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="rounded-l-md w-20 h-20 object-cover" data-ai-hint={item.dataAiHint} />
                <h3 className="font-semibold flex-1 pr-4">{item.name}</h3>
                <Button size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity mr-4 shrink-0" onClick={() => handlePlayPlaylist(item.id)}>
                  <Play className="fill-background" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recentlyPlayed.map((item) => (
            <div key={item.id} className="group">
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <CardContent className="p-0 relative">
                  <Image src={item.thumbnailUrl} alt={item.title} width={400} height={400} className="w-full aspect-square object-cover rounded-lg group-hover:brightness-75 transition-all" data-ai-hint={item.dataAiHint || "album art"} />
                  <Button size="icon" className="absolute bottom-2 right-2 h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" onClick={() => handlePlayTrack(item)}>
                    <Play className="h-6 w-6 fill-background" />
                  </Button>
                </CardContent>
              </Card>
              <div className="mt-2">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
