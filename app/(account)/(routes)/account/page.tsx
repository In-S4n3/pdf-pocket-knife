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
import axios from "axios";
import { ChatCompletionRequestMessage } from "openai";

const AccountPage = () => {
  const [filesList, setFilesList] = useState<FileList>();

  const sendUrl = async (url: string) => {
    const userMessage: ChatCompletionRequestMessage = {
      role: "user",
      content:
        "Given the following extracted parts of a long document and a question, create a final answer using ONLY THE GIVEN DOCUMENT DATA NOT FROM YOUR TRAINED KNOWLEDGE BASE in the language the question is asked, if it's asked in English, answer in English and so on. If you can't fetch a proper answer from the GIVEN DATA then just say that you don't know the answer from the document. Don't try to give an answer like a search engine for everything. Give an answer as much as it is asked for. Be specific to the question and don't give full explanation with long answer all the time unless asked explicitly or highly relevant. When asked for how many, how much etc, try giving the quantifiable answer without giving the full lengthy explanation. Always answer in the same language the question is asked in. Give the answer in proper line breaks between paragraphs or sentences.",
    };

    await axios.post("/api/openAi", { url });
  };

  useEffect(() => {
    (async function () {
      setFilesList(await getFilesFromFirebase());
    })();
  }, []);

  return (
    <main className="h-full flex flex-col items-center justify-center space-y-10">
      <h1 className="text-4xl py-10">Your List of Files</h1>
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
