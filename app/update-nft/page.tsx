"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@meshsdk/react";
import updateTokens from "@/service/nftcip68/update"; // Import hàm updateTokens
import { toast } from "@/components/ui/use-toast"; // Import toast cho thông báo
import { deserializeAddress } from "@meshsdk/core";

// Import các hàm giao dịch
import {
  createTransaction,
  getUserByWalletAddress,
  getUserTransactions,
} from "@/app/services/transactionService";

export default function UpdateNFT() {
  const { connected, wallet } = useWallet();
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [metadata, setMetadata] = useState([{ key: "", value: "" }]);
  const [contentType, setContentType] = useState("none");
  const [assetName, setAssetName] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateHistory, setUpdateHistory] = useState<any[]>([]);

  const addMetadataField = () => {
    setMetadata([...metadata, { key: "", value: "" }]);
  };

  const removeMetadataField = (index: number) => {
    const newMetadata = [...metadata];
    newMetadata.splice(index, 1);
    setMetadata(newMetadata);
  };

  const updateMetadataField = (index: number, field: "key" | "value", value: string) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
  };

  // Hàm prepareMetadata như trước nhưng có thêm thuộc tính động
  const prepareMetadata = async () => {
    const useraddr = await wallet.getChangeAddress();
    const { pubKeyHash: userPubKeyHash } = deserializeAddress(useraddr);

    const metadataObj: Record<string, any> = {
      name: nftName,
      description: description,
      _pk: userPubKeyHash,
    };

    if (contentType !== "none") {
      metadataObj.contentType = contentType;
    }

    // Thêm các field metadata động
    metadata.forEach((item) => {
      if (item.key && item.key.trim() !== "") {
        metadataObj[item.key] = item.value;
      }
    });

    return metadataObj;
  };

  // Hàm fetchUpdateHistory để lấy lại các giao dịch update có transaction_type === "update"
  const fetchUpdateHistory = async () => {
    try {
      if (!wallet || !connected) return;
      const userAddress = await wallet.getChangeAddress();
      const txs = await getUserTransactions(userAddress);
      // Lọc ra giao dịch có kiểu "update"
      const updateTxs = txs.filter((tx: any) => tx.transaction_type === "update");
      setUpdateHistory(updateTxs);
    } catch (error) {
      console.error("Error fetching update history:", error);
    }
  };

  const handleUpdateNFT = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!assetName) {
      toast({
        title: "Missing information",
        description: "Please enter the asset name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const metadataObj = await prepareMetadata();

      const params = [
        {
          assetName,
          metadata: metadataObj,
          txHash: txHash || undefined,
        },
      ];

      // Gọi hàm updateTokens và nhận txHashResult
      const txHashResult = await updateTokens(wallet, params);

      toast({
        title: "NFT Updated Successfully",
        description: `Transaction Hash: ${txHashResult}`,
        variant: "default",
      });
      
      // Lưu giao dịch cập nhật với transaction_type là "update"
      const useraddr = await wallet.getChangeAddress();
      const userData = await getUserByWalletAddress(useraddr);
      if (!userData) {
        throw new Error("User not found");
      }
      const newTx = {
        user_id: userData.id,
        from_address: useraddr,
        to_address: useraddr,
        transaction_type: "update",
        amount: 1, // Giá trị mặc định cho update
        txHash: txHashResult,
        expire_at: null,
      };
      await createTransaction(newTx);

      // Fetch lại lịch sử cập nhật
      fetchUpdateHistory();

      // Nếu cần, reset form hoặc chuyển hướng
      // setNftName("");
      // setDescription("");
      // setMetadata([{ key: "", value: "" }]);
      // setAssetName("");
      // setTxHash("");

    } catch (error) {
      console.error("Error updating NFT:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the NFT.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch update history khi component load hoặc khi ví thay đổi
  useEffect(() => {
    if (connected && wallet) {
      fetchUpdateHistory();
    }
  }, [connected, wallet]);

  return (
    <main>
      

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8">Update NFT Metadata</h1>

        {!connected && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
            Please connect your wallet to update NFT metadata.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update Form */}
          <div className="card-bg p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  placeholder="Enter asset name to update"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash (Optional)</Label>
                <Input
                  id="txHash"
                  placeholder="Enter transaction hash if known"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>

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

              <Button 
                className="w-full gradient-bg text-white" 
                onClick={handleUpdateNFT}
                disabled={!connected || isUpdating}
              >
                {isUpdating ? "Updating..." : "Update NFT Metadata"}
              </Button>
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
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="font-medium text-gray-400">Asset Name</span>
                    <span>{assetName || "—"}</span>
                  </div>
                  {metadata.map((item, index) =>
                    item.key ? (
                      <div key={index} className="flex justify-between border-b border-white/10 pb-2">
                        <span className="font-medium text-gray-400">{item.key}</span>
                        <span>{item.value || "—"}</span>
                      </div>
                    ) : null
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

        {/* Update History Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Update History</h2>
          {updateHistory.length > 0 ? (
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
                  {updateHistory.map((tx) => (
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
            <p className="text-center text-gray-500">No update transactions found.</p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
