
'use client';
import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListMusic, Music } from "lucide-react";
import { PlaylistContext } from '@/context/playlist-context';
import Link from 'next/link';
import Image from 'next/image';

export default function LibraryPage() {
    const { playlists } = useContext(PlaylistContext);

    return (
      <div className="space-y-8">
        <section>
          <h1 className="text-4xl font-headline font-bold mb-2">Your Library</h1>
          <p className="text-muted-foreground text-lg">All your favorite music in one place.</p>
        </section>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {playlists.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="group">
                <Card className="overflow-hidden h-full transition-colors hover:bg-card/60">
                  <CardContent className="p-4 flex flex-col gap-4">
                    <Image
                        src={playlist.coverUrl || "https://placehold.co/400x400"}
                        alt={playlist.name}
                        width={400}
                        height={400}
                        className="w-full aspect-square object-cover rounded-md"
                        data-ai-hint="abstract music"
                    />
                    <div>
                      <h3 className="font-semibold truncate">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">By {playlist.creator}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <Music className="w-12 h-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Your library is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a new playlist to get started.
            </p>
          </div>
        )}
      </div>
    );
  }
