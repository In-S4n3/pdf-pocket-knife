"use client";
import { deleteFileFromFirebase, getFilesFromFirebase } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileList } from "@/typings";
import { Trash2 } from "lucide-react";
import { Heading } from "@/components/heading";

const AccountPage = () => {
  const [filesList, setFilesList] = useState<FileList>();

  useEffect(() => {
    (async function () {
      const files = await getFilesFromFirebase();
      if (files) setFilesList(files);
    })();
  }, []);

  return (
    <main className="h-full flex flex-col items-center justify-center space-y-10">
      <Heading title="Your list of files" />
      <div className="w-3/4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-right">Consult AI</TableHead>
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
                    <Link href={`preview/${id}`}>
                      <Button>Preview / AI</Button>
                    </Link>
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
