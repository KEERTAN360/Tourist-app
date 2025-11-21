"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Siren } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminUnresolvedPage() {
  const router = useRouter()
  const items = [
    { id: "CASE-2101", title: "Noise complaint near Market Road", reported: "2025-09-10" },
    { id: "CASE-2102", title: "Missing ID verification - Trail checkpoint", reported: "2025-09-12" },
  ]
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full border border-border">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Unresolved Issues</h1>
      </div>
      <div className="p-4 space-y-3">
        {items.map((it) => (
          <Card key={it.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.id} • Reported {it.reported}</p>
            </div>
            <Button size="sm" className="h-9"><Siren className="h-4 w-4 mr-2" /> Escalate</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}


