import { useEffect, useRef } from "react"

export default function useInterval(cb: () => void, ms: number, disable?: boolean) {
  const cbRef = useRef(cb)
  cbRef.current = cb

  useEffect(() => {
    if (disable) return

    const timer = setInterval(() => cbRef.current())

    return () => clearInterval(timer)
  }, [disable]);
}
