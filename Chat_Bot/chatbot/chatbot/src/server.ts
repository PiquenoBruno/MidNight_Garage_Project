import { app } from "./app";
import { config } from "dotenv";
config()

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`http://localhost:${port}/chatbot`)
})