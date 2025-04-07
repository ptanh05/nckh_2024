"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UpdateNFT() {
  const [nftName, setNftName] = useState("")
  const [description, setDescription] = useState("")
  const [metadata, setMetadata] = useState([{ key: "", value: "" }])
  const [contentType, setContentType] = useState("none")

  const addMetadataField = () => {
    setMetadata([...metadata, { key: "", value: "" }])
  }

  const removeMetadataField = (index: number) => {
    const newMetadata = [...metadata]
    newMetadata.splice(index, 1)
    setMetadata(newMetadata)
  }

  const updateMetadataField = (index: number, field: "key" | "value", value: string) => {
    const newMetadata = [...metadata]
    newMetadata[index][field] = value
    setMetadata(newMetadata)
  }

  return (
    <main>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8">Update NFT Metadata</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update Form */}
          <div className="card-bg p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nftName">NFT Name</Label>
                <Input
                  id="nftName"
                  placeholder="Enter NFT name"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter NFT description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Metadata</Label>

                <div className="space-y-3">
                  {metadata.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center bg-white/5 p-2 rounded-md">
                      <Input
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => updateMetadataField(index, "key", e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => updateMetadataField(index, "value", e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeMetadataField(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-dashed border-blue-500/50 text-blue-500"
                  onClick={addMetadataField}
                >
                  + Add Metadata Field
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nftAttributes">CIP68 Reference NFT Properties</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="image/png">Image (PNG)</SelectItem>
                    <SelectItem value="image/jpeg">Image (JPEG)</SelectItem>
                    <SelectItem value="image/svg+xml">Image (SVG)</SelectItem>
                    <SelectItem value="audio/mp3">Audio (MP3)</SelectItem>
                    <SelectItem value="video/mp4">Video (MP4)</SelectItem>
                    <SelectItem value="application/json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full gradient-bg text-white">Update NFT Metadata</Button>
            </div>
          </div>

          {/* Preview */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">NFT Preview</h2>

            <div className="rounded-lg overflow-hidden">
              <div className="bg-gray-700 h-[300px] flex items-center justify-center text-gray-400 text-lg">
                NFT Image Preview
              </div>

              <div className="p-4 bg-white/5">
                <div className="text-xl font-bold mb-1">{nftName || "NFT Name"}</div>
                <div className="text-gray-400 mb-4">{description || "NFT Description"}</div>

                <h3 className="font-medium mb-2">Metadata</h3>
                <div className="bg-black/20 rounded-md p-4 space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-medium text-gray-400">Format</span>
                    <span>CIP68</span>
                  </div>

                  {metadata.map((item, index) =>
                    item.key ? (
                      <div key={index} className="flex justify-between border-b border-white/10 pb-2">
                        <span className="font-medium text-gray-400">{item.key}</span>
                        <span>{item.value || "—"}</span>
                      </div>
                    ) : null,
                  )}

                  {contentType !== "none" && (
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="font-medium text-gray-400">Content Type</span>
                      <span>{contentType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

