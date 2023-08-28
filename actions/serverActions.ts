"use server";

import { storage } from "@/configs/firebase";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { revalidatePath } from "next/cache";

export const getFilesFromFirebase = async () => {
  const fileRef = ref(storage, `PDF/`);
  const files = await listAll(fileRef);

  const filesDetails = await Promise.all(
    files.items.map(async (file) => {
      const match = file.fullPath.match(/\/(.*\.pdf)/);
      const splitOnPdf = file.fullPath.split(".pdf");
      const filePathSplited = splitOnPdf[1].split("_");
      const name = match && match[1];
      const id = filePathSplited[1];
      const date = filePathSplited[2];
      const url = await getDownloadURL(file);

      return name
        ? { url, name, id, date: date }
        : { url, name: "", id, date: date };
    })
  );
  revalidatePath("/account");
  return filesDetails;
};

export const deleteFileFromFirebase = async (filePath: string) => {
  const fileRef = ref(storage, `PDF/${filePath}`);

  deleteObject(fileRef)
    .then(() => {
      console.log("File deleted");
      revalidatePath("/account");
    })
    .catch((error) => {
      console.log("Uh-oh, an error occurred!");
    });
};
