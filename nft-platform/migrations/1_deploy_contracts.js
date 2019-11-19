var Miraco = artifacts.require("MiracoCore");
var Auction = artifacts.require("Auction");

module.exports = function (deployer, network, account) {
    console.log(account);
    console.log(network);
    // deploy Miraco
    deployer.deploy(Miraco, "Miraco", "MRC");

    // deploy Auction
    //deployer.deploy(Auction, Miraco.address, 0);
};
