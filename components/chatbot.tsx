'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info } from "lucide-react"

const InfoButton = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-full w-6 h-6 border border-gray-300 text-gray-500 hover:bg-gray-100 ml-2"
    aria-label="Mais informações"
  >
    <Info className="w-4 h-4" />
  </a>
)

export function Chatbot() {
  const [currentMessage, setCurrentMessage] = useState("Chuva de peixes em ruas na cidade de Santa Maria, RS por conta de alagamentos.")
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string, content: string }>>([])
  const [conversationSet, setConversationSet] = useState(0)
  const [conversationStep, setConversationStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isConversationEnded, setIsConversationEnded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const conversations = [
    {
      messages: [
        {
          message: "Chuva de peixes em ruas na cidade de Santa Maria, RS por conta de alagamentos.",
          response: "É fake: a notícia falsa é acompanhada de imagens de peixes espalhados pela calçada e pela rua, sendo falsamente atribuídas à crise climática no Rio Grande do Sul. Porém, as imagens aparecem em publicações desde 2015, anos antes do evento."
        },
        {
          message: "As imagens que aparecem em 2015 são verdadeiras?",
          response: "Não é possível confirmar se as imagens dos peixes nas calçadas são verdadeiras, mas portais de checagem identificaram que elas já foram usadas para espalhar desinformação em 2019. Uma das imagens inclui um carro cuja placa indica que a foto foi tirada na Índia."
        }
      ],
      sourceUrl: "https://oglobo.globo.com/fato-ou-fake/noticia/2024/05/16/e-fake-que-cidade-gaucha-tenha-registrado-chuva-de-peixes-durante-enchentes-no-rio-grande-do-sul.ghtml"
    },
    {
      messages: [
        {
          message: "É verdade que Veneza corre o risco de ser permanentemente inundada?",
          response: "Sim, Veneza corre risco de ser permanentemente inundada. A cidade enfrenta há anos desafios devido à elevação do nível do mar e ao afundamento gradual do solo (fenômeno conhecido como subsidence). De acordo com especialistas, Veneza está afundando de 1 a 2 milímetros por ano. Além disso, o aumento do nível do mar devido às mudanças climáticas coloca a cidade sob maior risco, pois marés altas, chamadas acqua alta, têm se tornado mais frequentes e intensas."
        },
        {
          message: "Há algo sendo feito para evitar isso?",
          response: "Para mitigar esses riscos, foi implementado o projeto MOSE (Modulo Sperimentale Elettromeccanico), um sistema de barreiras móveis projetado para proteger Veneza de inundações. Esse sistema é composto por diques móveis que se elevam quando as marés são altas para bloquear a água. No entanto, mesmo com o MOSE, há preocupações sobre sua durabilidade a longo prazo e os impactos do aquecimento global, que podem elevar o nível do mar além do que o sistema é capaz de suportar."
        }
      ],
      sourceUrl: "https://habitability.com.br/projeto-mose/"
    }
  ]

  useEffect(() => {
    adjustTextareaHeight()
  }, [currentMessage])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversationHistory])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSend = async () => {
    if (isTyping || isConversationEnded) return

    const currentConversation = conversations[conversationSet]
    
    if (conversationStep < currentConversation.messages.length) {
      const userMessage = { role: 'user', content: currentMessage }
      setConversationHistory(prev => [...prev, userMessage])
      setCurrentMessage('')
      setIsTyping(true)

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const botResponse = { role: 'bot', content: currentConversation.messages[conversationStep].response }
      setConversationHistory(prev => [...prev, botResponse])
      setIsTyping(false)

      if (conversationStep === currentConversation.messages.length - 1) {
        setIsConversationEnded(true)
      } else {
        setCurrentMessage(currentConversation.messages[conversationStep + 1].message)
        setConversationStep(conversationStep + 1)
      }
    }
  }

  const handleNewConversation = () => {
    const nextSet = (conversationSet + 1) % conversations.length
    setConversationSet(nextSet)
    setConversationStep(0)
    setCurrentMessage(conversations[nextSet].messages[0].message)
    setConversationHistory([])
    setIsConversationEnded(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full flex flex-col" style={{ width: '360px', height: '640px' }}>
        <CardHeader>
          <CardTitle>GreenCheck</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            {conversationHistory.map((message, index) => (
              <div key={index} className={`mb-4 p-4 rounded-lg ${message.role === 'user' ? 'bg-muted' : 'bg-primary/10'}`}>
                <div className="flex justify-between items-start">
                  <p className="font-medium">
                    {message.role === 'user' ? 'Usuário:' : 'Chatbot:'}
                  </p>
                  {message.role === 'bot' && <InfoButton url={conversations[conversationSet].sourceUrl} />}
                </div>
                <p>{message.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4 p-4 rounded-lg bg-primary/10">
                <p className="font-medium">Chatbot:</p>
                <p>Digitando...</p>
              </div>
            )}
            {isConversationEnded && (
              <div className="mb-4 text-center text-muted-foreground">
                Conversa Encerrada.
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex w-full space-x-2 items-center">
            <Textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-grow resize-none"
              rows={1}
              disabled={isConversationEnded}
            />
            <Button onClick={handleSend} disabled={isTyping || isConversationEnded} className="h-full">Enviar</Button>
          </div>
          <Button onClick={handleNewConversation} variant="outline" className="w-full">Nova Conversa</Button>
        </CardFooter>
      </Card>
    </div>
  )
}