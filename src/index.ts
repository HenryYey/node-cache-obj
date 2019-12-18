interface ICacheOptions {
  cacheCleanTime?: number; // 定期清理时间
  cacheLimitAmount?: number; // 容量
}

interface ICacheConfig {
  key: string;
  value: any;
  cacheEffectiveTime?: number; // 缓存有效期
}

/**
 * 确保cache的key是唯一的
 */
export class Cache {
  private cacheMap: any = {};
  cacheCleanTime: number = 1800000; // 默认半小时清理一次
  cacheLimitAmount: number = 20; // 默认可存20个缓存
  
  constructor(options?: ICacheOptions) {
    if (options) {
      if (options.cacheCleanTime && options.cacheCleanTime > 0) {
        this.cacheCleanTime = options.cacheCleanTime;
      }
      if (options.cacheLimitAmount && options.cacheLimitAmount > 1) {
        this.cacheLimitAmount  = options.cacheLimitAmount ;
      }
    }

    setInterval(this.cleanCache, this.cacheCleanTime);
  }
  /**
   * 设置缓存
   * @param config 缓存配置
   */

  public setVal(config: ICacheConfig): void {
    if (!config.key || !config.value) {
      throw new Error("cache set param error, need key, value");
    }
    // 如果超过限制，先清除过期缓存以腾出空间, 若容量满了则不加入缓存
    let isFull = false;
    if (Object.keys(this.cacheMap).length > this.cacheLimitAmount) {
      isFull = true;
      Object.keys(this.cacheMap).forEach((cacheKey) => {
        if (this.cacheMap[cacheKey].effectiveTime + this.cacheMap[cacheKey].createTime < +new Date()) {
          isFull = false;
          delete this.cacheMap[cacheKey];
        }
      })
    } 
    
    if (!isFull) {
      this.cacheMap[config.key] = {
        value: config.value,
        createTime: +new Date(),
        effectiveTime: config.cacheEffectiveTime || 1800000
      };
    } else { 
       throw new Error("fail to set cache, as the cacheMap is full");
    }
  }
  /**
   * 获取缓存
   * @param key 缓存key
   */

  public getVal<T>(key: string): T | undefined {
    if (!key) {
      throw new Error("key not allow null");
    }

    const cacheContent = this.cacheMap[key];
    if (cacheContent) {
      if (cacheContent.effectiveTime + cacheContent.createTime >= +new Date()) {
        return cacheContent.value;
      }

      delete this.cacheMap[key];
    }

    return undefined;
  }

  /**
   * 清理过期内存缓存
   */
  public cleanCache() {
    if (this.cacheMap) {
      Object.keys(this.cacheMap).forEach((key) => {
        if (this.cacheMap[key].effectiveTime + this.cacheMap[key].createTime < +new Date()) {
          delete this.cacheMap[key];
        }
      });
    }
  }
  /**
   * 清理所有内存缓存
   */
  public cleanAllCache() {
    if (this.cacheMap) {
      Object.keys(this.cacheMap).forEach((key) => {
        delete this.cacheMap[key];
      });
    }
  }
}