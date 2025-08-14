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

// Regex for at least : 1 lowercase, 1 uppercase, 1 number and 1 special character
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+\-=/~])[A-Za-z\d@$!%*?&+\-=/~]{8,}$/;
 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string()
    .email({message: "Please enter a valid email"}).min(3),
  password: z.string()
    .min(8, {message: "The password must be at least 8 characters"})
    .regex(strongPasswordRegex, "The password must contain at least : 1 lowercase, 1 uppercase, 1 number and 1 special character")
})
 
const RegisterForm = () => {
  const API = import.meta.env.VITE_REACT_APP_API_URL
  const {user, login} = useAuth();
  const navigate = useNavigate();

  const [fetchError, setFetchError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const logIn = async (email: string, password: string) => {
    try {
      const response = await fetch(API + "/auth/login", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: "",
          email: email,
          password: password
        }) 
      });

      const json = await response.json();
      console.log("result : ", json);
      login(json.access_token, {username: json.username, email: json.username, id: json.id})
      toast("Successfully logged in as : " + user?.username);
      navigate("/")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast("Error trying to login: " + error.message)
      }
    }
  }
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFetchError(""); // this is used to show the error reloads when trying again
    try {
      const response = await fetch(API + "/auth/signup", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password
        })
      });
      if (!response.ok ) {
        if ([400].indexOf(response.status) !== -1) {
          setFetchError(`Can't create an account with this username or email adress.`);
          return
        }
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log("json = ", json);
      logIn(values.email, values.password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setFetchError(`Response status:  ${error.message}`);
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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