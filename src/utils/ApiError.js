class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],// how taypes of error will occuered in future
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;//here we handle error not response so we can't talk about success
        this.errors = errors

        if (stack) { // it shows us if errror stack is available or not
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}