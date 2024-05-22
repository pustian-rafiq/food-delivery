import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from "@apollo/client";



const httpLink = createHttpLink({
    uri: process.env.SERVER_ENDPOINT
});

const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        accessToken: "ddfdfdff",
        refreshToken: "kjhjshj",
      },
    });
    return forward(operation);
});

export const client = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
})