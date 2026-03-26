import app from "./app.js";
import { envVars } from "./config/env.js";
const port = envVars.PORT;
const bootstrap = () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();