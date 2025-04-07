"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function BurnNFT() {
  const [nftName, setNftName] = useState("")
  const [collection, setCollection] = useState("")
  const [reason, setReason] = useState("outdated")
  const [confirmed, setConfirmed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmed) {
      alert("Please confirm that you understand burning is permanent")
      return
    }

    setShowDetails(true)
    // Reset form
    setNftName("")
    setCollection("")
    setReason("outdated")
    setConfirmed(false)

    // Scroll to details
    setTimeout(() => {
      document.getElementById("burnDetails")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <main>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Burn NFT Assets</h1>
        <p className="text-gray-400 mb-8">Permanently remove NFTs that are no longer needed from the blockchain</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card-bg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nftName">NFT Name or ID</Label>
                  <Input
                    id="nftName"
                    placeholder="Enter NFT name or ID"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection">Collection</Label>
                  <Select value={collection} onValueChange={setCollection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Collection (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection0">Select Collection (Optional)</SelectItem>
                      <SelectItem value="collection1">Digital Heirlooms</SelectItem>
                      <SelectItem value="collection2">Family Archives</SelectItem>
                      <SelectItem value="collection3">Legacy Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Burning</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdated">No Longer Needed</SelectItem>
                      <SelectItem value="duplicate">Duplicate Asset</SelectItem>
                      <SelectItem value="error">Created in Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                    required
                  />
                  <Label htmlFor="confirm" className="text-sm">
                    I understand that burning this NFT is permanent and cannot be undone
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Burn NFT
                </Button>
              </form>
            </div>

            {showDetails && (
              <div id="burnDetails" className="card-bg p-6 border border-blue-500/30">
                <h3 className="text-lg font-medium mb-4">Burn Transaction Details</h3>
                <p className="mb-2">
                  NFT "<span className="font-medium">{nftName || "Crypto Legacy #4328"}</span>" has been successfully
                  queued for burning.
                </p>
                <p className="mb-2">
                  Transaction Hash: <strong>0x7f9e8d7c6b5a4e3f2d1c0b9a8e7d6c5f4e3d2b1a</strong>
                </p>
                <p>
                  Status: <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-full text-xs">Pending</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-bg p-6">
              <h3 className="text-lg font-medium mb-4">About NFT Burning</h3>
              <div className="space-y-3">
                {[
                  "Burning an NFT permanently removes it from the blockchain",
                  "The transaction is recorded on the Cardano blockchain for transparency",
                  "Once burned, the NFT's metadata and image will no longer be accessible",
                  "Burned NFTs cannot be recovered under any circumstances",
                  "Wallet authentication is required to confirm the burn process",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-blue-500 mt-1">
                      <Check size={16} />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-bg p-6">
              <h3 className="text-lg font-medium mb-4">When to Burn NFTs</h3>
              <div className="space-y-3">
                {[
                  "Digital assets that are no longer relevant to your legacy",
                  "Outdated documents that have been superseded by newer versions",
                  "Assets with incorrect metadata or information",
                  "Duplicate NFTs that serve the same purpose",
                  "Test NFTs created during platform exploration",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-blue-500 mt-1">
                      <Check size={16} />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Recent Burns</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-normal text-gray-400">NFT Name</th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">Collection</th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Family Photo #142",
                    collection: "Digital Heirlooms",
                    date: "Apr 4, 2025",
                    status: "Completed",
                  },
                  {
                    name: "Will Document Draft",
                    collection: "Legacy Documents",
                    date: "Apr 3, 2025",
                    status: "Completed",
                  },
                  { name: "Estate Plan V1", collection: "Legacy Documents", date: "Apr 1, 2025", status: "Completed" },
                ].map((burn, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 px-4">{burn.name}</td>
                    <td className="py-3 px-4">{burn.collection}</td>
                    <td className="py-3 px-4">{burn.date}</td>
                    <td className="py-3 px-4">
                      <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-full text-xs">{burn.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

