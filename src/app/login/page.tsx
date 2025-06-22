"use client"

import {motion} from 'framer-motion';
import { z } from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import Image from "next/image";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password must be filled.",
    })
});

function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
        isRegister: false,
        body: values
    };

    window.top?.postMessage(JSON.stringify(data), "*");
}

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const params = useSearchParams();
    const msg = params.get("msg");

    return (
        <div className={"flex h-dvh"}>
            <div className="relative flex-grow-4 bg-[var(--background)] overflow-hidden">
                <Image
                    src="/images/back.jpg"
                    width={256}
                    height={170}
                    className="w-full h-full object-cover"
                    alt="background"
                />
                <div className="fade-right absolute top-0 right-0 h-full w-1/4 pointer-events-none" />
            </div>
            <div className={"flex-grow-3 flex align-middle items-center justify-center"}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center justify-center min-h-screen"
                >
                    <Label className={"mb-3"}>
                        {msg}
                    </Label>
                    <Form {...form}>
                        <motion.form layout onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 bg-[#101010] rounded-xl lg:max-w-2/3 flex flex-col gap-y-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-Mail</FormLabel>
                                        <FormControl>
                                            <Input className="control" type={"email"} placeholder="abc@kamil.com" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]"/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input className="control" type={"password"} {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]"/>
                                    </FormItem>
                                )}
                            />
                            <motion.div
                                initial={{
                                    backgroundColor: "#181818",
                                    borderRadius: "6px"
                                }}
                                whileHover={{
                                    backgroundColor: "#865b01",
                                    borderRadius: "6px",
                                    transition: {
                                        delay: 0.1,
                                        duration: 0.5,
                                        ease: [0.19, 1, 0.22, 1],
                                    },}}
                                whileTap={{
                                    borderRadius: "2px"
                                }}
                            >
                                <Button type="submit" className="w-full">
                            <span className="flex items-center gap-2">
                                Sign In
                                <Heart className="h-4 w-4" />
                            </span>
                                </Button>
                            </motion.div>
                        </motion.form>
                    </Form>
                    <Link className={"mt-3 text-[#808080]"} href="/register">Haven&#39;t you registered?</Link>
                </motion.div>
            </div>

        </div>

    )
}
