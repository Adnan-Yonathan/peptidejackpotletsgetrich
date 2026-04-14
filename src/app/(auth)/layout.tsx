import { FlaskConical } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted/30">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <FlaskConical className="h-6 w-6 text-primary" />
        PeptidePros
      </Link>
      {children}
    </div>
  );
}
