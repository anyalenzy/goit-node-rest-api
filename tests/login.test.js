import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import app from "../app_test.js";
import "dotenv/config";

mongoose.set("strictQuery", false);

const { DB_TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    console.log("Connect to database, clear old data and create new user");
    await mongoose.connect(DB_TEST_URI);
    await User.deleteMany();
    const passwordHash = await bcrypt.hash("123456", 10);
    const user = new User({
      email: "testLoginUser@gmail.com",
      password: passwordHash,
    });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_TEST_URI);
  });

  it("should login user and return status code 200", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testLoginUser@gmail.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(200);
  });
  it("should login user and return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testLoginUser@gmail.com",
      password: "123456",
    });
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBeTruthy();
  });
  it("should login user and return return object with fields email and subscription", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testLoginUser@gmail.com",
      password: "123456",
    });
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty(
      "email",
      "testLoginUser@gmail.com"
    );
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
    const validSubscriptions = ["starter", "pro", "business"];
    expect(validSubscriptions).toContain(response.body.user.subscription);
  });

  it("should return 401 for invalid password", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testLoginUser@gmail.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("should return 401 for invalid email", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "testLoginUser1@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
