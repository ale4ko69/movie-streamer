/**
 * Check if js object is empty
 * Receive javascript object {key: value}.
 * return boolean
 */
export const isEmptyObj = (obj: any) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

export const convertParamsToSearchString = (params: any): string => {
    // Iterate over the parameters
    let strSearch = ''
    for (const [key, value] of Object.entries(params)) {
        console.log(key, value);
        strSearch = strSearch.concat(`${key}=${value}&`)
    }

    return strSearch;
}
