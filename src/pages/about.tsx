import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const conventions = [
  {
    title: "Centralized routes",
    body: "All navigation uses ROUTES.* from @/lib/constants/routes — one change propagates everywhere.",
  },
  {
    title: "Centralized endpoints",
    body: "API URLs come from ENDPOINTS.* in @/lib/api — never string literals in feature code.",
  },
  {
    title: "Feature module pattern",
    body: "features/<name>/{api,hooks,types,components} with a barrel index.ts as its public surface.",
  },
  {
    title: "React Query + query keys",
    body: "Every fetch is a useQuery/useMutation behind a *_KEYS factory for consistent cache keys.",
  },
  {
    title: "Error codes first",
    body: "API error codes map to human messages in ERROR_CODE_MESSAGES; onError shows the toast.",
  },
  {
    title: "Zod everywhere",
    body: "Shared schemas drive form validation (zodResolver) and can be reused by the NestJS starter.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="max-w-2xl text-muted-foreground">
          This starter distills the conventions of the ProvenMe web monorepo into a single Vite app:
          same patterns, no workspace plumbing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {conventions.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
