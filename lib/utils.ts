"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { storage } from "../configs/firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { uuid } from "uuidv4";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Editor functions ---------------------------------------------------------------------
export const getPSPDFKitLicenseKey = () => {
  const ENV = process.env.NEXT_PUBLIC_ENV;
  const PROD_KEY = process.env.NEXT_PUBLIC_PSPDFKIT_KEY;
  const BETA_KEY = process.env.NEXT_PUBLIC_PSPDFKIT_BETA_KEY;
  if (!PROD_KEY && !BETA_KEY)
    throw new Error("PSPDFKit License Keys Not Set! Set them in .env!");
  switch (ENV) {
    case "production":
      return { licenseKey: `${PROD_KEY}` };
      // eslint-disable-next-line no-unreachable
      break;
    case "staging":
      return { licenseKey: `${BETA_KEY}` };
      // eslint-disable-next-line no-unreachable
      break;
  }
};

export const triggerDownload = async (buffer: Buffer) => {
  const blob = new Blob([buffer], { type: "application/pdf" });
  const fileName = "document.pdf";
  const nav = window.navigator as any;
  if (nav.msSaveOrOpenBlob) {
    nav.msSaveOrOpenBlob(blob, fileName);
  } else {
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    document.body.removeChild(a);
  }
};

// Indexed DB functions ---------------------------------------------------------------------
// 1. Setup IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FileDatabase", 1);

    request.onerror = () => {
      reject("Failed to open DB");
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      db.createObjectStore("FilesStore");
    };
  });
};

// 2. Storing Buffer in IndexedDB
export const storeFile = async (buffer: ArrayBuffer): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["FilesStore"], "readwrite");
    const store = transaction.objectStore("FilesStore");
    const request = store.put(buffer, "file");

    request.onerror = () => {
      reject("Failed to store buffer");
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

// 3. Retrieving Buffer from IndexedDB
export const getFile = async (): Promise<ArrayBuffer | null> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["FilesStore"], "readonly");
    const store = transaction.objectStore("FilesStore");
    const request = store.get("file");

    request.onerror = () => {
      reject("Failed to retrieve buffer");
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
  });
};

// Firebase functions ---------------------------------------------------------------------
export const uploadToFirebase = async (buffer: Buffer, file: any) => {
  try {
    const blob = new Blob([buffer], { type: "application/pdf" });
    const fileRef = ref(
      storage,
      `PDF/${file.name + "_" + uuid() + "_" + new Date()}`
    );
    const success = await uploadBytes(fileRef, blob);
    return success;
  } catch (error) {
    console.error(error);
  }
};

export const getFilesFromFirebase = async () => {
  const fileRef = ref(storage, `PDF/`);
  const files = await listAll(fileRef);

  const filesDetails = await Promise.all(
    files.items.map(async (file) => {
      const splitOnPdf = file.fullPath.split(".pdf");
      const filePathSplited = splitOnPdf[1].split("_");
      const name = splitOnPdf[0].slice(4, splitOnPdf[0].length);
      const id = filePathSplited[1];
      const date = filePathSplited[2];
      const url = await getDownloadURL(file);

      return { url, name, id, date: date };
    })
  );

  return filesDetails;
};

export const getSingleFileURLFromFirebase = async (id: string) => {
  const fileRef = ref(storage, `PDF/`);
  const files = await listAll(fileRef);

  const file = files.items.find((file) => {
    if (file.fullPath.includes(id)) {
      return file;
    }
  });

  return file && (await getDownloadURL(file));
};

export const deleteFileFromFirebase = async (filePath: string) => {
  const fileRef = ref(storage, `PDF/${filePath}`);

  deleteObject(fileRef)
    .then(() => {
      console.log("File deleted");
    })
    .catch((error) => {
      console.log("Uh-oh, an error occurred!");
    });
};
