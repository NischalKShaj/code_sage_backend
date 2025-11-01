// file to setup the config for the cors

// setting up the cors options
const corsOptions = {
  origin: "http://192.168.0.249:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
};

export default corsOptions;
