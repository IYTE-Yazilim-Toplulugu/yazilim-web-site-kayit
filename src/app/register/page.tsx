"use client"
import { useForm } from "react-hook-form";
import { supabase } from "@/../lib/supabase";
import { motion } from 'framer-motion';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LandPlot } from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const departments = await supabase
    .from("departments")
    .select("name,slug");

export default function RegisterPage() {
    const [isStudent, setIsStudent] = useState(true);
    const [fromIZTECH, setFromIZTECH] = useState(true);
    const [department, setDepartment] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = z.object({
        fullName: z.string().regex(RegExp("^([a-zA-ZığüşöçİĞÜŞÖÇ]+ )+[a-zA-ZğıüşöçİĞÜŞÖÇ]+$"), {
            message: "Full name must contain your surname."
        }).min(2, {
            message: "Full name must be at least 2 characters.",
        }),
        isStudent: z.boolean(),
        schoolNumber: z.string().optional(),
        department: z.string().optional(),
        fromIZTECH: z.boolean(),
        place: z.string().optional(),
        phone: z.string().regex(RegExp("^((\\+\\d+)|(05\\d{9}))$"), {
            message: "Please enter a valid phone number. (+1 5** *** **** / 05*********)",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(6, {
            message: "Please enter a valid password, minimum 6 characters.",
        })
    });

    const schema = formSchema.superRefine((data, ctx) => {
        if (data.isStudent) {
            if (!data.schoolNumber || data.schoolNumber.trim().length < 1) {
                ctx.addIssue({
                    path: ["schoolNumber"],
                    message: "School number must be filled.",
                    code: z.ZodIssueCode.custom
                });
            }
            if (!data.department || data.department.trim().length < 1) {
                ctx.addIssue({
                    path: ["department"],
                    message: "Department must be filled.",
                    code: z.ZodIssueCode.custom
                });
            }

        }
        else
            data.fromIZTECH = false;

        if (!data.fromIZTECH && (!data.place || data.place.trim().length < 5)) {
            ctx.addIssue({
                path: ["place"],
                message: "Place must be at least 5 characters.",
                code: z.ZodIssueCode.custom
            });
        }
    });

    function onSubmit(values: z.infer<typeof schema>) {
        setIsSubmitting(true);

        if (values.isStudent) {
            if (values.fromIZTECH) {
                values.place = undefined;
            }
        }
        else {
            values.department = undefined;
            values.schoolNumber = undefined;
        }

        const data = {
            isRegister: true,
            body: values
        };

        console.log(data);

        window.top?.postMessage(JSON.stringify(data), "*");
        setIsSubmitting(false);
    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            isStudent: true,
            fromIZTECH: true,
            place: "",
            schoolNumber: "",
            department: "",
            phone: "",
            email: "",
            password: ""
        }
    });


    useEffect(() => {
        form.setValue("isStudent", isStudent);
        form.setValue("fromIZTECH", fromIZTECH);
        form.setValue("department", department);
    });

    const params = useSearchParams();
    const msg = params.get("msg");

    return (
        <div className={"flex h-dvh "}>
            <div className="relative w-2/3 overflow-hidden">
                <Image
                    src="/images/back.jpg"
                    width={2560}
                    height={1700}
                    className="w-full h-full object-cover"
                    alt="background"
                />
                <div className="fade-right absolute top-0 right-0 h-full w-1/4 pointer-events-none" />
            </div>
            {/*<div className="relative flex-grow-4">
                <Image
                    src="/images/back.jpg"
                    width={256}
                    height={170}
                    className="w-full h-full object-cover"
                    alt="background"
                />
                <div className="absolute top-0 right-0 h-full w-1/4 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
            </div>*/}
            <div className="flex-grow-3 flex align-middle items-center justify-center">
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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input className="control" placeholder="Abuzer Kömürcü" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]" />
                                    </FormItem>
                                )}
                            />
                            <FormItem className="flex flex-row gap-x-2">
                                <FormControl>
                                    <Checkbox className="control" checked={isStudent} onCheckedChange={x => {
                                        if (x === true)
                                            setIsStudent(true);
                                        else {
                                            setIsStudent(false);
                                            setFromIZTECH(false);
                                        }
                                    }} />
                                </FormControl>
                                <FormLabel>I&#39;m Student</FormLabel>
                                <FormMessage />
                            </FormItem>
                            {isStudent && <motion.div
                                layout
                                initial={{ scaleY: 0, originY: 0 }}
                                animate={{ scaleY: 1, originY: 0 }}
                                transition={{ duration: 0.2 }}
                                exit={{ scaleY: 0, originY: 0 }}
                            >
                                <div className="flex flex-col gap-y-2">
                                    <FormField
                                        control={form.control}
                                        name="schoolNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>School Number</FormLabel>
                                                <FormControl>
                                                    <Input className="control" placeholder="3293293289" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[#606060]" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <FormField
                                            control={form.control}
                                            name="department"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Department</FormLabel>
                                                    <FormControl>
                                                        <Select {...field} value={department} onValueChange={x => {
                                                            form.clearErrors("department");
                                                            setDepartment(x);
                                                        }}>
                                                            <SelectTrigger className="w-[180px] control">
                                                                <SelectValue placeholder="Select a department" />
                                                            </SelectTrigger>
                                                            <SelectContent className="control">
                                                                {
                                                                    departments.data?.map(x =>
                                                                    (
                                                                        <SelectItem key={x.slug} value={x.slug}>{x.name}</SelectItem>
                                                                    )
                                                                    )
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="text-[#606060]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormItem className="flex flex-row gap-x-2">
                                        <FormControl>
                                            <Checkbox checked={fromIZTECH} onCheckedChange={x => {
                                                if (x === true) {
                                                    setFromIZTECH(true);
                                                    setIsStudent(true);
                                                }
                                                else {
                                                    setFromIZTECH(false);
                                                }
                                            }} />
                                        </FormControl>
                                        <FormLabel>I&#39;m From IZTECH</FormLabel>
                                    </FormItem>
                                </div>
                            </motion.div>}

                            {!fromIZTECH && <FormField
                                control={form.control}
                                name="place"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place</FormLabel>
                                        <FormControl>
                                            <Input className="control" placeholder="Amasya Uni" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]" />
                                    </FormItem>
                                )}
                            />}

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input className="control" placeholder="05*********" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input className="control" placeholder="email@iztech.com.tr" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]" />
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
                                            <Input type={"password"} className="control" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-[#606060]" />
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
                                    },
                                }}
                                whileTap={{
                                    borderRadius: "2px"
                                }}
                            >
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    <span className="flex items-center gap-2">
                                        Sign Up
                                        <LandPlot className="h-4 w-4" />
                                    </span>
                                </Button>
                            </motion.div>
                        </motion.form>
                    </Form>
                    <div className={"mt-3 w-full flex justify-center"}>
                        <Link className={" text-[#808080]"} href="/login">Have you registered?</Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
