import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const apiUrl = "https://jsramverk-train-zazi.azurewebsites.net";

const httpLink = createHttpLink({
  uri: `${apiUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const authToken = "ctNqwDdwdzcWLou4Q5IDiGOSvI12YNvy";
  return {
    headers: {
      ...headers,
      authorization: authToken ? `Bearer ${authToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

reportWebVitals();
