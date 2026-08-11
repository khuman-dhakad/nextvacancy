import Link from "next/link";
import { Container, Card, CardContent, Button, Badge } from "@/components/ui";
import { ArrowRight, Building2, Briefcase, FileCheck, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="py-8 sm:py-12 space-y-8 bg-slate-50/50">
      {/* Welcome Hero / Portal Intro */}
      <section aria-labelledby="portal-heading">
        <Container size="lg">
          <div className="rounded-2xl bg-[var(--primary)] text-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <Badge variant="accent" size="md">
                ⚡ Real-Time Recruitment Portal
              </Badge>
              <h1 id="portal-heading" className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Find Latest Government Jobs, Admit Cards & Results
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Stay updated with genuine vacancy notifications, eligibility criteria, exam schedules, and direct official application links across India.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/category/government">
                  <Button variant="accent" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore Govt Jobs
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="md" className="bg-transparent text-white border-slate-600 hover:bg-slate-800">
                    Search All Vacancies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Access Highlights */}
      <section aria-label="Quick Highlights">
        <Container size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card hoverable className="bg-white">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-[#D97706] shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900">Government Jobs</h2>
                  <p className="text-xs text-slate-500">UPSC, SSC, Railway, State PSC notifications</p>
                </div>
              </CardContent>
            </Card>

            <Card hoverable className="bg-white">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#1D4ED8] shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900">Private Careers</h2>
                  <p className="text-xs text-slate-500">IT, Banking, Engineering & MNC vacancies</p>
                </div>
              </CardContent>
            </Card>

            <Card hoverable className="bg-white">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#059669] shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900">Admit Cards</h2>
                  <p className="text-xs text-slate-500">Direct hall ticket download links & dates</p>
                </div>
              </CardContent>
            </Card>

            <Card hoverable className="bg-white">
              <CardContent className="p-5 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-red-50 text-[#DC2626] shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900">Exam Results</h2>
                  <p className="text-xs text-slate-500">Merit lists, cut-off marks & scorecards</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
