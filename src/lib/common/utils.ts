import { SzDataSourceComposite } from '../models/data-sources';

/**
 * A reusable function to remove any null or undefined values, and their
 * associated keys from a json object.
 * used internally.
 */
export function JSONScrubber(value: any): any {
  const _repl = (name, val) => {
    if(!val || val == undefined || val == null || typeof val == 'undefined'){
      return undefined;
    }
    return val
  }
  if(value){
    return JSON.parse(JSON.stringify(value, _repl));
  }
}

export function parseBool(value: any): boolean {
  if (!value || value === undefined) {
    return false;
  } else if (typeof value === 'string') {
    return (value.toLowerCase().trim() === 'true') ? true : false;
  } else if (value > 0) { return true; }
  return false;
};

/**
 * Function used to return an array of "SzDataSourceComposite" in the order 
 * specified by each members "index" property
 */
export function sortDataSourcesByIndex(value: SzDataSourceComposite[]): SzDataSourceComposite[] {
  let retVal  = value;
  if(retVal && retVal.sort) {
    // first sort by any existing indexes
    retVal = retVal.sort((a, b) => {    
        if (a.index > b.index) {
            return 1;
        } else if (a.index < b.index) {    
            return -1;
        } else {
          // sort by name
        }
        return 0;
    });
    // now update index values to same as array
    retVal  = retVal.map((_dsVal: SzDataSourceComposite, _index: number) => {
      let _reIndexed  = _dsVal;
      _reIndexed.index = _index;
      return _reIndexed;
    });
  }
  return retVal;
}