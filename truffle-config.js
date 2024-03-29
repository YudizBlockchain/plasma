module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 6721975,
      network_id: "*", // Match any network id
    }
  },
  compilers: {
    solc: {
      version:  "0.4.19"
    }
  }
};
