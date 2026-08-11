import { Container, Skeleton, Card, CardContent } from "@/components/ui";

export default function Loading() {
  return (
    <Container size="lg" className="py-8 sm:py-12 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3 max-w-sm rounded-lg" />
        <Skeleton className="h-4 w-1/2 max-w-md rounded-md" />
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="space-y-3">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
              <Skeleton className="h-5 w-4/5 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <div className="pt-2 border-t border-[var(--border)] flex justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
