/* global fakePool */
const activePool = fakePool;

// accounts (for metamask)
let accounts = [];

const tabs = {
  connection: document.getElementById('metamaskConnection'),
  approval: document.getElementById('tokenApproval'),
  actions: document.getElementById('actions')
};

const actionSectionTitles = [
  document.getElementById('depositTitle'),
  document.getElementById('swapTitle'),
  document.getElementById('withdrawTitle'),
  document.getElementById('rewardsTitle')
];

const actionSections = [
  document.getElementById('deposit'),
  document.getElementById('swap'),
  document.getElementById('withdraw'),
  document.getElementById('rewards')
];

function selectSection(sectionNumber) {
  actionSections.forEach(element => {
    element.hidden = true;
  });
  actionSections[sectionNumber].hidden = false;
  actionSectionTitles.forEach(element => {
    element.classList.remove('activeSection');
  })
  actionSectionTitles[sectionNumber].classList.add('activeSection');
}

const withdrawalSubsectionTitles = [
  document.getElementById('balancedWithdrawalTitle'),
  document.getElementById('imbalancedWithdrawalTitle'),
  document.getElementById('singleWithdrawalTitle')
];

const withdrawalSubsections = [
  document.getElementById('balancedWithdrawal'),
  document.getElementById('imbalancedWithdrawal'),
  document.getElementById('singleWithdrawal')
];

function selectSubsection(subsectionNumber) {
  withdrawalSubsections.forEach(element => {
    element.hidden = true;
  });
  withdrawalSubsections[subsectionNumber].hidden = false;
  withdrawalSubsectionTitles.forEach(element => {
    element.classList.remove('activeSection');
  })
  withdrawalSubsectionTitles[subsectionNumber].classList.add('activeSection');
  if (subsectionNumber === 0) { 
    getLPBalance();
  }
}

const arrayLength = '3'.padStart(64, '0');
const minAmount = '1'.padStart(64, '0');
// TODO eric can you rename these to something semantic plz
const txLengthMaybe = '60'.padStart(64, '0');
const deadline6ca33f73 = '6ca33f73'.padStart(64, '0'); // deadline of 2027-ish
const deadline62eb4611 = '62eb4611'.padStart(64, '0');


function showAttempting(statusElement, loggingKeyword) {
  const message = `Attempting ${loggingKeyword}...`;
  console.log(message);
  statusElement.innerHTML = message;
}

function showSuccess(statusElement, loggingKeyword) {
  const message = `${loggingKeyword} successful!`;
  console.log(message);
  statusElement.innerHTML = message;
}

function showError(statusElement, loggingKeyword, error) {
  console.error(`${loggingKeyword} failed: ${error.code} ${error.message}`);
  statusElement.innerHTML = `${loggingKeyword} failed. See console log for details.`;
}


async function ethRequest(params, statusElement, loggingKeyword) {
  try {
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [params],
    });
    showSuccess(statusElement, loggingKeyword);
  } catch (error) {
    showError(statusElement, loggingKeyword, error);
  }
}

async function connectToMetamask(button) {
  button.disabled = true;
  const loggingKeyword = 'Metamask connection';
  const statusElement = document.getElementById('transactionStatus');
  showAttempting(statusElement, loggingKeyword);

  try {
    if (!ethereum) {
      throw new ReferenceError('Could not access Metamask browser extension.');
    }
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    showSuccess(statusElement, loggingKeyword);
    continueToApprovalTab();
  } catch (error) {
    showError(statusElement, loggingKeyword);
  } finally {
    button.disabled = false;
  }
}

function continueToApprovalTab() {
  tabs.connection.hidden = true;
  tabs.approval.hidden = false;
  tabs.actions.hidden = true;
}

//TODO alanna simplify this function
async function approveToken(button, tokenName, address, statusElementId) {
  button.disabled = true;
  const loggingKeyword = tokenName + ' approval';
  const statusMessage = document.getElementById(statusElementId);
  showAttempting(loggingKeyword, statusMessage);
  
  transactionData = 
    '0x095ea7b3'                                                    // function signature
    + activePool.address.replace(/^0x/, '').padStart(64, '0')       // fake swap address
    + ''.padStart(64, 'f');                                         // max amount
  transactionParams = activePool.getTransactionParams(transactionData);
  transactionParams['to'] = address;
  transactionParams['gas'] = '0x0186A0';
  
  try {
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParams],
    });
    showSuccess(statusElement, loggingKeyword)
  } catch(error) {
    showError(statusElement, loggingKeyword);
    button.disabled = false;
  }
}

async function approveDai(button) {
  const fakeDaiAddress = '0xa277bc1c1612Bb327D79746475aF29F7a93e8E64';
  await approveToken(button, 'Fake-DAI', fakeDaiAddress, 'approveDaiStatus');
}

async function approveUsdc(button) {
  const fakeUsdcAddress = '0x88c784FACBE88A20601A32Bd98d9Da8d59d08F92';
  await approveToken(button, 'Fake-USDC', fakeUsdcAddress, 'approveUsdcStatus');
}

