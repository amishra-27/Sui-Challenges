#!/usr/bin/env bash

# --- REPLACE THESE VALUES ---
PACKAGE_ID="0x70e5506b8aee54b13e82c383412a51a3b5b77ea6c4dbfe2ba28ab366cf98d741"
TREASURY_CAP_ID="0xab4c0d4b05d012d3b0f15da7fdc45e335b1596034933e2ec8d67b9ba7b158d21"
# !!! IMPORTANT !!!
# Replace this with the Object ID of the specific Coin<...> object you want to burn.
# You must get this ID *after* minting, using `sui client objects`.
COIN_TO_BURN_ID="0x34829d1c99bde0a3fc21744eddf6cbb40681790cdb4d9358256b0ff4df05a3ac"
# --- END REPLACE VALUES ---

echo "Building PTB to burn coin object ${COIN_TO_BURN_ID}..."

sui client ptb \
  --move-call "${PACKAGE_ID}::my_coin::burn" \
      @${TREASURY_CAP_ID} \
      @${COIN_TO_BURN_ID} \

echo "PTB execution submitted."