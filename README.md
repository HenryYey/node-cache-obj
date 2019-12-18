# node-cache-obj

一个缓存模块，可将node后端缓存存入内存， 适用于数据量小、简单的业务场景

## usage
### install
```shell
npm install node-cache-obj 
```
### defind

```js
import { Cache } from "node-cache-obj";

const options = {
  cacheCleanTime: 100000, // 定时清理缓存时间，毫秒
  cacheLimitAmount: 10 // 缓存容量
}

const myCache = new Cache(options);

```

### set && get

```js
const value = JSON.stringify({
  name: "pony",
  age: "18"
});

myCache.setVal({
  key: "a",
  value,
  cacheEffectiveTime: 1800000
})

const result = myCache.getVal("a")
// "{ name: "pony", age: "18" }"
```
### clean Cache 

缓存容量默认为**20**个，缓存有效期默认为**半小时**，默认每隔半小时清除超过阈值的缓存对象。 你可以在defind cache时改变默认配置

```js
// 配置接口
interface ICacheOptions {
  cacheCleanTime?: number; // 定期清理时间
  cacheLimitAmount?: number; // 容量
}
```
### clean Cache by yourself

手动清理过期缓存或所有缓存
```js
// clean noeffective cache
myCache.cleanCache();
// clean all cache
myCache.cleanAllCache();
```