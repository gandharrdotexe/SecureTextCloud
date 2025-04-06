"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, AlertCircle } from "lucide-react"
import { encryptMessage } from "@/lib/crypto-service"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "http://localhost:5003"

export default function MessageEncryptor() {
  const [message, setMessage] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [messageId, setMessageId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleEncryptAndSend = async () => {
    if (!message.trim()) {
      setError("Please enter a message to encrypt")
      return
    }

    if (!secretKey.trim()) {
      setError("Please enter a secret key")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const encryptedData = await encryptMessage(message, secretKey)

      const response = await axios.post(`${API_BASE_URL}/api/messages`, {
        encryptedMessage: encryptedData.encryptedMessage,
        iv: encryptedData.iv,
        salt: encryptedData.salt,
      })

      setMessageId(response.data.messageId)
      toast({
        title: "Message encrypted and stored",
        description: "Share the message ID with the recipient",
      })
      console.log("Message ID:", response.data.messageId);
    } catch (err) {
      console.error("Error encrypting or sending message:", err)
      setError("Failed to encrypt or send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (messageId) {
      navigator.clipboard.writeText(messageId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encrypt & Send Message</CardTitle>
        <CardDescription>Enter your message and a shared secret key to encrypt and send it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="Enter your secret message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="secretKey" className="text-sm font-medium">
            Secret Key
          </label>
          <Input
            id="secretKey"
            type="password"
            placeholder="Enter your shared secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This key will be used to encrypt your message. The recipient will need the same key to decrypt it.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {messageId && (
          <Alert>
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="font-medium">Message ID:</p>
                <p className="text-sm font-mono">{messageId}</p>
              </div>
              <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleEncryptAndSend} disabled={loading} className="w-full">
          {loading ? "Processing..." : "Encrypt & Send"}
        </Button>
      </CardFooter>
    </Card>
  )
}