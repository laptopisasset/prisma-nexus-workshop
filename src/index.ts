import { server } from "./server";

server
  .listen()
  .then(({ url }) => console.log(`🚀 Server listening in ${url}`))
  .catch(console.error);
