import { getHelloMessage } from "./utils/utils";

test("should return the hello response", () => {
  expect(getHelloMessage()).toBe("Hello");
});
