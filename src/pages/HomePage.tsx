import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Supplier } from "@/lib/types";

const supplierSchema = z.object({
  title: z.string().min(1, "Supplier name is required"),
});

export type supplierFormData = z.infer<typeof supplierSchema>;

const HomePage = () => {
  const form = useForm<supplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      title: "",
    },
  });
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentSuplier, setCurrentSuppliers] = useState<Supplier | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "suppliers")),
      (querySnapshot) => {
        let suppliersArray: Supplier[] = [];
        querySnapshot.forEach((doc) => {
          suppliersArray.push({ _id: doc.id, ...doc.data() } as Supplier);
        });
        setSuppliers(suppliersArray);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const onSubmit = async (formData: supplierFormData) => {
    console.log(currentSuplier);

    if (currentSuplier) {
      try {
        const supplierRef = doc(db, "suppliers", currentSuplier._id);
        await updateDoc(supplierRef, {
          title: formData.title,
        });
        toast({
          title: "Supplier Update",
          description: `You have successfully update the supplier`,
        });
        setCurrentSuppliers(null);
        form.reset();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "suppliers"), {
          title: formData.title,
        });
        toast({
          title: "Supplier created",
          description: `You have successfully created a new supplier (${formData.title})`,
        });
        form.reset();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDelete = async (supplier: Supplier) => {
    try {
      await deleteDoc(doc(db, "suppliers", supplier._id));
      toast({
        title: "Supplier delete",
        description: `You have successfully delete a new supplier (${supplier.title})`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async (supplier: Supplier) => {
    setCurrentSuppliers(supplier);
    form.setValue("title", supplier.title);
  };

  console.log(form);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="outline">
            {currentSuplier ? "Update Supplier" : "Create supplier"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length > 0 &&
              suppliers.map((supplier, index) => (
                <TableRow key={index}>
                  <TableCell>{supplier.title}</TableCell>
                  <TableCell className="text-right ">
                    <Button
                      onClick={() => onDelete(supplier)}
                      className="mr-1"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                    <Button onClick={() => onUpdate(supplier)}>Update</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default HomePage;