async function approveUsdt(button) {
  const fakeUsdtAddress = '0xa479351d97e997EbCb453692Ef16Ce06730bEBF4';
  await approveToken(button, 'Fake-USDT', fakeUsdtAddress, 'approveUsdtStatus');
}

async function approveLP(button) {
  await approveToken(button, 'LP Token', activePool.LPTokenAddress, 'approveLPStatus');
}


function continueToActionsTab() {
  tabs.connection.hidden = true;
  tabs.approval.hidden = true;
  tabs.actions.hidden = false;
  populateActionOptions();
}

function populateActionOptions() {
  const swapForm = document.getElementById('swapForm');
  swapForm.innerHTML += activePool.getSelectTokenHTML(
    'Token for swap input:', 'swapTokenIndexIn');
  swapForm.innerHTML += activePool.getSelectTokenHTML(
'Token for swap output:', 'swapTokenIndexOut');
  
  const singleWithdrawalForm = document.getElementById('singleWithdrawalForm');
  singleWithdrawalForm.innerHTML = activePool.getSelectTokenHTML(
    'Withdrawal Token:', 'singleTokenIndex') + singleWithdrawalForm.innerHTML;
  
  const depositForm = document.getElementById('depositForm');
  depositForm.innerHTML = activePool.getInputTokenAmountHTML(
    'to deposit:', 'ToDeposit');

  const imbalancedWithdrawalForm = document.getElementById('imbalancedWithdrawalForm');
  imbalancedWithdrawalForm.innerHTML = activePool.getInputTokenAmountHTML(
    'desired:', 'ImbalancedOut');
}

// TODO fix precision losses here
function getPaddedHexDai(inputElementId) {
  return getPaddedHex(document.getElementById(inputElementId).value * 1e+18);
}

// TODO assess precision lossiness
function getPaddedHexUsd(inputElementId) {
  return getPaddedHex(document.getElementById(inputElementId).value * 1e+6);
}

function getPaddedHex(input) {
  return input.toString(16).padStart(64, '0');
}

async function deposit(button) {
  button.disabled = true;
  const loggingKeyword = 'Deposit';
  statusElement = document.getElementById('depositStatus');
  showAttempting(loggingKeyword, statusElement);
  
  let transactionData = 
    '0x4d49e87d' // function signature
    + txLengthMaybe
    + minAmount
    + deadline62eb4611
    + arrayLength
    + getPaddedHexDai('Fake-DAIToDeposit')
    + getPaddedHexUsd('Fake-USDCToDeposit')
    + getPaddedHexUsd('Fake-USDTToDeposit');

  //approves Fake USDC for transfer into the stableswap frontend
  const transactionParams = activePool.getTransactionParams(transactionData);

  await ethRequest(transactionParams, statusElement, loggingKeyword);
  button.disabled = false;
}


async function getLPBalance() {
    // construct tx params
    let funcSig = '0x70a08231';

    // TODO: does ethereum.selectedAddress have the '0x' stripped off?
    //    we need it to not, and to have padding 0's
    let encodedBalanceTx = funcSig + ''.padStart(24, '0') + ethereum.selectedAddress.slice(2,);

    LPBalance = await ethereum.request({ 
      method: 'eth_call',
      params:  [{
        to: activePool.LPTokenAddress,
        data: encodedBalanceTx
      }]
    }); 
    
    document.getElementById('LPTokenBalance').innerHTML = 'Your LP Token balance: ' + (parseInt(LPBalance,16) / 1e+18);
}


async function swap(button) {
  button.disabled = true;
  const loggingKeyword = 'Swap';
  statusElement = document.getElementById('swapStatus');
  showAttempting(loggingKeyword, statusElement);

  const swapTokenIndexIn = document.getElementById('swapTokenIndexIn');
  const swapTokenIndexOut = document.getElementById('swapTokenIndexOut');
  const swapAmountIn = document.getElementById('swapAmountIn');

  // TODO eric - you performed the usual input formatting in a slightly different order in this one -
  // padding then scaling instead of vice versa. not sure if this matters. can you replace with my formatting
  // functions as above if applicable?
  let tokenIndexIn = swapTokenIndexIn.value;
  let tokenIndexOut = swapTokenIndexOut.value;

  // pad token indexes (with 63 zeros, cuz we are lazy and they should always be one digit in hex)
  // since they should be 9 or less, we don't need to convert to hex since 0-9 is same in decimal and hex
  tokenIndexInPadded = tokenIndexIn.padStart(64, '0');
  tokenIndexOutPadded = tokenIndexOut.padStart(64, '0');

  // amountIn
  swapAmount = swapAmountIn.value;

  let swapAmountScaled = 0;
  if(tokenIndexIn == 0)
  {
    swapAmountScaled = swapAmount * 1e+18;
  }
  else  // either usdc or usdt
  {
    swapAmountScaled = swapAmount * 1e+6;
  }
  
  const transactionData = 
    '0x91695586' // function signature
    + tokenIndexInPadded 
    + tokenIndexOutPadded 
    + getPaddedHex(swapAmountScaled) 
    + minAmount 
    + deadline6ca33f73;

  const transactionParams = activePool.getTransactionParams(transactionData);

  await ethRequest(transactionParams, statusElement, loggingKeyword);
  button.disabled = false;
}


