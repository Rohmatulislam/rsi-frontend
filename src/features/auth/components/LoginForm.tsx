import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "~/components/ui/field"
import { useLoginForm } from "../hook/useLoginForm"
import { authClient } from "~/lib/auth-client"

export const LoginForm = () => {
  const { data: session } = authClient.useSession();
  const { form, onSubmit } = useLoginForm();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in {session?.user.name}</CardTitle>
        <CardDescription>
          Masukkan email dan kata sandi Anda untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="name@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          Don&apos;t have an account?{""}{" "}
          <Link href={"/register"} className="text-primary underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}