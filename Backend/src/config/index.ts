export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/focusflow",
  nodeEnv: process.env.NODE_ENV || "development",
};
