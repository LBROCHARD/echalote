import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import { useAuth } from "@/providers/AuthContext"
import { Toaster } from "../ui/sonner"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAxiosClient } from "@/providers/AxiosContext"

const formSchema = z.object({
  email: z.string().email({message: "Please enter a valid email"}).min(3),
  password: z.string().min(8, {message: "The password must be at least 8 characters"})
})

 
const RegisterForm = () => {
  const axiosClient = useAxiosClient();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [fetchError, setFetchError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFetchError(""); // this is used to show the error reloads when trying again
    
    try {
      const response = await axiosClient.post("auth/login", {
        username: "",
        email: values.email,
        password: values.password
      });

      const data = response.data;
      
      console.log("connect result : ", data);
      login(data.access_token, {username: data.username, email: data.email, id: data.id})
      toast("Successfully logged in as : " + user?.username);
      navigate("/")

    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setFetchError("This user does not exist, or the password is incorrect");
      } else {
        setFetchError("Unexpected error, please try again");
      }
    }
  }

  return (
    <div className="items-center justify-center">
      <Toaster/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Adress</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@mail.com" {...field} />
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
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-red-600">{fetchError}</p>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm