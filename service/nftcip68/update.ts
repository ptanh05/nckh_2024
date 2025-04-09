import {
    CIP68_100,
    stringToHex,
    mConStr0,
    metadataToCip68,
    deserializeAddress,
    MeshTxBuilder,
    applyParamsToScript,
    resolveScriptHash,
    serializeAddressObj,
    serializePlutusScript,
    scriptAddress,
    PlutusScript,
    UTxO
  } from "@meshsdk/core";
  import { isEmpty, isNil } from "lodash";
  import plutus from './plutus.json';
  import { getWalletInfoForTx, blockchainProvider } from './adapter';

  // Constants
  const APP_WALLET_ADDRESS = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
  const appNetwork = "preprod";
  
  
  // Helper functions
  function readValidator(title: string): string {
    const validator = plutus.validators.find(v => v.title === title);
    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }
    return validator.compiledCode;
  }
  
  async function getUtxoForTx(address: string, txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address);
    const utxo = utxos.find(utxo => utxo.input.txHash === txHash);
    if (!utxo) throw new Error(`No UTXOs found for txHash: ${txHash}`);
    return utxo;
  }
  
  async function getAddressUTXOAsset(address: string, unit: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    if (utxos.length === 0) throw new Error(`No UTXOs found with asset: ${unit}`);
    return utxos[utxos.length - 1];
  }
 //const {wallet, connected} = useWalletContext();
  export async function updateTokens(wallet: any, params: { assetName: string; metadata: Record<string, string>; txHash?: string }[])
  : Promise<string> {
    try{

    // Get wallet information
    const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
    const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
    const exChange = APP_WALLET_ADDRESS;
    const pubkeyExchange = deserializeAddress(exChange).pubKeyHash;
    
      

    const unsignedTx = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider
    });
    
    // Get validators and scripts
    const mintCompilecode = readValidator("mint.mint.mint");
    const storeCompilecode = readValidator("store.store.spend");
    const storeScriptCbor = applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1), userPubKeyHash]);
        
    const storeScript: PlutusScript = {
      code: storeScriptCbor,
      version: "V3" as "V3",
    };
    
    const storeAddress = serializeAddressObj(
      scriptAddress(
        deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
        deserializeAddress(exChange).stakeCredentialHash,
        false,
      ),
      0,
    );
    
    const storeScriptHash = deserializeAddress(storeAddress).scriptHash;
    const mintScriptCbor = applyParamsToScript(mintCompilecode, [
      pubkeyExchange,
      BigInt(1),
      storeScriptHash,
      deserializeAddress(exChange).stakeCredentialHash,
      userPubKeyHash,
    ]);
    const policyId = resolveScriptHash(mintScriptCbor, "V3");
   
    // Process each token update
    await Promise.all(
      params.map(async ({ assetName, metadata, txHash }) => {
        const storeUtxo = !isNil(txHash)
          ? await getUtxoForTx(storeAddress, txHash)
          : await getAddressUTXOAsset(storeAddress, policyId + CIP68_100(stringToHex(assetName)));
        
        if (!storeUtxo) throw new Error("Store UTXO not found");
        
        unsignedTx
          .spendingPlutusScriptV3()
          .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
          .txInInlineDatumPresent()
          //.spendingReferenceTxInInlineDatumPresent()
          .txInRedeemerValue(mConStr0([]))
          .txInScript(storeScriptCbor)
          .txOut(storeAddress, [
            {
              unit: policyId + CIP68_100(stringToHex(assetName)),
              quantity: "1",
            }
          ])
          .txOutInlineDatumValue(metadataToCip68(metadata))
          
          
      }),
    );
           
    unsignedTx
      .txOut(exChange, [
        {
          unit: "lovelace",
          quantity: "1000000", // Platform fee
        },  
      ])
      .changeAddress(walletAddress)
      .requiredSignerHash(userPubKeyHash)
      
      .selectUtxosFrom(utxos)
      .txInCollateral(
        collateral.input.txHash, 
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .setNetwork("preprod");
    
    const completedTx = await unsignedTx.complete();
    const signedTx =await wallet.signTx(completedTx, true);
    const txHashUpdate = await wallet.submitTx(signedTx);
    return txHashUpdate;
  }catch(error){
    console.error("Error in updateTokens function:", error);
    throw error;
  }
  }
export default updateTokens;
