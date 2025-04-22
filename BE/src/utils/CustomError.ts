class CustomError extends Error {
    data:any

    constructor(  message: string,public statusCode: number){
        super(message);
        this.data = null;
        Error.captureStackTrace(this, this.constructor)
    }
}

export { CustomError }

