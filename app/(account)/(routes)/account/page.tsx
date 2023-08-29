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
import { Heading } from "@/components/heading";
import { getFilesFromFirebase } from "@/actions/serverActions";
import { DeleteButton } from "@/components/deleteButton";

const AccountPage = async () => {
  const filesList: FileList = await getFilesFromFirebase();

  return (
    <main className="h-screen w-full flex flex-col items-center justify-start space-y-10 md:space-y-0">
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
                    <DeleteButton filePath={filePath} />
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
