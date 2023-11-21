/**
 *
 * Creat passed object from "meta" properties (first level)
 * After that passed object used by reference
  * return devided meta if exists othervice return empty object
 */
export const prepareMetaData = (obj: any) => {
    if (!obj) return {};

    if (obj.hasOwnProperty('meta')) {
        const copyMeta = JSON.parse(JSON.stringify(obj.meta));
        delete obj.meta;
        return copyMeta;
    }
    return {};
};
