#!/usr/bin/env bash

# --- REPLACE THESE VALUES ---
PACKAGE_ID="0x70e5506b8aee54b13e82c383412a51a3b5b77ea6c4dbfe2ba28ab366cf98d741"
TREASURY_CAP_ID="0xab4c0d4b05d012d3b0f15da7fdc45e335b1596034933e2ec8d67b9ba7b158d21"
# Address to receive the minted coins
RECIPIENT_ADDRESS="0xb4fa4eadbdacd9d2b86d6eaa2f20df7cc1a584ca5273c7ba6a53770ad2118b6e"
# Amount to mint (100 SAL, considering 6 decimals)
MINT_AMOUNT=1000
# --- END REPLACE VALUES ---

echo "Building PTB to mint ${MINT_AMOUNT} SAL to ${RECIPIENT_ADDRESS}..."

sui client ptb \
  --move-call "${PACKAGE_ID}::my_coin::mint" \
      @${TREASURY_CAP_ID} \
      ${MINT_AMOUNT} \
      @${RECIPIENT_ADDRESS} \

echo "PTB execution submitted."