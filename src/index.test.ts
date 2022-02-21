import { getHelloMessage } from "./utils";

test("should return the hello response", () => {
  expect(getHelloMessage()).toBe("Hello");
});
