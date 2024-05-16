import { describe, test, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import app from "./app.js";

import { items } from "./fakeDb.js";

const TEST_ITEM1 = { name: "testItem1", price: 1 };
const TEST_ITEM2 = { name: "testItem2", price: 2 };
const TEST_ITEM3 = { name: "testItem3", price: 3 };

beforeEach(function () {
  items.push(TEST_ITEM1);
  items.push(TEST_ITEM2);
  items.push(TEST_ITEM3);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items ", function () {

  test("returns all items in 'db'", async function () {
    const resp = await request(app).get("/items");
    expect(resp.body).toEqual({ items: items });
    expect(resp.body.items.length).toEqual(3);
  });
});

describe("POST /items", function () {
  test("adding adding an item to the DB", async function () {
    const resp = await request(app)
      .post("/items")
      .send({ name: "newTestName", price: 50 });

    expect(resp.body).toEqual({ added: { name: "newTestName", price: 50 } });
    expect(resp.statusCode).toEqual(201);

  });

  test("Test that we throw an NotFound err when we send incorrect URL params",
    async function () {
      const resp = await request(app)
        .post("/items")
        .send({ random: "testName", bad: 1 });

      expect(resp.statusCode).toEqual(400);
    });
});

describe("GET /items/:name", function () {
  test("Test getting an item by name", async function () {
    const resp = await request(app).get("/items/testItem1");
    expect(resp.body).toEqual({ name: "testItem1", price: 1 });
  });

  test(
    "Test that we throw a NotFound err when we send a name that does not exist",
    async function () {
      const resp = await request(app).get("/items/badName");
      expect(resp.statusCode).toEqual(404);
    });
});

