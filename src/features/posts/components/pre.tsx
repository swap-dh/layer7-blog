"use client"

import { DetailedHTMLProps, HTMLAttributes, useRef, useState } from "react"

import { CheckIcon, ClipboardIcon } from "lucide-react/"

import { Button } from "@/components/ui/button"

export default function Pre({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent

    if (!code) return

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  return (
    <div className="group relative">
      <pre
        ref={preRef}
        {...props}
        style={{
          ...props.style,
          paddingRight: "3.5rem",
        }}
        className="overflow-x-auto"
      >
        {children}
      </pre>
      <Button
        size="icon"
        disabled={isCopied}
        onClick={handleClickCopy}
        className="absolute top-2 right-2 h-8 w-8 border border-neutral-700 bg-neutral-900 opacity-60 transition-all hover:bg-neutral-800 hover:opacity-100"
        variant="ghost"
      >
        {isCopied ? (
          <CheckIcon className="h-4 w-4 text-green-400" />
        ) : (
          <ClipboardIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

