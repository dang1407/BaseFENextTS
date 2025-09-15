"use client"

import { useEffect } from "react"

interface PageTitleProps {
  title: string
  className?: string
}

export function PageTitle({ title, className }: PageTitleProps) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <h1 className={`text-2xl font-bold mb-4 ${className ?? ""}`}>
      {title}
    </h1>
  )
}
