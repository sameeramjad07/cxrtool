import { DiagnosticTool } from "@/components/diagnostic-tool";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <DiagnosticTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
