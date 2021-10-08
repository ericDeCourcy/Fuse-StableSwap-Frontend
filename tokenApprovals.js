
async function approveToken(button, tokenName, address, statusElementId) {
  button.disabled = true;
  console.log(`Clicked the 'Approve ${tokenName}' button.`);
  const statusMessage = document.getElementById(statusElementId);
  statusMessage.innerHTML = "Attempting to approve token...";
  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: "0x3B9ACA00", // gasPrice is 1 Gwei. customizable by user during MetaMask confirmation.
    gas: "0x0186A0", // customizable by user during MetaMask confirmation.
    to: address, // Required except during contract publications.
    from: ethereum.selectedAddress, // must match user's active address.
    value: '0x00', // Only required to send ether to the recipient from the initiating external account.    
    data:
      "0x095ea7b3"
      + fakeswapAddressPadded
      + maxApprovalAmount, // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x7a", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };
  
  let message = "";
  try {
    // request returns transaction hash
    await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    message = `Successfully approved ${tokenName}.`; 
    console.log(message);
  } catch(error) {
    message = `Could not approve ${tokenName}: ${error}`;
    console.error(message);
    button.disabled = false;
  } finally {
    statusMessage.innerHTML = message;
  }
}

async function approveDai(button) {
  await approveToken(button, "Fake-DAI", fakeDaiAddress, "approveDaiStatus");
}

async function approveUsdc(button) {
  await approveToken(button, "Fake-USDC", fakeUsdcAddress, "approveUsdcStatus");
}

async function approveUsdt(button) {
  await approveToken(button, "Fake-USDT", fakeUsdtAddress, "approveUsdtStatus");
}

async function approveLP(button) {
  await approveToken(button, "LP Token", fakeLPAddress, "approveLPStatus");
}
