import { Wand2, FlaskConical, BrainCircuit, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectionToolbarProps {
  position: { x: number; y: number } | null;
  onSimplify: (text: string) => void;
  onAskAI: (text: string) => void;
  onGenerateQuiz: (text: string) => void;
  isSimplifying?: boolean; // Add this prop
}

export default function SelectionToolbar({
  position,
  onSimplify,
  onAskAI,
  onGenerateQuiz,
  isSimplifying = false,
}: SelectionToolbarProps) {
  if (!position) return null;

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed z-50 bg-popover/95 backdrop-blur-sm shadow-lg rounded-full border border-border p-1.5 flex gap-1.5 transform -translate-x-1/2"
          style={{
            left: `${position.x}px`,
            top: `${Math.max(position.y - 48, 10)}px`,
          }}
        >
          <button
            onClick={() => {
              const selectedText = window.getSelection()?.toString() || "";
              if (selectedText) onSimplify(selectedText);
            }}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSimplifying}
          >
            {isSimplifying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </button>
          <div className="w-px h-6 bg-border/50 my-auto" />
          <button
            onClick={() => onAskAI(window.getSelection()?.toString() || "")}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Ask AI"
          >
            <BrainCircuit className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-border/50 my-auto" />
          <button
            onClick={() =>
              onGenerateQuiz(window.getSelection()?.toString() || "")
            }
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Generate Quiz"
          >
            <FlaskConical className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
