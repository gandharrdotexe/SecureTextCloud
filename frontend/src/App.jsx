// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <h1 className="text-3xl font-bold underline">
//       Hello world!
//     </h1>
//     </>
//   )
// }

// export default App

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import MessageEncryptor from "@/components/pages-modules/message-encrypter";
// import MessageDecryptor from "@/components/pages-modules/message-decrypter";

// export default function App() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 overflow-y-auto no-scrollbar md:p-24">
//       <div className="w-full max-w-3xl mx-auto space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight">SecureTextCloud</h1>
//           <p className="text-muted-foreground">Securely share encrypted messages with end-to-end encryption</p>
//         </div>

//         <Tabs defaultValue="encrypt" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="encrypt">Encrypt & Send</TabsTrigger>
//             <TabsTrigger value="decrypt">Fetch & Decrypt</TabsTrigger>
//           </TabsList>
//           <TabsContent value="encrypt">
//             <MessageEncryptor />
//           </TabsContent>
//           <TabsContent value="decrypt">
//             <MessageDecryptor />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </main>
//   );
// }

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";  
// import MessageEncryptor from "@/components/pages-modules/message-encrypter";
// import MessageDecryptor from "@/components/pages-modules/message-decrypter";

// export default function App() {
//   return (
//     <main className="flex flex-col items-center p-4 md:p-8"> {/* Reduced padding-top */}
//       <div className="w-full max-w-3xl mx-auto space-y-4"> {/* Reduced space-y */}
//         <div className="text-center space-y-1"> {/* Reduced space-y */}
//           <h1 className="text-3xl font-bold tracking-tight">SecureTextCloud</h1>
//           <p className="text-muted-foreground">Securely share encrypted messages with end-to-end encryption</p>
//         </div>

//         <Tabs defaultValue="encrypt" className="w-full mt-2"> {/* Added small margin-top */}
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="encrypt">Encrypt & Send</TabsTrigger>
//             <TabsTrigger value="decrypt">Fetch & Decrypt</TabsTrigger>
//           </TabsList>
//           <TabsContent value="encrypt">
//             <MessageEncryptor />
//           </TabsContent>
//           <TabsContent value="decrypt">
//             <MessageDecryptor />
//           </TabsContent>
//         </Tabs>
//       </div>

//       <Button onClick={() => toast({ title: "Test Toast" })}>
//   Test Toast
// </Button>
//     </main>
//   );
// }


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";  
import { Toaster } from "@/components/ui/toaster";
import MessageEncryptor from "@/components/pages-modules/message-encrypter";
import MessageDecryptor from "@/components/pages-modules/message-decrypter";

export default function App() {
  const { toast } = useToast();

  return (
    <>
      <main className="flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">SecureTextCloud</h1>
            <p className="text-muted-foreground">Securely share encrypted messages with end-to-end encryption</p>
          </div>

          <Tabs defaultValue="encrypt" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt">Encrypt & Send</TabsTrigger>
              <TabsTrigger value="decrypt">Fetch & Decrypt</TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt">
              <MessageEncryptor />
            </TabsContent>
            <TabsContent value="decrypt">
              <MessageDecryptor />
            </TabsContent>
          </Tabs>
        </div>

        
      </main>
      
      {/* Add Toaster at the root level */}
      <Toaster />
    </>
  );
}