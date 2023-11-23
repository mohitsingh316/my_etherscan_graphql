// Import required modules and libraries
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");

// Import GraphQL schema from external file
const typeDefs = importSchema("./schema.graphql");

// Load environment variables from a .env file
require("dotenv").config();

// Define GraphQL resolvers
const resolvers = {
  Query: {
    // Resolver to get Ethereum balance by address
    getEthByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total supply of Ethereum
    getTotalSupplyEth: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // New Resolver: Get the latest Ethereum price
    getEthPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // New Resolver: Get estimation time per transaction
    getEstimationTimePerTransaction: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance with type definitions, resolvers, and data sources
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

// Set server timeout to 0 to disable it
server.timeout = 0;

// Start the Apollo Server on port 9000
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
