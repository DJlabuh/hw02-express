import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";

import app from "../../app.js";

import User from "../../models/user.js";

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
      email: "bemol@gmail.com",
      password: "123456",
    };

    // Сначала создаем пользователя
    const createdUser = await User.create(userData);

    // Выполняем вход с данными созданного пользователя
    const { statusCode, body } = await request(app)
      .post("/api/auth/users/login")
      .send(userData);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("token");
    expect(body.user).toHaveProperty("email", userData.email);
    expect(body.user).toHaveProperty("subscription", expect.any(String));

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
  });
});
