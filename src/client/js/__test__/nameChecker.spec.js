import { nameChecker } from "../nameChecker";
describe("Testing the submit functionality", () => {
  test("Testing the nameChecker() function", () => {
    global.alert = jest.fn();
    expect(nameChecker('Archer')).toBe(alert('Archer'));
  });
});