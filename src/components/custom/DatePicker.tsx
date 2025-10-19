"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Mode = "date" | "datetime"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  mode?: Mode
}

export function DateTimePicker({ value, onChange, mode = "date" }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [inputValue, setInputValue] = React.useState(
    value ? format(value, mode === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm") : ""
  )
  const [time, setTime] = React.useState(value ? format(value, "HH:mm") : "00:00")

  // đồng bộ prop value -> state
  React.useEffect(() => {
    if (value) {
      setDate(value)
      setInputValue(format(value, mode === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"))
      setTime(format(value, "HH:mm"))
    } else {
      setDate(undefined)
      setInputValue("")
      setTime("00:00")
    }
  }, [value, mode])

  // chọn ngày từ calendar
  const handleSelect = (selected: Date | undefined) => {
    if (!selected) {
      setDate(undefined)
      setInputValue("")
      onChange?.(undefined)
      return
    }

    let newDate = new Date(selected)
    if (mode === "datetime") {
      const [h, m] = time.split(":")
      newDate.setHours(Number(h), Number(m))
    }
    setDate(newDate)
    setInputValue(format(newDate, mode === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"))
    onChange?.(newDate)
  }

  // nhập tay
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    const parsed = parse(val, "dd/MM/yyyy", new Date())
    if (!isNaN(parsed.getTime())) {
      handleSelect(parsed)
      if(onChange)
      onChange(parsed)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Input text */}
      <Input
        placeholder={mode === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
        value={inputValue}
        onChange={handleInputChange}
      />

      {/* Calendar popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
          {mode === "datetime" && (
            <div className="flex items-center gap-2 p-2 border-t">
              <Select
                value={time}
                onValueChange={(val) => {
                  setTime(val)
                  if (date) {
                    const [h, m] = val.split(":")
                    const newDate = new Date(date)
                    newDate.setHours(Number(h), Number(m))
                    setDate(newDate)
                    setInputValue(format(newDate, "dd/MM/yyyy HH:mm"))
                    onChange?.(newDate)
                  }
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Chọn giờ" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, h) =>
                    ["00", "30"].map((m) => {
                      const val = `${String(h).padStart(2, "0")}:${m}`
                      return (
                        <SelectItem key={val} value={val}>
                          {val}
                        </SelectItem>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
