import { ArrowRight, Boxes, Route, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";

const features = [
  {
    icon: Route,
    title: "Route constants",
    description: "Every navigation goes through ROUTES.* — no hardcoded paths anywhere.",
  },
  {
    icon: Boxes,
    title: "Feature modules",
    description: "Each feature owns its api, hooks, types and components behind a barrel file.",
  },
  {
    icon: ShieldCheck,
    title: "Async states",
    description: "Loading, error, empty and idle are rendered through AsyncState — always.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4 text-center">
        <Badge variant="secondary">Vite · React 19 · TypeScript</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your production-ready React starter
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          React Router, TanStack Query, shadcn/ui with Tailwind CSS, Zod validation and
          battle-tested conventions — packaged as a single Vite app.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link to={ROUTES.DASHBOARD.ROOT}>
              Open dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.ABOUT}>About the conventions</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 size-5 text-primary" aria-hidden />
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
        <p>
          The dashboard behind{" "}
          <Link to={ROUTES.DASHBOARD.ROOT} className="font-medium text-foreground underline">
            {ROUTES.DASHBOARD.ROOT}
          </Link>{" "}
          is a private route — sign in on the{" "}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-foreground underline">
            login page
          </Link>{" "}
          to reach it.
        </p>
      </section>
    </div>
  );
}
