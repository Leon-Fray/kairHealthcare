import { Search, Calendar, HeartPulse } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Find Your Practitioner',
      description: 'Search by specialty, location, and availability to find the perfect healthcare professional for your needs.',
    },
    {
      icon: Calendar,
      title: 'Book Your Appointment',
      description: 'Choose a convenient time slot and book your appointment in seconds. Virtual or in-person options available.',
    },
    {
      icon: HeartPulse,
      title: 'Connect & Get Care',
      description: 'Meet with your practitioner and receive the quality healthcare you deserve, on your schedule.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started with Kari Healthcare Platform is simple. Follow these three easy steps to connect with your ideal healthcare provider.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="card-enhanced text-center relative">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

