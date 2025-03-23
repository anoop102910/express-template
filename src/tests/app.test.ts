import request from "supertest";
import app from "../app/app";

describe("App", () => {
  it("should return 200 status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});

