"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Container, Button } from "@/components/ui";

export interface SaveBarProps {
  onSave?: () => void;
  onDiscard?: () => void;
  className?: string;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  onSave,
  onDiscard,
  className = "",
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (onSave) onSave();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <aside
      aria-label="Sticky Settings Action Bar"
      className={[
        "sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 shadow-elevated",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container size="lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Careful — you may have unsaved profile changes.
            </span>
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All Settings Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onDiscard}
              className="font-bold text-xs shadow-xs"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset Changes
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSave}
              className="bg-[#0F2744] hover:bg-[#183B66] text-white font-bold text-xs shadow-xs"
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Save Profile Settings
            </Button>
          </div>
        </div>
      </Container>
    </aside>
  );
};

SaveBar.displayName = "SaveBar";