async function withdrawBalanced(button) {
  button.disabled = true;
  const loggingKeyword = 'Balanced Withdrawal';
  statusElement = document.getElementById('withdrawBalancedStatus');
  showAttempting(loggingKeyword, statusElement);

  // get desired amount of LP tokens to withdraw
  let withdrawAmount = withdrawAmountInput.value;
  // multiply by 1e+18, then convert to hex
  let withdrawAmountScaled = withdrawAmount * 1e+18;
  let withdrawAmountHex = getPaddedHex(withdrawAmountScaled);

  // set min amounts
  // TODO: actually pick some reasonable amounts (maybe a 5% max diff...?)
  //    might need to call 'calculate withdraw tokens'
  // TODO: make deadline use local time plus reasonable window
  let transactionData = 
    '0x31cd52b0'        // function signature
    + withdrawAmountHex
    + txLengthMaybe
    + deadline62eb4611
    + arrayLength
    + minAmount         // min DAI to recieve = 1 unit
    + minAmount         // min USDC
    + minAmount;        // min USDT

  const transactionParams = activePool.getTransactionParams(transactionData);

  await ethRequest(transactionParams, statusElement, loggingKeyword);
  button.disabled = false;
}


async function withdrawImbalanced(button) {
  button.disabled = true;
  statusElement = document.getElementById('withdrawImbalancedStatus');
  showAttempting(statusElement, loggingKeyword);

  // TODO add in optional amount of max LP tokens to burn
  // to get max burn amount, get their LP balance and set it to that
  let encodedBalanceTx = 
    '0x70a08231' 
    + ''.padStart(24, '0')
    + ethereum.selectedAddress.slice(2,);

  // TODO add await and error handling for this as well
  let LPBalance = await ethereum.request({ 
    method: 'eth_call',
    params:  [{
      to: activePool.LPTokenAddress,
      data: encodedBalanceTx
    }]
  }); 

  console.log('LP Balance = ' + LPBalance);
  let LPBalanceFormatted = LPBalance.slice(2,);

  let transactionData = 
    '0x84cdd9bc'                              // function signature
    + txLengthMaybe
    + LPBalanceFormatted                      // max burn amount
    + deadline6ca33f73
    + arrayLength
    + getPaddedHexDai('Fake-DAIImbalancedOut')
    + getPaddedHexUsd('Fake-USDCImbalancedOut')
    + getPaddedHexUsd('Fake-USDTImbalancedOut');

  const transactionParams = activePool.getTransactionParams(transactionData);
  
  await ethRequest(transactionParams, statusElement, 'Imbalanced Withdrawal');
  button.disabled = false;
}


async function withdrawSingleToken(button) {
  button.disabled = true;
  const loggingKeyword = 'Single Token Withdrawal';
  statusElement = document.getElementById('singleWithdrawStatus');
  showAttempting(statusElement, loggingKeyword);
  
  const singleTokenIndex = document.getElementById('singleTokenIndex');
  let tokenIndexIn = singleTokenIndex.value;
  let tokenIndexHex = tokenIndexIn.toString(16);  //need this to ensure some jerk didn't put in like 0.7 or something. Should round to hex whole number

  const singleTokenAmount = document.getElementById('singleTokenAmount');
  let tokenAmountIn = singleTokenAmount.value;
  
  // TODO eric shouldn't this be 18 or 6 depending on whether it's dai or usdX?
  // didn't use my convenience functions bc i wasn't sure if this was a special case...
  amountInHex = (tokenAmountIn * 1e+18).toString(16); //scaled by 1e18 cuz DAI be likethat

  const amountInPadded = amountInHex.padStart(64, '0');
  const indexInPadded = tokenIndexHex.padStart(64, '0');

  transactionData = 
    '0x3e3a1560'      // function signature
    + amountInPadded  // amount LP in
    + indexInPadded   // token index
    + minAmount;      // min out
  
  const transactionParams = activePool.getTransactionParams(transactionData);

  await ethRequest(transactionParams, statusElement, loggingKeyword);
  button.disabled = false;
}


async function claimRewards(button) {
  button.disabled = true;
  const loggingKeyword = 'Claim Rewards';
  statusElement = document.getElementById('getRewardsStatus');
  showAttempting(statusElement, loggingKeyword);

  const rewardClaimMessageData = '0xc00007b00000000000000000000000001d7216e115f8884016004e3f390d824f0cec4afc';
  const transactionParams = activePool.getRewardTransactionParams(rewardClaimMessageData);

  ethRequest(transactionParams, statusElement, loggingKeyword);
  button.disabled = false;
}