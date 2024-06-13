import { ChangeEvent, FormEvent, useState } from 'react'

interface Message {
  message: string
  sender: 'bot' | 'user'
}

export function App() {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedMsg = message.trim()
    if (trimmedMsg !== '') {
      setMessages([...messages, { message: trimmedMsg, sender: 'user' }])
      setMessage('')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <main>
      <article>
        <ul className="box">
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
