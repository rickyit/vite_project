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
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirestoreError } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, "email is required")
    .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*")),
  password: z.string().min(1, "Password is required"),
});

type formData = z.infer<typeof formSchema>;

const LoginForm = () => {
  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(form);
  const navigate = useNavigate();

  const onSubmit = async (formData: formData) => {
    // signInWithEmailAndPassword(auth, formData.email, formData.password)
    //   .then((userCredential) => {
    //     const user = userCredential;
    //     console.log("I'm logined");
    //     form.reset();
    //   })
    //   .catch((err) => {
    //     const errorCode = err.code;
    //     const errorMessage = err.message;
    //     console.log(err);
    //   });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential;
      console.log("I'm logged in");
      console.log(user);
      form.reset();
      navigate("/");
    } catch (err) {
      if (err instanceof FirestoreError) {
        const errorCode = err.code;
        const errorMessage = err.message;
      }
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-slate-600 py-[40px] px-[30px] rounded-2xl shadow-lg w-96">
        <Form {...form}>
          <form
            className="space-y-4 text-cyan-50"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="text-[24px] font-semibold">Login</h2>

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

            <Button type="submit">Login</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
