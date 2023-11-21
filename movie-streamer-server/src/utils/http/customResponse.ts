import { Request, Response, NextFunction } from 'express';
import { prepareMetaData } from './commonHttp.js';

// sendToUI type declaration based on
// native .res function.
declare global {
    namespace Express {
        interface Response {
            sendToUI(dataUI?: any): any
        }
    }
}

// Used at business to provide structured data to ui
export const customSendExpress = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.sendToUI = (dataUI?: any) => res.send({
            error: null,
            result: { data: dataUI, meta: prepareMetaData(dataUI) }
        });
        next();
    } catch (error) {
        next(error);
    }
}
