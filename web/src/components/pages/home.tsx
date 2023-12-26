import { useEffect, useState } from "react"
import Todont from "../todont"
import useInterval from "../../hooks/use-interval"
import useCurrentRef from "../../hooks/use-current"

export default function Home() {
  const [metamaskInstalled, setMetamaskInstalled] = useState(false)
  const [account, setAccount] = useState('')

  const currentRef = useCurrentRef({ setAccount })

  const handleAccountsChange = (accounts: string[]) => {
    currentRef.current.setAccount(accounts[0] || '')
  }

  useInterval(() => {
    setMetamaskInstalled(!!window.ethereum)
  }, 200, typeof window !== 'undefined' ? !window.ethereum : false)

  useEffect(() => {
    if (!metamaskInstalled) return
    window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChange)
    window.ethereum.on('accountsChanged', handleAccountsChange)
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChange)
  }, [metamaskInstalled])

  const login = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleAccountsChange)
  }

  return (
    <div className="container mx-auto h-full flex justify-center items-center p-3">
      <main className="w-full max-w-sm min-h-96 flex flex-col items-center">

        {!metamaskInstalled && (
          <p className="mt-8">Please install MetaMask</p>
        )}

        {metamaskInstalled && !account && (
          <button className="btn mt-8" onClick={login}>Login</button>
        )}

        <Todont account={account} />
      </main>
    </div>
  )
}