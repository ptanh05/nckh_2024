"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function LockAssets() {
  const [beneficiary, setBeneficiary] = useState("")
  const [lovelace, setLovelace] = useState("")
  const [policyId, setPolicyId] = useState("")
  const [assetName, setAssetName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [lockPeriod, setLockPeriod] = useState("30")
  const [instructions, setInstructions] = useState("")
  const [nftAssets, setNftAssets] = useState([{ policyId: "", assetName: "", quantity: "1" }])

  const addNftAsset = () => {
    setNftAssets([...nftAssets, { policyId: "", assetName: "", quantity: "1" }])
  }

  const updateNftAsset = (index: number, field: keyof (typeof nftAssets)[0], value: string) => {
    const newNftAssets = [...nftAssets]
    newNftAssets[index][field] = value
    setNftAssets(newNftAssets)
  }

  // Calculate unlock date
  const getUnlockDate = () => {
    const unlockDate = new Date()
    unlockDate.setDate(unlockDate.getDate() + Number.parseInt(lockPeriod || "30"))
    return unlockDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <main>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Lock Assets</h1>
        <p className="text-gray-400 mb-8">
          Securely lock your digital assets with time-based conditions and beneficiary management
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Asset Details</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary Wallet Address</Label>
                <Input
                  id="beneficiary"
                  placeholder="addr1qxy0..."
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lovelace">Amount to Lock (ADA)</Label>
                <Input
                  id="lovelace"
                  type="number"
                  placeholder="Enter amount in ADA"
                  value={lovelace}
                  onChange={(e) => setLovelace(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>NFT Assets</Label>

                {nftAssets.map((asset, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`policyId-${index}`}>Policy ID</Label>
                      <Input
                        id={`policyId-${index}`}
                        placeholder="Enter Policy ID"
                        value={asset.policyId}
                        onChange={(e) => updateNftAsset(index, "policyId", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`assetName-${index}`}>Asset Name</Label>
                      <Input
                        id={`assetName-${index}`}
                        placeholder="Enter Asset Name"
                        value={asset.assetName}
                        onChange={(e) => updateNftAsset(index, "assetName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        placeholder="Enter quantity"
                        value={asset.quantity}
                        onChange={(e) => updateNftAsset(index, "quantity", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-white/30 text-white/70 hover:text-white"
                  onClick={addNftAsset}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another NFT
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockPeriod">Lock Period (Days)</Label>
                <Input
                  id="lockPeriod"
                  type="number"
                  placeholder="Enter number of days"
                  value={lockPeriod}
                  onChange={(e) => setLockPeriod(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Add any special instructions or wishes for the beneficiary"
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Preview</h2>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Beneficiary</h3>
                <p className="text-gray-300">{beneficiary || "addr1qxy0..."}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Lovelace</h3>
                <p className="text-gray-300">{lovelace ? Number.parseInt(lovelace).toLocaleString() : "0"} ₳</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">NFT Assets</h3>
                {nftAssets.map((asset, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-gray-300">
                      <strong>Policy ID:</strong> {asset.policyId || "12345..."}
                      <br />
                      <strong>Asset Name:</strong> {asset.assetName || "MyDigitalAsset"}
                      <br />
                      <strong>Quantity:</strong> {asset.quantity || "1"}
                    </p>
                    {index < nftAssets.length - 1 && <hr className="border-white/10 my-2" />}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Lock Period</h3>
                <p className="text-gray-300">
                  {lockPeriod || "30"} days (until {getUnlockDate()})
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Transaction Explorer</h3>
                <p className="text-gray-300">
                  Transaction will be available after submission.
                  <br />
                  <a href="#" className="text-blue-400 hover:underline">
                    View on Cardano Explorer
                  </a>
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline">Preview Transaction</Button>
                <Button
                  className="gradient-bg text-white"
                  onClick={() =>
                    alert("Transaction submitted! Your assets will be locked according to your specifications.")
                  }
                >
                  Lock Assets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

