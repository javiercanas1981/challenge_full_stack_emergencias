import { configureWebServer, startWebServer } from "./bootstrap/src/webServer";

(async () => {
  try {
    const { app } = await configureWebServer();

    startWebServer(app);

    console.log(`Server running on port ${process.env.PORT || 4000}`);
  } catch (error) {
    console.error("Error starting server", error);
  }
})();
