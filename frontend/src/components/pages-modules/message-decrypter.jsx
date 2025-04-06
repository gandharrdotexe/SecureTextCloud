"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { decryptMessage } from "@/lib/crypto-service"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "http://localhost:5003"

export default function MessageDecryptor() {
  const [messageId, setMessageId] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState(null)
  const [decryptedMessage, setDecryptedMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  const handleFetchMessage = async () => {
    if (!messageId.trim()) {
      setError("Please enter a message ID")
      return
    }

    try {
      setFetchLoading(true)
      setError(null)
      setEncryptedMessage(null)
      setDecryptedMessage(null)

      const response = await axios.get(`${API_BASE_URL}/api/messages/${messageId}`)

      if (response.data) {
        setEncryptedMessage({
          encryptedMessage: response.data.encryptedMessage,
          iv: response.data.iv,
          salt: response.data.salt,
        })
        toast({
          title: "Message retrieved",
          description: "Enter your secret key to decrypt the message",
        })
      } else {
        setError("Message not found. Please check the ID and try again.")
      }
    } catch (err) {
      console.error("Error fetching message:", err)
      setError("Failed to fetch message. Please check the ID and try again.")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!encryptedMessage) {
      setError("No encrypted message to decrypt")
      return
    }

    if (!secretKey.trim()) {
      setError("Please enter a secret key")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const decrypted = await decryptMessage(
        encryptedMessage.encryptedMessage,
        secretKey,
        encryptedMessage.iv,
        encryptedMessage.salt,
      )

      setDecryptedMessage(decrypted)
      toast({
        title: "Message decrypted",
        description: "The message has been successfully decrypted",
      })
    } catch (err) {
      console.error("Error decrypting message:", err)
      setError("Failed to decrypt message. Please check your secret key and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fetch & Decrypt Message</CardTitle>
        <CardDescription>Enter a message ID to fetch and decrypt it with your shared secret key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="messageId" className="text-sm font-medium">
            Message ID
          </label>
          <div className="flex space-x-2">
            <Input
              id="messageId"
              placeholder="Enter the message ID"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
            />
            <Button onClick={handleFetchMessage} disabled={fetchLoading} className="shrink-0">
              {fetchLoading ? "Fetching..." : "Fetch"}
            </Button>
          </div>
        </div>

        {encryptedMessage && (
          <>
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
            </div>

            <div className="space-y-2">
              <Button onClick={handleDecrypt} disabled={loading} className="w-full">
                {loading ? "Decrypting..." : "Decrypt Message"}
              </Button>
            </div>
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {decryptedMessage && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Decrypted Message</label>
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="whitespace-pre-wrap">{decryptedMessage}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}