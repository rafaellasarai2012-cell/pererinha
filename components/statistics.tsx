"use client"

import { useEffect, useState } from "react"

const stats = [
  { value: 419, label: "Posts", suffix: "" },
  { value: 3062, label: "Seguidores", suffix: "" },
  { value: 606, label: "Seguindo", suffix: "" },
]

function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 1500
    const step = target / (duration / 16)
    let frame = 0

    const interval = setInterval(() => {
      frame += step
      if (frame >= target) {
        setCurrent(target)
        clearInterval(interval)
      } else {
        setCurrent(Math.floor(frame))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [target])

  return <>{current.toLocaleString("pt-BR")}</>
}

export function Statistics() {
  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-4 text-center font-display text-3xl font-bold uppercase tracking-tight text-secondary-foreground md:text-4xl">
          Nossos Numeros
        </h2>
        <p className="mb-2 text-center text-sm text-muted-foreground">
          @projetopereirinha no Instagram
        </p>
        <div className="mx-auto mb-12 h-1 w-16 bg-accent" />

        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-xl bg-card p-6 shadow-sm"
            >
              <span className="font-display text-3xl font-bold text-card-foreground md:text-5xl">
                <AnimatedNumber target={stat.value} />
                {stat.suffix}
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
