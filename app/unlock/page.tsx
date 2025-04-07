"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Lock, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Unlock() {
  const [assets] = useState([
    {
      id: 1,
      name: "Digital Legacy Document #1",
      unlockDate: "April 10, 2025",
      lockPeriod: "30 days",
      status: "locked",
    },
    {
      id: 2,
      name: "NFT Collection Transfer #28",
      unlockDate: "April 15, 2025",
      lockPeriod: "45 days",
      status: "locked",
    },
    {
      id: 3,
      name: "Digital Currency Transfer #42",
      unlockDate: "April 20, 2025",
      lockPeriod: "60 days",
      status: "locked",
    },
  ])

  const [transactions] = useState([
    {
      asset: "Digital Legacy Document #5",
      date: "April 1, 2025",
      txId: "0x7f1e...3a9b",
      status: "completed",
    },
    {
      asset: "NFT Collection Transfer #12",
      date: "March 25, 2025",
      txId: "0x9c7d...6f2e",
      status: "completed",
    },
    {
      asset: "Digital Currency Transfer #18",
      date: "March 20, 2025",
      txId: "0x3e8b...1d4a",
      status: "completed",
    },
  ])

  return (
    <main>
      <Navbar />

      <section className="bg-gradient-to-b from-[#4834d4] to-[#7e74f1] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Unlock Your Digital Assets</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Access and claim your digital heritage assets securely through Cardano blockchain technology.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Available Assets</h2>

            <div className="space-y-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border-l-4 border-[#4834d4] bg-[#252536]"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-lg">{asset.name}</div>
                    <div className="text-gray-400 text-sm">
                      Locked until: {asset.unlockDate} | Lock Period: {asset.lockPeriod}
                    </div>
                  </div>
                  <Button
                    className="mt-2 md:mt-0 gradient-bg text-white flex items-center gap-2"
                    onClick={() => alert(`Claiming asset: ${asset.name}`)}
                  >
                    <Lock size={16} />
                    Claim Asset
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center my-12">
          <Button
            className="gradient-bg text-white text-lg px-8 py-6 rounded-full flex items-center gap-2"
            onClick={() => alert("Unlocking all available assets")}
          >
            <Lock size={20} />
            Unlock All Assets
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">About Asset Unlocking</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-blue-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Time-Lock System</div>
                    <p className="text-gray-400 text-sm">
                      Assets are securely locked for specified periods as determined by the original asset owner. Once
                      the lock period ends, beneficiaries can claim their assets.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-500/20 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Digital Signature Verification</div>
                    <p className="text-gray-400 text-sm">
                      When claiming assets, your digital signature is verified through your connected wallet to ensure
                      secure and valid transfers comply with the smart contract conditions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 font-normal text-gray-400 text-sm">Asset</th>
                      <th className="text-left py-2 px-2 font-normal text-gray-400 text-sm">Date</th>
                      <th className="text-left py-2 px-2 font-normal text-gray-400 text-sm">Transaction ID</th>
                      <th className="text-left py-2 px-2 font-normal text-gray-400 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-3 px-2">{tx.asset}</td>
                        <td className="py-3 px-2">{tx.date}</td>
                        <td className="py-3 px-2">{tx.txId}</td>
                        <td className="py-3 px-2">
                          <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-xs">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}

