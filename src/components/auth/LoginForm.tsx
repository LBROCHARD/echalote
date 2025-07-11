import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
 
const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
  email: z.string().email({message: "Please enter a valid email"}).min(3),
  password: z.string().min(8, {message: "The password must be at least 8 characters"})
})

interface RegisterFormProps {
  setToken: (newToken: string) => void
}
 
const RegisterForm = (props: RegisterFormProps) => {
  const API = import.meta.env.VITE_REACT_APP_API_URL

  const [fetchError, setFetchError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    // To be used later for email/username auth
    //   username: "",
      email: "",
      password: "",
    },
  })
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)

    try {
      const response = await fetch(API + "/auth/login", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: "",
          email: values.email,
          password: values.password
        }) 
      });
      if (!response.ok ) {
        if ([401, 403].indexOf(response.status) !== -1) {
          console.log("Unauthorized");
          setFetchError(`Response status:  ${response.status}`);
          return
        }
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      props.setToken(json.access_token)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {// To be used later for email/username auth
          /* <FormField
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
          /> */}
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p>{fetchError}</p>
    </>
  )
}

export default RegisterForm