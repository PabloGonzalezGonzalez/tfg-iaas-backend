import { getHelloMessage } from "./utils/serverUtils";

test("should return the hello response", () => {
  expect(getHelloMessage()).toBe("Hello");
});
