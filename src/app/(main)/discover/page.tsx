
'use client';
import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Music, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlayerContext, type Track } from '@/context/player-context';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getChannelVideos } from '@/services/youtube';


const LOFI_GIRL_CHANNEL_ID = 'UCSJ4gkVC6NrvII8umztf0Ow'; // Corrected Lofi Girl Channel ID

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const { toast } = useToast();
  const { playTrack } = useContext(PlayerContext);
  
  useEffect(() => {
    let isCancelled = false;

    const fetchLofiGirlVideos = async () => {
      setLoading(true);
      try {
        const results = await getChannelVideos(LOFI_GIRL_CHANNEL_ID);
        if (!isCancelled) {
          setTracks(results);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error fetching videos",
            description: (error as Error).message || "There was an issue fetching videos. Please check your API key.",
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchLofiGirlVideos();

    return () => {
      isCancelled = true;
    };

  }, [toast]);


  const handlePlayTrack = (track: Track) => {
    playTrack(track, tracks);
  };
  
  const handlePlayAll = () => {
      if(tracks && tracks.length > 0) {
        playTrack(tracks[0], tracks);
      }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row items-center md:items-end gap-6">
         <Image
          src="https://yt3.googleusercontent.com/ytc/AIdro_k9_Ft3QWCi4tBCgB6a422aD4b1cTfB45hA_w_4-A=s176-c-k-c0x00ffffff-no-rj"
          alt="Lofi Girl"
          width={200}
          height={200}
          className="rounded-full shadow-2xl aspect-square object-cover"
          data-ai-hint="lofi girl avatar"
        />
        <div className="space-y-3 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold">Lofi Girl Radio</h1>
            <p className="text-muted-foreground text-lg">Beats to relax/study to. The best from the official Lofi Girl channel.</p>
            <Button onClick={handlePlayAll} disabled={loading || tracks.length === 0}>
                <Play className="mr-2"/>
                Play All
            </Button>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
      )}

      {!loading && tracks.length > 0 && (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <div key={track.id} className="group">
              <Card className="overflow-hidden border-0 bg-transparent shadow-none">
                <CardContent className="p-0 relative">
                  <Image src={track.thumbnailUrl} alt={track.title} width={400} height={400} className="w-full aspect-square object-cover rounded-lg group-hover:brightness-75 transition-all" data-ai-hint={"lofi music"} />
                  <Button size="icon" className="absolute bottom-2 right-2 h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" onClick={() => handlePlayTrack(track)}>
                    <Play className="h-6 w-6 fill-background" />
                  </Button>
                </CardContent>
              </Card>
              <div className="mt-2">
                <h3 className="font-semibold truncate">{track.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
