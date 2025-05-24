// scripts/deployFactory.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying TokenFactory with:", deployer.address);
  
    const Factory = await ethers.getContractFactory("TokenFactory");
    const factory = await Factory.deploy();
    await factory.deployed();
  
    console.log("TokenFactory deployed to:", factory.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
  