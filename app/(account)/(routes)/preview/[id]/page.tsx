"use client";

import axios from "axios";
import { cn, getSingleFileURLFromFirebase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatCompletionRequestMessage } from "openai";
import { formSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/userAvatar";
import { UiAvatar } from "@/components/uiAvatar";
import { Heading } from "@/components/heading";
import { Empty } from "@/components/empty";

const PreviewPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [url, setUrl] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    (async function () {
      const url = await getSingleFileURLFromFirebase(id);
      if (url) {
        setUrl(url);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const response = url && (await axios.post("/api/pdfText", { url }));
      if (response) {
        setPdfText(response?.data);
      }
    })();
  }, [url]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/openAi", {
        messages: newMessages,
        pdfText,
      });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <main className="flex justify-center flex-col items-center flex-1">
      <Heading title="Preview & AI" />
      <div className="flex flex-col space-y-7 md:flex-row w-full justify-around md:space-x-5 px-10">
        <div className="md:w-2/5 flex justify-center">
          <iframe
            src={url && `${url}#toolbar=0`}
            className="w-[80%] h-[400px] md:h-[760px]"
          />
        </div>
        <div className="md:w-3/5 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Resume this text..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  type="submit"
                  disabled={isLoading}
                  size="icon"
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted animate-pulse">
                Analysing...
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <Empty label="No conversation started." />
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div
                  key={message.content}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    message.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <UiAvatar />}
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PreviewPage;
