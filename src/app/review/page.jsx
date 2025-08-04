"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import Breadcrumbs from "../../components/Breadcrumbs"
import { Star, Upload, Send, MessageSquare, ImageIcon, CheckCircle, AlertCircle, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

export default function MisResenasPage() {
  const { theme } = useAuth()
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [previewImages, setPreviewImages] = useState({})
  const [submitting, setSubmitting] = useState({})

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/reviews/elegibles`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ productos }) => {
        setProductos(productos)
        const init = {}
        productos.forEach((p) => {
          init[p.productoId] = {
            comment: "",
            rating: 5,
            sabor: 5,
            empaque: 5,
            precio: 5,
            recomendacion: 5,
            entrega: 5,
            files: [],
          }
        })
        setForm(init)
        setPreviewImages({})
      })
      .catch((e) => setError("No se pudieron cargar los productos para reseña."))
  }, [])

  const handleChangeText = (id, field, value) => {
    setForm((f) => ({
      ...f,
      [id]: { ...f[id], [field]: value },
    }))
  }

  const handleFilesChange = (id, filesList) => {
    const files = Array.from(filesList).slice(0, 5)
    setForm((f) => ({
      ...f,
      [id]: { ...f[id], files },
    }))

    const previews = {}
    files.forEach((file) => {
      previews[file.name] = URL.createObjectURL(file)
    })
    setPreviewImages((prev) => ({
      ...prev,
      [id]: previews,
    }))
  }

  const removeImage = (productoId, fileName) => {
    setForm((f) => ({
      ...f,
      [productoId]: {
        ...f[productoId],
        files: f[productoId].files.filter((file) => file.name !== fileName),
      },
    }))
    setPreviewImages((prev) => {
      const newPreviews = { ...prev }
      if (newPreviews[productoId]) {
        URL.revokeObjectURL(newPreviews[productoId][fileName])
        delete newPreviews[productoId][fileName]
      }
      return newPreviews
    })
  }

  const handleSubmit = async (productoId) => {
    setMsg("")
    setError("")
    setSubmitting((prev) => ({ ...prev, [productoId]: true }))

    const { comment, rating, sabor, empaque, precio, recomendacion, entrega, files } = form[productoId]

    const fd = new FormData()
    fd.append("productoId", productoId)
    fd.append("comment", comment)
    fd.append("rating", rating)
    fd.append("sabor", sabor)
    fd.append("empaque", empaque)
    fd.append("precio", precio)
    fd.append("recomendacion", recomendacion)
    fd.append("entrega", entrega)
    files.forEach((f) => fd.append("images", f))

    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/reviews/reviews`, {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al enviar reseña")

      setMsg("Reseña enviada con éxito")
      setProductos((p) => p.filter((x) => x.productoId !== productoId))
      if (previewImages[productoId]) {
        Object.values(previewImages[productoId]).forEach((url) => URL.revokeObjectURL(url))
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting((prev) => ({ ...prev, [productoId]: false }))
    }
  }

  const renderStars = (productId, field, currentValue) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleChangeText(productId, field, star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= currentValue
                  ? "fill-pink-500 text-pink-500"
                  : "fill-gray-200 text-gray-200 hover:fill-pink-300 hover:text-pink-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{currentValue}/5</span>
      </div>
    )
  }

  const reviewQuestions = [
    { label: "¿Qué te pareció el sabor?", field: "sabor", icon: "🍯" },
    { label: "¿Qué opinas del empaque?", field: "empaque", icon: "📦" },
    { label: "¿Cómo valoras el precio?", field: "precio", icon: "💰" },
    { label: "¿Recomendarías este producto?", field: "recomendacion", icon: "👍" },
    { label: "¿Qué tal fue la entrega?", field: "entrega", icon: "🚚" },
  ]

  return (
    <div
      className={`min-h-screen py-8 pt-36 px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="container mx-auto max-w-4xl">
        <Breadcrumbs
          pages={[
            { name: "Home", path: "/" },
            { name: "Mis Reseñas", path: "/misResenas" },
          ]}
        />

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageSquare className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold">Mis Reseñas</h1>
          </div>
          <p className="text-muted-foreground">Comparte tu experiencia con los productos que has comprado</p>
        </div>

        {msg && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{msg}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {productos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle className="h-16 w-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No hay productos pendientes de reseña</h2>
              <p className="text-muted-foreground mb-6">
                Cuando compres productos, podrás dejar tu opinión sobre ellos aquí
              </p>
              <Button onClick={() => (window.location.href = "/producto")} className="bg-pink-600 hover:bg-pink-700">
                <Package className="h-4 w-4 mr-2" />
                Ver Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {productos.map((p) => (
              <Card key={p.productoId} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-gray-900">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-lg border">
                      <AvatarImage src={p.imageUrl || "/placeholder.svg"} alt={p.name} />
                      <AvatarFallback className="rounded-lg bg-pink-100 text-pink-800">
                        <Package className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{p.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Comparte tu experiencia con este producto</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Preguntas con estrellas en grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-pink-500" />
                      Califica tu experiencia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviewQuestions.map(({ label, field, icon }) => (
                        <div key={field} className="space-y-3 p-4 rounded-lg border bg-card/50">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-lg">{icon}</span>
                            {label}
                          </Label>
                          <div className="pl-6">
                            {renderStars(p.productoId, field, form[p.productoId]?.[field] || 5)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Comentario */}
                  <div className="space-y-3">
                    <Label
                      htmlFor={`comment-${p.productoId}`}
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <MessageSquare className="h-5 w-5 text-pink-500" />
                      Tu comentario
                    </Label>
                    <Textarea
                      id={`comment-${p.productoId}`}
                      placeholder="Comparte tu experiencia con este producto... ¿Qué te gustó más? ¿Hay algo que mejorarías?"
                      value={form[p.productoId]?.comment || ""}
                      onChange={(e) => handleChangeText(p.productoId, "comment", e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Imágenes */}
                  <div className="space-y-3">
                    <Label htmlFor={`images-${p.productoId}`} className="flex items-center gap-2 text-lg font-semibold">
                      <ImageIcon className="h-5 w-5 text-pink-500" />
                      Imágenes (opcional)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Label
                        htmlFor={`images-${p.productoId}`}
                        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-pink-500" />
                        <span className="font-medium">Subir imágenes</span>
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        Máx. 5 imágenes
                      </Badge>
                    </div>
                    <input
                      id={`images-${p.productoId}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFilesChange(p.productoId, e.target.files)}
                      className="hidden"
                    />

                    {/* Previsualización */}
                    {previewImages[p.productoId] && Object.keys(previewImages[p.productoId]).length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {Object.entries(previewImages[p.productoId]).map(([fileName, url]) => (
                          <div key={fileName} className="relative group">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={fileName}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-pink-100"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(p.productoId, fileName)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botón enviar */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={() => handleSubmit(p.productoId)}
                      disabled={submitting[p.productoId]}
                      className="bg-pink-600 hover:bg-pink-700 gap-2 px-8 py-3 text-base font-semibold"
                      size="lg"
                    >
                      <Send className="h-5 w-5" />
                      {submitting[p.productoId] ? "Enviando..." : "Enviar reseña"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
