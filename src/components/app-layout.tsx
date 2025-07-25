
'use client';
import { type ReactNode, useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { Player } from '@/components/player';
import { PlayerProvider } from '@/context/player-context';
import { PlaylistProvider } from '@/context/playlist-context';

export function AppLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can render a loader here or nothing until the component is mounted
    return null; 
  }

  return (
    <PlayerProvider>
      <PlaylistProvider>
        <SidebarProvider>
          <div className="relative flex h-screen w-full flex-col">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar>
                <AppSidebar />
              </Sidebar>
              <SidebarInset className="flex flex-col">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  {children}
                </main>
              </SidebarInset>
            </div>
            <Player />
          </div>
        </SidebarProvider>
      </PlaylistProvider>
    </PlayerProvider>
  );
}
