import app from "./app";
import { dbConnect } from "./src/configs/db";

const PORT = 8200

dbConnect()

app.listen(PORT, () => {
    console.log( " server is listening on port", PORT)
})

