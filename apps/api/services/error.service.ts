import { HTTPStatus } from "../utils/error";


export class BadRequestError extends Error{
    statusCode:number
    constructor(message:string){
        super(message)
        this.statusCode=HTTPStatus.BadRequest
        this.message="Bad request"
    }
}

export class NotFoundError extends Error{
    statusCode:number
    constructor(message:string){
        super(message)
        this.statusCode = HTTPStatus.NotFound
        this.message="Not Found error"
    }
}
export class UnauthorizedError extends Error{
    statusCode:number
    constructor(message:string){
        super(message)
        this.statusCode = HTTPStatus.Unauthorized
        this.message="Unauthorized error"
    }
}

export class ServerError extends Error{
    statusCode:number
    constructor(message:string){
        super(message)
        this.statusCode = HTTPStatus.ServerError
        this.message="Server failed"
    }
}