"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function MintNFT() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder.svg?height=300&width=300")
  const [nftName, setNftName] = useState("")
  const [description, setDescription] = useState("")
  const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }])
  const [selectedAttribute, setSelectedAttribute] = useState("none")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      if (droppedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(droppedFile)
      }
    }
  }

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }])
  }

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes]
    newAttributes.splice(index, 1)
    setAttributes(newAttributes)
  }

  const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  const mintNFT = () => {
    alert(
      "NFT minted successfully with CIP-68 standard! Transaction hash: 0x" +
        Math.random().toString(16).substring(2, 34),
    )
  }

  return (
    <main>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">Mint Your NFT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Container */}
          <div className="card-bg p-6">
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-1">CIP-68 NFT Standard</h4>
              <p className="text-sm text-gray-400">
                This minting page supports the CIP-68 NFT standard, allowing for enhanced metadata standards, updatable
                reference scripts, and secure on-chain data management.
              </p>
            </div>

            {/* File Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer transition-colors ${
                file ? "border-blue-500 bg-blue-500/5" : "border-gray-600 hover:border-blue-500 hover:bg-blue-500/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {file ? (
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p>Drag your files here, or click to select</p>
                  <span className="text-sm text-gray-400">Support for images, audio, video and documents</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            {/* NFT Details */}
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
                  placeholder="Describe your NFT"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attributes (CIP-68 Metadata)</Label>

                <div className="space-y-3">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Trait type"
                        value={attr.trait_type}
                        onChange={(e) => updateAttribute(index, "trait_type", e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => updateAttribute(index, "value", e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAttribute(index)}
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
                  onClick={addAttribute}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Attribute
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceScript">Reference Script (CIP-68)</Label>
                <Textarea id="referenceScript" placeholder="Add optional reference script for on-chain data" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="royalties">Royalties (%)</Label>
                <Input id="royalties" type="number" min="0" max="100" step="0.1" defaultValue="5" />
              </div>

              <Button className="w-full gradient-bg text-white" onClick={mintNFT}>
                Mint NFT
              </Button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Preview</h2>

            <div className="flex flex-col items-center">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="NFT Preview"
                width={300}
                height={300}
                className="rounded-lg mb-6 object-contain bg-gray-800"
              />

              <div className="w-full">
                <h3 className="text-xl font-bold">{nftName || "NFT Name"}</h3>
                <p className="text-gray-400 mb-4">{description || "Description will appear here"}</p>

                <h4 className="font-medium mb-2">Attributes</h4>
                <div className="space-y-2 mb-6">
                  {attributes.some((attr) => attr.trait_type && attr.value) ? (
                    attributes.map((attr, index) =>
                      attr.trait_type && attr.value ? (
                        <div key={index} className="bg-blue-500/10 p-2 rounded-md">
                          <strong>{attr.trait_type}:</strong> {attr.value}
                        </div>
                      ) : null,
                    )
                  ) : (
                    <p>No attributes added yet</p>
                  )}
                </div>

                <h4 className="font-medium mb-2">CIP-68 Features</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Enhanced metadata standards</li>
                  <li>Updatable reference scripts</li>
                  <li>On-chain data with multi-witness protection</li>
                  <li>Reference NFT + user token model</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

