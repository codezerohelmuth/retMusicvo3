
'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useContext, useState, type ReactNode } from "react";
import { PlaylistContext } from "@/context/playlist-context";
import { Loader2 } from "lucide-react";


export function CreatePlaylistDialog({ children }: { children: ReactNode }) {
    const { createPlaylist } = useContext(PlaylistContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        await createPlaylist(name, description);
        setLoading(false);
        setName('');
        setDescription('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create a new playlist</DialogTitle>
                <DialogDescription>
                    Give your playlist a name and an optional description. Let AI create one for you if you leave it blank.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Playlist Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Playlist" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A playlist for..." />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
