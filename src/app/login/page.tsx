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
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="m-8 flex flex-col items-center justify-center min-h-screen"
        >
            <Label>
                {msg}
            </Label>
            <Form {...form}>
                <motion.form layout onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:max-w-1/3 flex flex-col gap-y-3">
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
    )
}
