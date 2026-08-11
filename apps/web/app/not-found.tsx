import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Container, Card, CardContent, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <Container size="sm" className="min-h-[70vh] flex items-center justify-center py-16">
      <Card className="w-full text-center shadow-sm">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--primary-subtle)] border border-[#cbd5e1] text-[var(--primary)] text-2xl font-black">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto leading-relaxed">
              The opportunity, recruitment notice, or page you are looking for might have been updated, relocated, or expired.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Go to Homepage
              </Button>
            </Link>
            <Link href="/search" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<Search className="h-4 w-4" />}
              >
                Search Jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
