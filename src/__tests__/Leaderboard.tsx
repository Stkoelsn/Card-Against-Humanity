import "@testing-library/jest-dom";
import "../pages/Leaderboard"

global.fetch = jest.fn((string) =>
  Promise.resolve({
    json: () => Promise.resolve(
      [
        {
          title: string,
          completed: false
        },
        {
          title: "Todo2",
          completed: false
        }
      ]
    )
  })
) as jest.Mock<any>


test("", async () => {
    expect(true).toBe(true);
});