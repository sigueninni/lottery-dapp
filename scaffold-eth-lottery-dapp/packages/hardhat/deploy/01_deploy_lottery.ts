import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers";
const BET_PRICE = "1";
const BET_FEE = "0.2";
const TOKEN_RATIO = 1n;

const deployLottery: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    await deploy("Lottery", {
        from: deployer,
        log: true,
        autoMine: true,
        args: ["JamToken", "JAM", TOKEN_RATIO, parseEther(BET_PRICE), parseEther(BET_FEE)],
    });
};

export default deployLottery;

deployLottery.tags = ["Lottery"];