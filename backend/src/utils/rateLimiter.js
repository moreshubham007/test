class RateLimiter {
  constructor(limit, interval = 60000) { // default: per minute
    this.limit = limit;
    this.interval = interval;
    this.tokens = limit;
    this.lastRefill = Date.now();
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.interval) * this.limit;
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.limit, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  tryAcquire() {
    this.refillTokens();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

const createRateLimiter = (limit, interval) => {
  return new RateLimiter(limit, interval);
};

module.exports = { createRateLimiter }; 