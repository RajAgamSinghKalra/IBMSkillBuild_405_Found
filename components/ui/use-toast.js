import * as React from "react"
import { toast as sonnerToast } from "sonner"

// Custom toast hook using Sonner
export function useToast() {
  const toast = React.useCallback(
    ({ title, description, variant = "default", ...props }) => {
      if (variant === "destructive") {
        sonnerToast.error(title, {
          description,
          ...props,
        })
      } else {
        sonnerToast.success(title, {
          description,
          ...props,
        })
      }
    },
    []
  )

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

// Simple toast function for backward compatibility
export function toast({ title, description, variant = "default", ...props }) {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
      ...props,
    })
  } else {
    sonnerToast.success(title, {
      description,
      ...props,
    })
  }
}