import fs from "fs";
import { Request } from "express";
import mongoose from "mongoose";

export interface PaginatedPayload<T> {
  page: number;
  limit: number;
  totalPages: number;
  previousPage: boolean | null;
  nextPage: boolean | null;
  totalItems: number;
  currentPageItems: number;
  data: T[];
}

export const filterObjectKeys = <T>(fieldsArray: string[], objectArray: T[]): T[] => {
  const filteredArray: T[] = objectArray.map((originalObj) => {
    let obj: any = {};
    fieldsArray.forEach((field) => {
      if (field.trim() in originalObj) {
        obj[field as keyof T] = originalObj[field as keyof T];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};

export const getPaginatedPayload = <T>(
  dataArray: T[],
  page: number,
  limit: number
): PaginatedPayload<T> => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length;
  const totalPages = Math.ceil(totalItems / limit);

  dataArray = dataArray.slice(startPosition, startPosition + limit);

  const payload: PaginatedPayload<T> = {
    page,
    limit,
    totalPages,
    previousPage: page > 1 ? true : null,
    nextPage: page < totalPages ? true : null,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  };
  return payload;
};

export const getStaticFilePath = (req: Request, fileName: string): string => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

export const getLocalPath = (fileName: string): string => {
  return `public/images/${fileName}`;
};

export const removeLocalFile = (localPath: string): void => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

export const removeUnusedMulterImageFilesOnError = (req: Request): void => {
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      removeLocalFile(multerFile.path);
    }

    if (multerFiles) {
      const filesValueArray = Object.values(multerFiles);
      filesValueArray.forEach((fileFields: any[]) => {
        fileFields.forEach((fileObject) => {
          removeLocalFile(fileObject.path);
        });
      });
    }
  } catch (error) {
    console.log("Error while removing image files: ", error);
  }
};

export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
  customLabels,
}: {
  page?: number;
  limit?: number;
  customLabels?: mongoose.CustomLabels;
}): mongoose.PaginateOptions => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  };
};

export const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max);
};
