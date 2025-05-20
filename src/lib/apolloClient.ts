import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: "https://cms.xessevents.com/graphql",
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;
