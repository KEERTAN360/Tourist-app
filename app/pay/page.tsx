"use client"
import {
  Plus,
  Bitcoin,
  Building2,
  DollarSign,
  Menu,
  Home,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  QrCode,
  Phone,
  PiIcon as UpiIcon,
  Car,
  CheckCircle,
  ArrowLeft,
  X,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense, useEffect, useRef } from "react"

function PayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAddMoneyOptions, setShowAddMoneyOptions] = useState(false)
  const [showPayAnyoneOptions, setShowPayAnyoneOptions] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [walletBalance, setWalletBalance] = useState(25480)
  const [addAmount, setAddAmount] = useState("")
  const [payAmount, setPayAmount] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showTransactionComplete, setShowTransactionComplete] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [dbError, setDbError] = useState<string>("")
  const [walletError, setWalletError] = useState<string>("")
  const [userInfo, setUserInfo] = useState({
    username: "guest",
    email: "",
    phone: "",
    name: "",
    joinDate: ""
  })
  const username = typeof window !== 'undefined' ? (localStorage.getItem("username") || "guest") : "guest"

  // Load user information from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem("username") || "guest"
      const email = localStorage.getItem("email") || ""
      const phone = localStorage.getItem("phone") || ""
      const name = localStorage.getItem("name") || storedUsername
      const joinDate = localStorage.getItem("joinDate") || ""

      setUserInfo({
        username: storedUsername,
        email,
        phone,
        name,
        joinDate
      })
    }
  }, [])

  // Load wallet balance and transaction history from API
  useEffect(() => {
    const load = async () => {
      try {
        // Load wallet balance
        const walletRes = await fetch(`/api/wallet?username=${encodeURIComponent(username)}`, { cache: 'no-store' })
        const walletData = await walletRes.json()
        if (walletRes.ok) {
          setWalletBalance(walletData.balance)
          if (walletData.fallback) {
            setWalletError("Using temporary storage for wallet (MongoDB not available)")
          }
        } else {
          setWalletError(walletData.error || 'Failed to load wallet')
        }

        // Load transaction history
        const historyRes = await fetch(`/api/pay-history?username=${encodeURIComponent(username)}`, { cache: 'no-store' })
        const historyData = await historyRes.json()
        if (historyRes.ok) {
          const items = (historyData.items || []).map((it: any, idx: number) => ({
            id: it._id || idx,
            type: it.type,
            amount: it.amount,
            date: new Date(it.createdAt).toLocaleString(),
            icon: it.type === 'Added Money' ? Plus : it.type === 'Transfer' ? Building2 : DollarSign,
            recipient: it.recipient || '—',
          }))
          setTransactions(items)
          if (historyData.fallback) {
            setDbError("Using temporary storage (MongoDB not available)")
          }
        } else {
          setDbError(historyData.error || 'Failed to load history')
        }
      } catch (e: any) {
        setDbError(e?.message || 'Failed to load data')
        setWalletError(e?.message || 'Failed to load wallet')
      }
    }
    load()
  }, [username])

  const persist = async (payload: any) => {
    try {
      const res = await fetch('/api/pay-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setDbError(j.error || 'Failed to save')
      } else {
        setDbError("")
      }
    } catch (e: any) {
      setDbError(e?.message || 'Failed to save')
    }
  }

  const updateWalletBalance = async (amount: number, operation: "add" | "subtract") => {
    try {
      const res = await fetch('/api/wallet', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, amount, operation }),
      })
      if (res.ok) {
        const data = await res.json()
        setWalletBalance(data.balance)
        setWalletError("")
      } else {
        const j = await res.json().catch(() => ({}))
        setWalletError(j.error || 'Failed to update wallet')
      }
    } catch (e: any) {
      setWalletError(e?.message || 'Failed to update wallet')
    }
  }

  // Generate user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name || name === "guest") return "G"
    const words = name.trim().split(" ")
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  // Get member status based on join date
  const getMemberStatus = (joinDate: string) => {
    if (!joinDate) return "New Member"
    const joinYear = new Date(joinDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const years = currentYear - joinYear
    if (years >= 3) return "Premium Member"
    if (years >= 1) return "Regular Member"
    return "New Member"
  }

  const addMoneyRef = useRef<HTMLDivElement>(null)
  const payAnyoneRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const paymentType = searchParams.get("type")
  const appName = searchParams.get("app")
  const amount = searchParams.get("amount")
  const destination = searchParams.get("destination")
  const mode = searchParams.get("mode")

  const isTravelPayment = paymentType === "travel"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMoneyRef.current && !addMoneyRef.current.contains(event.target as Node)) {
        setShowAddMoneyOptions(false)
      }
      if (payAnyoneRef.current && !payAnyoneRef.current.contains(event.target as Node)) {
        setShowPayAnyoneOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const startQRScanner = async () => {
    setShowQRScanner(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setTimeout(() => {
        stopQRScanner()
        simulatePayment("QR Code", "Coffee Shop", 150)
      }, 3000)
    } catch (error) {
      console.error("Camera access denied:", error)
      setShowQRScanner(false)
    }
  }

  const stopQRScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowQRScanner(false)
  }

  const handleAddMoney = async () => {
    const amountToAdd = Number.parseInt(addAmount)
    if (amountToAdd && amountToAdd > 0) {
      // Update wallet balance in database
      await updateWalletBalance(amountToAdd, "add")

      const newTransaction = {
        id: transactions.length + 1,
        type: "Added Money",
        amount: amountToAdd,
        date: "Just now",
        icon: Plus,
        recipient: "Bank Transfer",
      }
      setTransactions([newTransaction, ...transactions])
      persist({ username, type: "Added Money", amount: amountToAdd, recipient: "Bank Transfer", method: "Add Money" })
      setLastTransaction(newTransaction)

      setAddAmount("")
      setShowAddMoneyOptions(false)
      setShowTransactionComplete(true)
    }
  }

  const simulatePayment = async (method: string, recipient: string, amount: number) => {
    if (walletBalance >= amount) {
      // Update wallet balance in database
      await updateWalletBalance(amount, "subtract")

      const newTransaction = {
        id: transactions.length + 1,
        type: "Payment",
        amount: -amount,
        date: "Just now",
        icon: method === "QR Code" ? QrCode : Phone,
        recipient: recipient,
      }
      setTransactions([newTransaction, ...transactions])
      persist({ username, type: "Payment", amount: -amount, recipient, method })
      setLastTransaction(newTransaction)

      setPayAmount("")
      setShowPayAnyoneOptions(false)
      setShowTransactionComplete(true)
    }
  }

  const handlePayByPhone = async () => {
    const amountToPay = Number.parseInt(payAmount)
    if (amountToPay && amountToPay > 0) {
      await simulatePayment("Phone", "Contact", amountToPay)
    }
  }

  const handleTravelPayment = () => {
    setPaymentProcessing(true)
    setTimeout(() => {
      setPaymentProcessing(false)
      setPaymentSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }, 2000)
  }

  if (showQRScanner) {
    return (
      <div className="min-h-screen bg-black relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/50">
            <Button
              onClick={stopQRScanner}
              variant="ghost"
              size="icon"
              className="text-white bg-white/20 rounded-full hover:bg-white/30"
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-white font-semibold">Scan QR Code</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse">
                    <QrCode className="h-12 w-12 text-white/50" />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-white text-sm">Position QR code within the frame</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-white text-xs">Scanning...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showTransactionComplete && lastTransaction) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center gap-3 p-4 pt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTransactionComplete(false)}
            className="text-foreground bg-card border border-border rounded-xl hover:bg-muted shadow-md"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground text-center">Transaction Complete</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {lastTransaction.amount > 0 ? "Money Added!" : "Payment Sent!"}
          </h2>

          <p className="text-muted-foreground text-center mb-6">
            {lastTransaction.amount > 0
              ? `₹${lastTransaction.amount} has been added to your wallet`
              : `₹${Math.abs(lastTransaction.amount)} sent to ${lastTransaction.recipient}`}
          </p>

          <Card className="w-full max-w-sm p-6 bg-card border border-border rounded-2xl shadow-lg">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm text-foreground">TXN{Date.now().toString().slice(-8)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className={`text-2xl font-bold ${lastTransaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {lastTransaction.amount > 0 ? "+" : ""}₹{Math.abs(lastTransaction.amount)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">New Balance</p>
                <p className="text-xl font-semibold text-foreground">₹{walletBalance.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="text-sm text-foreground">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => setShowTransactionComplete(false)}
            className="w-full max-w-sm mt-6 h-12 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  if (isTravelPayment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-4 p-4 pt-6 bg-background border-b border-border shadow-sm">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground text-center">Complete Payment</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted rounded-xl">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="px-4 pb-20">
          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground text-center mb-4">
                Your {mode} booking with {appName} has been confirmed
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to home...</p>
            </div>
          ) : (
            <>
              <Card className="p-4 mb-6 bg-gradient-to-r from-primary to-primary/80 border-0 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{appName} Booking</h3>
                    <p className="text-sm text-primary-foreground/80">Trip to {destination}</p>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/80">Total Amount:</span>
                    <span className="text-2xl font-bold text-white">{amount}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6 bg-card border border-border rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-foreground/80">Wallet Balance</p>
                      <p className="text-2xl font-bold text-white">₹{walletBalance.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={handleTravelPayment}
                  disabled={paymentProcessing}
                  className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold text-lg shadow-lg"
                >
                  {paymentProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mr-2" />
                      Pay {amount} to {appName}
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-border text-foreground hover:bg-muted"
                  disabled={paymentProcessing}
                >
                  Cancel Booking
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, label: "Home", href: "/" },
              { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
              { icon: CreditCard, label: "Pay", active: true, href: "/pay" },
              { icon: FileText, label: "Documents", href: "/documents" },
              { icon: AlertTriangle, label: "SOS", href: "/sos" },
            ].map((item, index) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => item.href && router.push(item.href)}
                className={`flex flex-col items-center gap-1 p-2 h-auto transition-all duration-300 rounded-xl ${item.active
                  ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            ))}
          </div>

          <div className="text-center mt-2 pb-2">
            <p className="text-xs text-muted-foreground">Made in Bangalore, India</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-4 p-4 pt-6 bg-background border-b border-border shadow-sm">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground text-center">Wallet</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-4 mb-6 pb-20">
        <Card className="p-3 mb-4 bg-green-50 text-green-800 border border-green-200 rounded-xl flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <div className="font-medium">Protected with Blockchain Technology</div>
        </Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-border flex items-center justify-center text-white font-bold text-lg">
            {getUserInitials(userInfo.name)}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{userInfo.name || userInfo.username}</h2>
            <p className="text-sm text-muted-foreground">{getMemberStatus(userInfo.joinDate)}</p>
          </div>
        </div>

        <Card className="p-6 text-center bg-gradient-to-r from-primary to-primary/80 border-0 rounded-2xl shadow-lg">
          <p className="text-sm text-primary-foreground/80 mb-2">Total Balance</p>
          <h3 className="text-4xl font-bold text-white mb-6">₹{walletBalance.toLocaleString()}</h3>

          <div className="space-y-3" ref={addMoneyRef}>
            <Button
              onClick={() => {
                setShowAddMoneyOptions(!showAddMoneyOptions)
                setShowPayAnyoneOptions(false)
              }}
              className="w-full h-14 bg-primary/20 hover:bg-primary/30 text-white rounded-2xl font-semibold text-lg shadow-lg border border-white/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Money
            </Button>

            {showAddMoneyOptions && (
              <Card className="mt-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Add Money Options</h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 border-0 text-white hover:from-orange-600 hover:to-orange-700 shadow-md"
                  >
                    <Bitcoin className="h-6 w-6 mb-1 text-white" />
                    <span className="text-xs">Crypto</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                  >
                    <Building2 className="h-6 w-6 mb-1 text-white" />
                    <span className="text-xs">Bank</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 border-0 text-white hover:from-green-600 hover:to-green-700 shadow-md"
                  >
                    <DollarSign className="h-6 w-6 mb-1 text-white" />
                    <span className="text-xs">Forex</span>
                  </Button>
                </div>

                <div>
                  <Input
                    placeholder="Enter amount to add"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    type="number"
                    className="w-full h-12 rounded-xl text-center text-lg font-semibold mb-3 border-border"
                  />
                  <Button
                    onClick={handleAddMoney}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
                  >
                    Add to Wallet
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="mt-3" ref={payAnyoneRef}>
            <Button
              onClick={() => {
                setShowPayAnyoneOptions(!showPayAnyoneOptions)
                setShowAddMoneyOptions(false)
              }}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-lg shadow-lg"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Pay Anyone
            </Button>

            {showPayAnyoneOptions && (
              <Card className="mt-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Pay Anyone</h3>

                <div className="space-y-3 mb-4">
                  <Button
                    onClick={startQRScanner}
                    variant="outline"
                    className="w-full h-12 justify-start rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                  >
                    <QrCode className="h-5 w-5 mr-3 text-white" />
                    <span className="flex-1 text-left">Scan QR Code</span>
                  </Button>

                  <Button
                    onClick={handlePayByPhone}
                    variant="outline"
                    className="w-full h-12 justify-start rounded-xl bg-gradient-to-r from-green-500 to-green-600 border-0 text-white hover:from-green-600 hover:to-green-700 shadow-md"
                  >
                    <Phone className="h-5 w-5 mr-3 text-white" />
                    <span className="flex-1 text-left">Pay by Phone Number</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 border-0 text-white hover:from-purple-600 hover:to-purple-700 shadow-md"
                  >
                    <UpiIcon className="h-5 w-5 mr-3 text-white" />
                    <span className="flex-1 text-left">Pay by UPI ID</span>
                  </Button>
                </div>

                <div>
                  <Input
                    placeholder="Enter amount to pay"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    type="number"
                    className="w-full h-12 rounded-xl text-center text-lg font-semibold mb-3 border-border"
                  />
                  <Button
                    onClick={handlePayByPhone}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                  >
                    Send Payment
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 border-0 hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer shadow-md">
            <Bitcoin className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-xs font-medium text-white">Crypto</p>
          </Card>

          <Card className="p-4 text-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all cursor-pointer shadow-md">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-xs font-medium text-white">Bank</p>
          </Card>

          <Card className="p-4 text-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700 transition-all cursor-pointer shadow-md">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-xs font-medium text-white">Forex</p>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 rounded-xl bg-card border border-border shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <transaction.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.recipient}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, label: "Home", href: "/" },
            { icon: MapPin, label: "Tourist Spots", href: "/tourist-spots" },
            { icon: CreditCard, label: "Pay", active: true, href: "/pay" },
            { icon: FileText, label: "Documents", href: "/documents" },
            { icon: AlertTriangle, label: "SOS", href: "/sos" },
          ].map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.href && router.push(item.href)}
              className={`flex flex-col items-center gap-1 p-2 h-auto transition-all duration-300 rounded-xl ${item.active
                ? "text-primary-foreground bg-gradient-to-r from-primary to-primary/80 shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <div className="text-center mt-2 pb-2">
          <p className="text-xs text-muted-foreground">Made in Bangalore, India</p>
        </div>
      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayPageContent />
    </Suspense>
  )
}
