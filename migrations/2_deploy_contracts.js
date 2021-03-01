const Maison = artifacts.require("Maison");

module.exports = function(deployer) {
  deployer.deploy(Maison);
};
