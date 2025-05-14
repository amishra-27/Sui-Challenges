import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

async function main() {
  // --- Step 1: Connect to the Sui Network ---
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const MY_ADDRESS = '0xb4fa4eadbdacd9d2b86d6eaa2f20df7cc1a584ca5273c7ba6a53770ad2118b6e';

  // --- Step 2: Initialize Your Signer ---
  const bech32key = 'suiprivkey1qq9g0yvk70sarpky0hsxmd82e2n3wlkl6ureu2skcjkalktl9djvgmdn5qm';
  const secretKey = decodeSuiPrivateKey(bech32key).secretKey
  const keypair = Ed25519Keypair.fromSecretKey(secretKey);
  const derivedAddress = keypair.getPublicKey().toSuiAddress();
  console.log('Derived Address:', derivedAddress);
  console.log('Expected Address:', MY_ADDRESS);

  // --- Step 3: Build the Transaction Block ---
  const tx = new Transaction();

  // 3a. Create a new Key object by calling key::new.
  const key = tx.moveCall({
    target: '0x684c26d5fedd570bbb3196e31f6053e7af904fdae3be9097976c13649a6e2a46::key::new',
    arguments: [],
  });

  // 3b. Set the Key's code to 2476.
  // Note: key::set_code returns nothing, so we don’t assign its output.
  tx.moveCall({
    target: '0x684c26d5fedd570bbb3196e31f6053e7af904fdae3be9097976c13649a6e2a46::key::set_code',
    arguments: [key, tx.pure.u64(2476)],
  });

  // 3c. Withdraw from the vault using the updated Key.
  // Use tx.sharedObject to mark the vault as a shared object.
  const flag = tx.moveCall({
    target: '0x684c26d5fedd570bbb3196e31f6053e7af904fdae3be9097976c13649a6e2a46::vault::withdraw',
    arguments: [
      tx.object('0x666d8afc1f7b440ec2b2e8521f26bac53b8bc380bcb8aab30e9fe5815c89cc96'),
      key,
    ],
  });

  // 3d. Transfer the newly created Flag to your address.
  tx.transferObjects([flag], MY_ADDRESS);

  // --- Step 4: Sign and Execute the Transaction ---
  try {
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
      },
    });
    console.log('Transaction executed successfully:', result);
  } catch (error) {
    console.error('Transaction execution failed:', error);
  }
}

main().catch((error) => {
  console.error('Error in main execution:', error);
});