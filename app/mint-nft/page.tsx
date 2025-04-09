"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import mintNFT from "@/service/nftcip68/mint"; // Import hàm mintNFT
import { PinataSDK } from "pinata";
import { deserializeAddress } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import {
  createTransaction,
  getUserByWalletAddress,
  getUserTransactions,
} from "@/app/services/transactionService";

export default function MintNFT() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("/placeholder.svg?height=300&width=300");
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }]);
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [mintHistory, setMintHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { connected, wallet } = useWallet();

  // Pinata configuration
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
    "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
    "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
    "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
    "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
    "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
    "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
    "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
    "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
  const pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
  const pinata = new PinataSDK({ pinataJwt: JWT, pinataGateway: pinataGateway });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  // Convert attributes to metadata format
  const formatAttributesForMetadata = () => {
    const formattedAttributes: Record<string, string> = {};
    attributes.forEach((attr) => {
      if (attr.trait_type && attr.value) {
        formattedAttributes[attr.trait_type] = attr.value;
      }
    });
    return formattedAttributes;
  };

  // Hàm lấy lại danh sách mint history (chỉ lấy giao dịch có transaction_type === "mint")
  const fetchMintHistory = async () => {
    try {
      if (!wallet || !connected) return;
      const userAddress = await wallet.getChangeAddress();
      const txs = await getUserTransactions(userAddress);
      const mintTxs = txs.filter((tx: any) => tx.transaction_type === "mint");
      setMintHistory(mintTxs);
    } catch (error) {
      console.error("Error fetching mint history:", error);
    }
  };

  const handleMint = async () => {
    if (!file) {
      alert("Please select a file for your NFT");
      return;
    }
    if (!nftName) {
      alert("Please enter a name for your NFT");
      return;
    }

    setMintLoading(true);
    try {
      // Upload file to IPFS using Pinata
      const uploadResult = await pinata.upload.public.file(file);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Upload failed");
      }
      const ipfsUrl = `ipfs://${uploadResult.cid}`;

      // Kiểm tra ví đã kết nối
      if (!connected) {
        alert("Please connect your wallet");
        return;
      }
      const useraddr = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKeyHash } = deserializeAddress(useraddr);

      // Prepare metadata với attributes
      const metadata = {
        name: nftName,
        _pk: userPubKeyHash,
        image: ipfsUrl,
        mediaType: file.type,
        description: description,
        ...formatAttributesForMetadata(),
      };

      // Gọi hàm mintNFT và nhận txHash
      const txHash = await mintNFT(wallet, nftName, metadata, {});
      alert(`NFT minted successfully! Transaction hash: ${txHash}`);

      // Sau khi mint thành công, lưu giao dịch với transaction_type là "mint"
      // Vì mint không cần giá trị amount hay to_address, ta sẽ gán:
      // - from_address là địa chỉ ví hiện tại
      // - to_address cũng là địa chỉ ví hiện tại
      // - amount: gán mặc định là 0 (hoặc có thể chỉnh sửa theo logic nếu cần)
      const userData = await getUserByWalletAddress(useraddr);
      if (!userData) {
        throw new Error("User not found");
      }
      const newTx = {
        user_id: userData.id,
        from_address: useraddr,
        to_address: useraddr,
        transaction_type: "mint",
        amount: 1, // dùng giá trị mặc định do mint không cần amount
        txHash: txHash,
        expire_at: null,
      };
      await createTransaction(newTx);

      // Load lại mint history sau khi tạo giao dịch mint mới
      fetchMintHistory();
    } catch (error) {
      console.error("Minting error:", error);
      alert(`Failed to mint NFT: ${error}`);
    } finally {
      setMintLoading(false);
    }
  };

  // Fetch mint history khi component load hoặc khi ví thay đổi
  useEffect(() => {
    if (connected && wallet) {
      fetchMintHistory();
    }
  }, [connected, wallet]);

  return (
    <main>
  
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
                <Label htmlFor="royalties">Royalties (%)</Label>
                <Input id="royalties" type="number" min="0" max="100" step="0.1" defaultValue="5" />
              </div>
              <Button
                className="w-full gradient-bg text-white"
                onClick={handleMint}
                disabled={mintLoading}
              >
                {mintLoading ? "Minting..." : "Mint NFT"}
              </Button>
            </div>
          </div>
          {/* Preview Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Preview</h2>
            <div className="flex flex-col items-center">
              <Image
                src={previewUrl}
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
                      ) : null
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
        {/* Mint History Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Mint History</h2>
          {mintHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-2 text-left">Tx ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">TxHash</th>
                  </tr>
                </thead>
                <tbody>
                  {mintHistory.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-200">
                      <td className="p-2">{tx.id}</td>
                      <td className="p-2">{new Date(tx.create_at).toLocaleString()}</td>
                      <td className="p-2">{tx.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No mint transactions found.</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
