// scripts/deploy-with-vesting.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    // Deploy TokenFactory (which auto-deploys TokenVesting in constructor)
    console.log("\nDeploying TokenFactory...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const factory = await TokenFactory.deploy();
    await factory.deployed();
    
    console.log("✅ TokenFactory deployed to:", factory.address);
    
    // Get the vesting contract address
    const vestingAddress = await factory.getVestingContract();
    console.log("✅ TokenVesting deployed to:", vestingAddress);
    
    // Set treasury address (can be changed to a multisig later)
    console.log("\nSetting treasury address...");
    const treasuryAddress = deployer.address; // Using deployer as treasury for now
    const setTreasuryTx = await factory.setTreasury(treasuryAddress);
    await setTreasuryTx.wait();
    console.log("✅ Treasury set to:", treasuryAddress);
    
    console.log("\n=== Deployment Summary ===");
    console.log("TokenFactory:", factory.address);
    console.log("TokenVesting:", vestingAddress);
    console.log("Treasury:", treasuryAddress);
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update WARP.md with new contract addresses");
    console.log("2. Copy ABIs to frontend: contracts/abi/");
    console.log("3. Update frontend hooks with new contract addresses");
    console.log("4. Test token creation with vesting");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
