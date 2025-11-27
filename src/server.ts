import app from "./app";
import { env } from "./config/env";
import { listEndpoints } from "./utils/route-lister";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  listEndpoints(app, PORT);
});
