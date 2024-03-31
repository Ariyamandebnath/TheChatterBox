import fs from 'fs';
import mongoose from 'mongoose';

/*this is an utility function to only  include files present in a fieldsArray 
For example:-->
ler fieldsArray = [{
  name : "Ariyaman",
  id:2412,
  email: "zest@zaest.com"
},
{
  name: "Ankita",
  id:1224,
  email:"rizz@rizz.com"

}],

let requiredfields = ["name", "email"]

const fileteredKeysObject = filetObjectKeys(fieldsArray, requiredfields);


This will output :[{
  name : "Ariyaman",
  email: "zest@zaest.com"
},
{
  name: "Ankita",
  email:"rizz@rizz.com"

}]
*/

export const filetObjectKeys = (fieldArray:string[], objectArray: any[]): any[]=> {
  const filteredArray: any[] = structuredClone(objectArray).map((originalObj: Record<string, any>) => {

    let obj: Record<string, any> = {};
    
    structuredClone(fieldArray)?.forEach((field: string) => {
      if (field?.trim() in originalObj) {
        obj[field] = originalObj[field];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};


