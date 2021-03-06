const strman = require('strman');
const writeClassToFile = require('../../utils/writeClassToFile')
const checkIfFileExists = require('../../utils/checkIfFileExists')
const generateDir = require('../../utils/generateDir');



module.exports.init = function init(dirName,domainName) {
    dirName = dirName + "controller/";
    const controllerFileName = domainName+".controller.ts"
    if (!checkIfFileExists(dirName, controllerFileName)) {
        generateDir(dirName);
        const controllerText = createControllerClass(domainName)
        writeClassToFile(controllerText, dirName, controllerFileName);
    }
}



function createControllerClass(domainName){
    return `

import * as express from "express";
import { interfaces, controller, httpGet, httpPut, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import { AggregateRoot } from "../../domain/AggregateRoot";
import { ApiPath } from "shukshma";

@ApiPath({
    "name":"${domainName}",
    "path":"/${domainName}",
    "description":"This controller handles the resources for ${domainName}"
})
@controller("/${strman.toLowerCase(domainName)}")
export class ${domainName}Controller implements interfaces.Controller {
    private root:AggregateRoot = new AggregateRoot();
    constructor( ) {}

    @httpGet("/")
    private getAll(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return this.root.${strman.toCamelCase("GetAll"+domainName)}();
    }

    @httpGet("/:id")
    private get(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const id = req.params.id;
        return this.root.${strman.toCamelCase("Get"+domainName)}(id);
    }

    @httpPost("/")
    private create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const body = req.body; //WILL RECEIVE THE REQUIRED USECASE OBJECT LATER FROM JOI;
        return this.root.${strman.toCamelCase("Create"+domainName)}(body);
    }
    
    @httpPut("/")
    private update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const body = req.body; //WILL RECEIVE THE REQUIRED USECASE OBJECT LATER FROM JOI;
        return this.root.${strman.toCamelCase("Update"+domainName)}(body);
    }
    
    @httpDelete("/")
    private delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const body = req.body; //WILL RECEIVE THE REQUIRED USECASE OBJECT LATER FROM JOI;
         return this.root.${strman.toCamelCase("Remove"+domainName)}(body);
    }
}
    `
}