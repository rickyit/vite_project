import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { auth, storage } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
//import { v4 as uuidv4 } from "uuid";
const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE = 4;

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(8, "Password should at least 8 character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    avatar: z
      .custom<Blob>()
      .refine(
        (blob) => sizeInMB(blob?.size) <= MAX_IMAGE_SIZE,
        `The maximum image size is ${MAX_IMAGE_SIZE}MB`
      )
      .refine(
        (blob) => ACCEPTED_IMAGE_TYPES.includes(blob.type),
        "Only .jpg and .png are allowed"
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "",
    path: ["confirmPassword"],
  });

type formData = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  console.log(form);
  const navigate = useNavigate();

  const onSubmit = async (formData: formData) => {
    let avatarURL = "";
    try {
      //const fileName = uuidv4();
      //${fileName}
      // Points to the root reference
      const storageRef = ref(storage, `avatar/`);

      if (formData.avatar) {
        const snapshot = await uploadBytes(storageRef, formData.avatar);
        avatarURL = await getDownloadURL(storageRef);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      form.reset();
    } catch (error) {
      console.log(error);
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name,
          photoURL: avatarURL,
        });
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    }
    // createUserWithEmailAndPassword(auth, formData.email, formData.password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     form.reset();
    //     navigate("/login");
    //   })
    //   .catch((err) => {
    //     const errorCode = err.code;
    //     const errorMessage = err.message;
    //     console.log(err);
    //   });
  };

  return (
    <>
      <div className="bg-slate-600 py-[40px] px-[30px] rounded-2xl shadow-lg w-96">
        <Form {...form}>
          <form
            className="space-y-4 text-cyan-50"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="text-[24px] font-semibold">Registration</h2>

            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="cursor-pointer"
                      accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                      onChange={(event) =>
                        onChange(event?.target?.files?.[0] ?? undefined)
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input
                      type="password"
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Register</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;

function uuidv4() {
  throw new Error("Function not implemented.");
}
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/hooks/use-toast";

// // const formSchema = z
// //   .object({
// //     name: z.string().min(1, { message: "Name is Required" }),
// //     email: z.string().email().min(1, { message: "Email is Required" }),
// //     password: z
// //       .string()
// //       .min(8, "Password should be 8-24 in length")
// //       .max(24, { message: "Password should be 8-24 in length" }),
// //     confirmPassword: z
// //       .string()
// //       .min(1, { message: "Password should be 8-24 in length" }),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     message: "Password doens't match",
// //     path: ["confirm Password"],
// //   });

// // export type RegisterFormData = z.infer<typeof formSchema>;

// const RegisterForm = () => {
//   //   const form = useForm<RegisterFormData>({
//   //     resolver: zodResolver(formSchema),
//   //     defaultValues: {
//   //       name: "",
//   //       email: "",
//   //       password: "",
//   //       confirmPassword: "",
//   //     },
//   //   });

//   //   const onSubmit = async (formData: RegisterFormData) => {
//   //     console.log("Form submitted with data:", formData);
//   //     const { name, email, password } = formData;

//   //     const response = await fetch("http://localhost:8000/auth/register", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         name: name,
//   //         email: email,
//   //         password: password,
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       console.log(response);
//   //       toast({
//   //         title: "Something went wrong",
//   //         description: "Failed to create user",
//   //         variant: "destructive",
//   //       });
//   //     } else {
//   //       const user = await response.json();
//   //       console.log(user);
//   //     }
//   //   };

//   //   console.log(form);

//   return (
//     <>
//       <FormProvider {...form}>
//         <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter Your Name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter Your Email" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="Enter Your Password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Confirm Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="Confirm Your Password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Register</Button>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default RegisterForm;
