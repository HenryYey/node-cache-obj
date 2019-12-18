import * as assert from "assert";
import { Cache } from "../src/index"

describe('test node-cache-boj', () => {
  it('set and get cache', async () => {
    const myCache = new Cache({cacheLimitAmount: 2});
    const value = JSON.stringify({
      name: "pony",
      age: "18"
    });
    console.log("set-result", value)

    myCache.setVal({
      key: "a",
      value
    })
    setTimeout(() => {
      const result = myCache.getVal("a");
      console.log("get-result", result);
      assert.equal(result, value);
    }, 1000);
  })
})