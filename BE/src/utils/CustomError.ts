class CustomError extends Error {
    data:any

    constructor(  public statusCode: number, message: string,){
        super(message);
        this.data = null;
        Error.captureStackTrace(this, this.constructor)
    }
}

export { CustomError }

