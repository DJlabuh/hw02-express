import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";

import app from "../app.js";

import User from "../models/user.js";

const { PORT, DB_HOST_TEST } = process.env;

describe("test login route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login with correct data", async () => {
    const userData = {
      email: "david@gmail.com",
      password: "123456",
    };

    // Create a new user for testing
    await User.create(userData);

    const response = await request(app).post("/api/users/login").send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty(
      "subscription",
      expect.any(String)
    );

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
  });
});
