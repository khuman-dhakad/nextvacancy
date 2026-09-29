import React from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";

export const CommunitySidebarCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-[#0F2744] text-white border-none shadow-md overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-xs">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Aspirants WhatsApp Alerts
            </h3>
            <p className="text-[11px] text-emerald-300">
              Instant notification on your mobile
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Never miss an application deadline, admit card release, or exam result.
          Join 50,000+ candidates receiving instant updates daily.
        </p>

        <ul className="space-y-1.5 text-xs text-slate-300 list-none p-0 m-0">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Direct Official PDF Notifications</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Admit Card & Hall Ticket Alerts</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>100% Free & No Spam Guarantee</span>
          </li>
        </ul>

        <div className="pt-1 space-y-2">
          <a
            href="https://whatsapp.com/channel"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="accent"
              size="md"
              fullWidth
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-xs font-bold"
              leftIcon={<MessageCircle className="h-4 w-4" />}
            >
              Join WhatsApp Channel
            </Button>
          </a>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              Join Telegram Channel
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

CommunitySidebarCard.displayName = "CommunitySidebarCard";
