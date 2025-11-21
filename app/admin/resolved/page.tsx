"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminResolvedPage() {
  const router = useRouter()
  const items = [
    { id: "CASE-2001", title: "Lost item returned at Info Desk", resolved: "2025-09-08" },
    { id: "CASE-2004", title: "Boundary alert acknowledged by tourist", resolved: "2025-09-11" },
  ]
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full border border-border">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Resolved Issues</h1>
      </div>
      <div className="p-4 space-y-3">
        {items.map((it) => (
          <Card key={it.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.id} • Resolved {it.resolved}</p>
            </div>
            <Button size="sm" variant="outline" className="h-9"><CheckCircle2 className="h-4 w-4 mr-2" /> View</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}


