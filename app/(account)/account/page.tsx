"use client";
import { deleteFileFromFirebase, getFilesFromFirebase } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileList } from "@/typings";
import { Trash2 } from "lucide-react";

const AccountPage = () => {
  const [filesList, setFilesList] = useState<FileList>();

  useEffect(() => {
    (async function () {
      setFilesList(await getFilesFromFirebase());
    })();
  }, []);

  return (
    <main className="min-h-full flex items-center justify-center">
      <div className="w-3/4">
        <Table>
          <TableCaption>Your Files</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-right">Download</TableHead>
              <TableHead className="text-right">delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filesList?.map(({ name, url, id, date }) => {
              const filePath = `${name}_${id}_${date}`;
              return (
                <TableRow key={id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="font-medium text-center">
                    {new Date(date).toDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    <Link href={url}>
                      <Button>Download</Button>
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    <Button onClick={() => deleteFileFromFirebase(filePath)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default AccountPage;
