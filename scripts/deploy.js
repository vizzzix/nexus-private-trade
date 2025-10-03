const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting PrivateDEX deployment...");

  // Get the contract factories
  const FHEVMIntegration = await ethers.getContractFactory("FHEVMIntegration");
  const PrivateDEX = await ethers.getContractFactory("PrivateDEX");
  const LiquidityManager = await ethers.getContractFactory("LiquidityManager");

  // Deploy FHEVM Integration contract first
  console.log("📦 Deploying FHEVM Integration contract...");
  const fhevmIntegration = await FHEVMIntegration.deploy(ethers.ZeroAddress); // Mock FHEVM address
  await fhevmIntegration.waitForDeployment();
  const fhevmIntegrationAddress = await fhevmIntegration.getAddress();
  console.log("✅ FHEVM Integration deployed to:", fhevmIntegrationAddress);

  // Deploy PrivateDEX contract
  console.log("📦 Deploying PrivateDEX contract...");
  const privateDEX = await PrivateDEX.deploy(fhevmIntegrationAddress);
  await privateDEX.waitForDeployment();
  const privateDEXAddress = await privateDEX.getAddress();
  console.log("✅ PrivateDEX deployed to:", privateDEXAddress);

  // Deploy LiquidityManager contract
  console.log("📦 Deploying LiquidityManager contract...");
  const liquidityManager = await LiquidityManager.deploy(privateDEXAddress, fhevmIntegrationAddress);
  await liquidityManager.waitForDeployment();
  const liquidityManagerAddress = await liquidityManager.getAddress();
  console.log("✅ LiquidityManager deployed to:", liquidityManagerAddress);

  // Set up initial configuration
  console.log("⚙️ Setting up initial configuration...");
  
  // Add some mock trading pairs
  const mockTokens = {
    ETH: "0x0000000000000000000000000000000000000000", // ETH address
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT on mainnet (for testing)
    BTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC on mainnet (for testing)
  };

  // Add trading pairs
  await privateDEX.addTradingPair("ETH/USDT", mockTokens.ETH, mockTokens.USDT);
  await privateDEX.addTradingPair("BTC/ETH", mockTokens.BTC, mockTokens.ETH);
  await privateDEX.addTradingPair("BTC/USDT", mockTokens.BTC, mockTokens.USDT);
  console.log("✅ Trading pairs added");

  // Add supported tokens to liquidity manager
  await liquidityManager.addSupportedToken(mockTokens.ETH);
  await liquidityManager.addSupportedToken(mockTokens.USDT);
  await liquidityManager.addSupportedToken(mockTokens.BTC);
  console.log("✅ Supported tokens added to liquidity manager");

  // Create liquidity pools
  await liquidityManager.createPool(mockTokens.ETH, mockTokens.USDT);
  await liquidityManager.createPool(mockTokens.BTC, mockTokens.ETH);
  await liquidityManager.createPool(mockTokens.BTC, mockTokens.USDT);
  console.log("✅ Liquidity pools created");

  // Set up contract relationships
  await privateDEX.setFHEVMContract(fhevmIntegrationAddress);
  await liquidityManager.setDEXContract(privateDEXAddress);
  console.log("✅ Contract relationships established");

  // Display deployment summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("=" * 50);
  console.log("📋 Contract Addresses:");
  console.log(`FHEVM Integration: ${fhevmIntegrationAddress}`);
  console.log(`PrivateDEX: ${privateDEXAddress}`);
  console.log(`LiquidityManager: ${liquidityManagerAddress}`);
  console.log("=" * 50);
  console.log("🔗 Trading Pairs:");
  console.log("- ETH/USDT");
  console.log("- BTC/ETH");
  console.log("- BTC/USDT");
  console.log("=" * 50);
  console.log("📝 Next Steps:");
  console.log("1. Update frontend with contract addresses");
  console.log("2. Configure FHEVM integration");
  console.log("3. Test private trading functionality");
  console.log("4. Deploy to testnet for testing");

  // Save deployment info to file
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      FHEVMIntegration: fhevmIntegrationAddress,
      PrivateDEX: privateDEXAddress,
      LiquidityManager: liquidityManagerAddress,
    },
    tradingPairs: ["ETH/USDT", "BTC/ETH", "BTC/USDT"],
    supportedTokens: mockTokens,
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
