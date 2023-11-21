import fs from 'fs-extra';

export const saveToFile = (file, json) => {
    if (!fs.pathExistsSync(file)){
        fs.writeJsonSync(file, json)
    }
}
