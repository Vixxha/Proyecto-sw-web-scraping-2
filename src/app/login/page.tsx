"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/firebase"

const loginSchema = z.object({
  correo: z.string().email("Correo inválido."),
  contraseña: z.string().min(1, "La contraseña es requerida."),
})

const registerSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellidos: z.string().min(1, "El apellido es requerido."),
  correo: z.string().email("Correo inválido."),
  contraseña: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
})

export default function LoginPage() {
  const { toast } = useToast()
  const auth = useAuth()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", contraseña: "" },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      correo: "",
      contraseña: "",
    },
  })

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.correo, values.contraseña)
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de vuelta!",
      })
      window.location.href = "/"
    } catch (error: any) {
      console.error("Login Error", error)
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
      if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        description = "Credenciales inválidas. Por favor, revisa tu correo y contraseña."
      }
      toast({
        variant: "destructive",
        title: "Error al Iniciar Sesión",
        description,
      })
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await createUserWithEmailAndPassword(
        auth,
        values.correo,
        values.contraseña
      )
      toast({
        title: "Registro Exitoso",
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
      })
      window.location.href = "/"
    } catch (error: any) {
      console.error("Register Error", error)
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        description = "Este correo electrónico ya está en uso. Por favor, intenta con otro."
      }
      toast({
        variant: "destructive",
        title: "Error en el Registro",
        description,
      })
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="text-center mb-6">
            <Logo className="h-12 w-12 text-primary mx-auto mb-2" />
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Crea tu Cuenta</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido de vuelta</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder a tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="correo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@ejemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="contraseña"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Crea una Cuenta</CardTitle>
              <CardDescription>
                Empieza creando una nueva cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={registerForm.control}
                            name="nombre"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                <Input placeholder="Juan" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={registerForm.control}
                            name="apellidos"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellidos</FormLabel>
                                <FormControl>
                                <Input placeholder="Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                  <FormField
                    control={registerForm.control}
                    name="correo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@ejemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="contraseña"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                    {registerForm.formState.isSubmitting ? "Creando..." : "Crear Cuenta"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
