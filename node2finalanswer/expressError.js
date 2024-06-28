class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    if (status >= 500 && process.env.NODE_ENV !== "test") {
      console.error(this.stack);
    }
  }
}

module.exports = ExpressError;
