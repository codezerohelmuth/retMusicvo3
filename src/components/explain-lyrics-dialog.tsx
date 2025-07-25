
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
import { Textarea } from "./ui/textarea";
import { useContext, useState, type ReactNode } from "react";
import { Loader2, Mic2 } from "lucide-react";
import { PlayerContext } from "@/context/player-context";
import { explainLyrics, ExplainLyricsInput } from "@/ai/flows/explain-lyrics";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


export function ExplainLyricsDialog({ children }: { children: ReactNode }) {
    const { track } = useContext(PlayerContext);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [highlightedText, setHighlightedText] = useState('');

    const handleExplain = async () => {
        if (!lyrics || !highlightedText || !track) return;
        setLoading(true);
        setExplanation('');
        try {
            const input: ExplainLyricsInput = {
                lyrics,
                highlightedText,
                artist: track.artist,
                title: track.title,
            };
            const result = await explainLyrics(input);
            setExplanation(result.explanation);
        } catch (error) {
            console.error("Failed to explain lyrics", error);
            setExplanation("Sorry, I couldn't generate an explanation for these lyrics.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Explain Lyrics</DialogTitle>
                    <DialogDescription>
                        Paste the lyrics of the current song and highlight a section to get an AI-powered explanation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Textarea
                            value={lyrics}
                            onChange={(e) => setLyrics(e.target.value)}
                            placeholder="Paste the full song lyrics here..."
                            className="h-32"
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            value={highlightedText}
                            onChange={(e) => setHighlightedText(e.target.value)}
                            placeholder="Then, copy and paste the specific lines you want explained here..."
                            className="h-24"
                        />
                    </div>
                    {explanation && (
                        <Alert>
                            <Mic2 className="h-4 w-4" />
                            <AlertTitle>Explanation</AlertTitle>
                            <AlertDescription>
                                {explanation}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                    <Button onClick={handleExplain} disabled={loading || !lyrics || !highlightedText}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Explain
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
