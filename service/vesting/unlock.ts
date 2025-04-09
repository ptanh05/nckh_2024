import {
    deserializeAddress,
    deserializeDatum,
    MeshTxBuilder,
    SLOT_CONFIG_NETWORK,
    unixTimeToEnclosingSlot,
} from "@meshsdk/core";
import { blockchainProvider, getScript, getWalletInfoForTx } from "./common";

async function unlock(wallet: any, txHashes: string[]) {
    const { scriptAddr, scriptCbor } = getScript();
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(
        wallet,
    );
    const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
    const { input: collateralInput, output: collateralOutput } = collateral;

    const txBuilder = new MeshTxBuilder({
        fetcher: blockchainProvider,
        submitter: blockchainProvider,
        verbose: true,
    });

    for (const txHash of txHashes) {
        const utxo = (await blockchainProvider.fetchUTxOs(txHash))[0];
        console.log("utxo : ", utxo);
        const datum = deserializeDatum(utxo.output.plutusData!);

        // Xử lý giá trị BigInt
        let datumInt;
        try {
            // Chuyển đổi BigInt sang Number một cách an toàn
            datumInt = Number(datum.fields[0].int);
            
            // Kiểm tra nếu giá trị vượt quá giới hạn của Number
            if (!Number.isSafeInteger(datumInt)) {
                console.warn("BigInt value exceeds safe integer range, using current time instead");
                datumInt = Date.now() - 15000;
            }
        } catch (error) {
            console.error("Error converting BigInt to number:", error);
            datumInt = Date.now() - 15000; // Fallback to current time
        }
        
        const currentTime = Date.now() - 15000;
        const timeValue = Math.min(datumInt, currentTime);

        const invalidBefore = Math.max(
            unixTimeToEnclosingSlot(
                timeValue,
                SLOT_CONFIG_NETWORK.preprod,
            ) + 1,
            1,
        );

        console.log(`Adding transaction input for txHash: ${txHash}`);

        await txBuilder
            .spendingPlutusScriptV3()
            .txIn(
                utxo.input.txHash,
                utxo.input.outputIndex,
                utxo.output.amount,
                scriptAddr,
            )
            .spendingReferenceTxInInlineDatumPresent()
            .spendingReferenceTxInRedeemerValue("")
            .txInScript(scriptCbor)
            .txOut(walletAddress, [])
            .invalidBefore(invalidBefore);
    }

    // Phần code còn lại giữ nguyên
    await txBuilder
        .txInCollateral(
            collateralInput.txHash,
            collateralInput.outputIndex,
            collateralOutput.amount,
            collateralOutput.address,
        )
        .requiredSignerHash(userPubKeyHash)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .setNetwork("preprod");

    const completeTx = await txBuilder.complete();
    const signedTx = await wallet.signTx(completeTx, true);
    const txHash = await wallet.submitTx(signedTx);
    return txHash;
}

export default unlock;
