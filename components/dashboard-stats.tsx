import { Calendar, Ticket, DollarSign, Users } from "lucide-react"

interface DashboardStatsProps {
  registrations: any[]
}

export default function DashboardStats({ registrations }: DashboardStatsProps) {
  const totalTickets = registrations.reduce((sum, reg) => sum + reg.ticketCount, 0)
  const totalSpent = totalTickets * 49 + Math.round(totalTickets * 49 * 0.1)

  const stats = [
    {
      icon: Calendar,
      label: "Events Registered",
      value: registrations.length.toString(),
    },
    {
      icon: Ticket,
      label: "Total Tickets",
      value: totalTickets.toString(),
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${totalSpent}`,
    },
    {
      icon: Users,
      label: "People Met",
      value: (registrations.length * 15).toString(),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
