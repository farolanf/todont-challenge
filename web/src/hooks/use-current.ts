import { useRef } from "react"

export default function useCurrentRef(current: any) {
  const currentRef = useRef(current)
  currentRef.current = current
  return currentRef
}