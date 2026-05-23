import { HTTPStatus } from "../utils/httpstatus";

export class BadrequestError extends Error{
    statusCode:number;
    constructor(message:string){
        super(message)
        this.statusCode= HTTPStatus.BadRequest
        this.name= "BadrequestError"
    }
}

export class UnauthorizedError extends Error{
    statusCode:number;
    constructor(message:string){
        super(message)
        this.statusCode=HTTPStatus.Unauthorized,
        this.name="UnauthorizedError"
    }
}

export class NotFoundError extends Error{
    statusCode:number;
    constructor(message:string){
        super(message)
        this.statusCode=HTTPStatus.Notfound,
        this.name="NotFoundError"
    }
}


export class ServerError extends Error{
    statusCode:number
    constructor(message:string){
        super(message)
        this.statusCode=HTTPStatus.InternalError
        this.name= "Server Error"
    }
}