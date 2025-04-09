import {
    deserializeAddress,
    mConStr0,
    MeshTxBuilder,  
    Transaction,
    Asset
  } from "@meshsdk/core";
  import {
    getScript,
    blockchainProvider,
    getWalletInfoForTx,
  } from "./common";
  async function lock(wallet: any, beneficiary: string, assets: Asset[], lockUntilTimeStamp: number) {
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
   
    const { scriptAddr, scriptCbor } = getScript();
   
    const txBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
    });
  
    const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
    const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(beneficiary);
    await txBuilder
      .txOut(scriptAddr, assets)
      .txOutInlineDatumValue(
        mConStr0([lockUntilTimeStamp, ownerPubKeyHash, beneficiaryPubKeyHash])
      )
      .changeAddress(walletAddress)
      
      .selectUtxosFrom(utxos)
      .complete();
  
    const unsignedTx = txBuilder.txHex;
    const tx = new Transaction({initiator: wallet});
    
  
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    return txHash;
  }
  export default lock;
  