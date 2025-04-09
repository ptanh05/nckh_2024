// "use client";

// import { useState } from "react";
// import { useWallet } from '@meshsdk/react';

// export default function Home() {
//   const { connected, wallet } = useWallet();
//   const [assets, setAssets] = useState<null | any>(null);
//   const [address, setAddress] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   async function getAssets() {
//     if (wallet) {
//       setLoading(true);
//       const _assets = await wallet.getAssets();
//       setAssets(_assets);
      
//       // Get wallet address
//       const usedAddresses = await wallet.getUsedAddresses();
//       if (usedAddresses.length > 0) {
//         setAddress(usedAddresses[0]);
//       }
      
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Blockchain Heritage Management System</h1>
      
//       {!connected ? (
//         <div className="p-6 bg-slate-800 rounded-lg mb-8">
//           <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
//           <p className="mb-4">Please connect your Cardano wallet using the wallet button in the navigation bar to access your digital assets.</p>
//         </div>
//       ) : (
//         <>
//           <div className="p-6 bg-slate-800 rounded-lg mb-8">
//             <h2 className="text-xl font-semibold mb-4">Wallet Connected</h2>
//             {address && (
//               <div className="mb-4">
//                 <p className="text-sm text-gray-400">Your Address:</p>
//                 <p className="font-mono break-all bg-slate-700 p-2 rounded">{address}</p>
//               </div>
//             )}
            
//             {!assets ? (
//               <button
//                 type="button"
//                 onClick={() => getAssets()}
//                 disabled={loading}
//                 className={`px-4 py-2 rounded ${loading ? 'bg-orange-500' : 'bg-blue-600'} text-white`}
//               >
//                 {loading ? 'Loading...' : 'View My Assets'}
//               </button>
//             ) : (
//               <div>
//                 <h3 className="text-lg font-medium mb-2">Your Assets:</h3>
//                 <div className="bg-slate-700 p-4 rounded-lg max-h-96 overflow-auto">
//                   <pre className="text-sm">
//                     <code>{JSON.stringify(assets, null, 2)}</code>
//                   </pre>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div className="p-6 bg-slate-800 rounded-lg">
//               <h2 className="text-xl font-semibold mb-4">Mint NFT</h2>
//               <p className="mb-4">Create new digital assets on the Cardano blockchain.</p>
//               <Link href="/mint-nft" className="text-blue-400 hover:underline">Get Started</Link>
//             </div>
            
//             <div className="p-6 bg-slate-800 rounded-lg">
//               <h2 className="text-xl font-semibold mb-4">Update NFT</h2>
//               <p className="mb-4">Modify metadata of your existing digital assets.</p>
//               <Link href="/update-nft" className="text-blue-400 hover:underline">Get Started</Link>
//             </div>
            
//             <div className="p-6 bg-slate-800 rounded-lg">
//               <h2 className="text-xl font-semibold mb-4">Lock Assets</h2>
//               <p className="mb-4">Secure your digital legacy with time-locked assets.</p>
//               <Link href="/lock-assets" className="text-blue-400 hover:underline">Get Started</Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }