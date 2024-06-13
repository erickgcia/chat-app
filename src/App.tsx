import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm'

interface Message {
  message: string
  sender: 'bot' | 'user'
}

export function App() {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      message: 'What do you want to know?',
      sender: 'bot',
    },
  ])
  const [engine, setEngine] = useState<MLCEngine | null>(null)
  const boxRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        const selectedModel = 'gemma-2b-it-q4f32_1-MLC'
        const createdEngine = await CreateMLCEngine(selectedModel, {
          initProgressCallback: (info) => {
            console.log(info)
          },
        })
        setEngine(createdEngine)
      } catch (error) {
        console.error('Error initializing engine:', error)
      }
    }

    initializeEngine()
  }, [])

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedMsg = message.trim()
    if (trimmedMsg !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: trimmedMsg, sender: 'user' },
      ])
      setMessage('')

      if (engine) {
        try {
          const reply = await engine.chat.completions.create({
            messages: messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'system',
              content: msg.message,
            })),
          })

          const botAnswer = reply.choices[0].message.content

          if (typeof botAnswer === 'string') {
            setMessages((prevMessages) => [
              ...prevMessages,
              { message: botAnswer, sender: 'bot' },
            ])
          } else {
            console.error('Invalid bot response:', botAnswer)
          }
        } catch (error) {
          console.error('Error fetching bot reply:', error)
        }
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <main>
      <article>
        <ul ref={boxRef} className="box">
          {messages.map((msg, index) => (
            <li key={index} className={`message message--${msg.sender}`}>
              <span
                className={`message__identifier message__identifier--${msg.sender}`}
              >
                {msg.sender === 'user' ? 'You' : 'GPT'}
              </span>
              <p className="message__response">{msg.message}</p>
            </li>
          ))}
        </ul>
      </article>

      <form onSubmit={handleSubmit} className="form">
        <input
          onChange={handleChange}
          value={message}
          placeholder="Write your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}
