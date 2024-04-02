import fs from 'fs';
import mongoose from 'mongoose';
import express from "express";
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
/*
The getPaginatedPayload function generates a paginated payload containing data from the given array, along with pagination details.



Returns the constructed paginated payload object containing pagination details and data for the current page.
*/ 


export const getPaginatedPayload = (dataArray:any[], page:number, limit:number) => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length; // total documents present after applying search query
  const totalPages = Math.ceil(totalItems / limit);

  dataArray = structuredClone(dataArray).slice(
    startPosition,
    startPosition + limit
  );

  const payload = {
    page,
    limit,
    totalPages,
    previousPage: page > 1,
    nextPage: page < totalPages,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  };
  return payload;
};

//Returns the file's static path from wher the server is serving the static images


export const getStaticFielPath = (req: express.Request, filename: String) => {
  return `${filename}`
};

//retuns the file's local path in the file system to assist future remaoval

export const getLocalPath = (filename: string) => {
  return `public/images/${filename}`;
}

// Remove the local file from the local file system based on the file path

export const removeLocalFile = (localPath: string) => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};







