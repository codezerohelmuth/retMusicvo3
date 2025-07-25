
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Home, Music, Search, Compass, ListMusic, Plus } from 'lucide-react';
import { useContext } from 'react';
import { PlaylistContext } from '@/context/playlist-context';
import { CreatePlaylistDialog } from './create-playlist-dialog';
import { ExplainLyricsDialog } from './explain-lyrics-dialog';
import { PlayerContext } from '@/context/player-context';


function VinylIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

export function AppSidebar() {
  const pathname = usePathname();
  const { playlists } = useContext(PlaylistContext);
  const { track } = useContext(PlayerContext);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <VinylIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">Ret-Music</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'}>
              <Link href="/">
                <Home />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/discover')}>
              <Link href="/discover">
                <Compass />
                Discover
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/search')}>
              <Link href="/search">
                <Search />
                Search
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/library')}>
              <Link href="/library">
                <ListMusic />
                Your Library
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-4" />
        <SidebarGroup>
        <SidebarGroupLabel>Playlists</SidebarGroupLabel>
        <SidebarMenu>
            {playlists.map((playlist) => (
            <SidebarMenuItem key={playlist.id}>
                <SidebarMenuButton asChild isActive={pathname === `/playlist/${playlist.id}`}>
                <Link href={`/playlist/${playlist.id}`}>
                    <Music />
                    {playlist.name}
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <CreatePlaylistDialog>
                <SidebarMenuButton variant="ghost">
                    <Plus/>
                    New Playlist
                </SidebarMenuButton>
                </CreatePlaylistDialog>
            </SidebarMenuItem>
        </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ExplainLyricsDialog>
            <SidebarMenuButton variant="ghost" disabled={!track}>
                Explain Lyrics
            </SidebarMenuButton>
        </ExplainLyricsDialog>
      </SidebarFooter>
    </>
  );
}
