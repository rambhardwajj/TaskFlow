import app from "./app";
import { dbConnect } from "./configs/db";
import { envConfig } from "./configs/env";

const PORT = envConfig.PORT ||  8200

dbConnect()

app.listen(PORT, () => {
    console.log( " server is listening on port", PORT)
})

