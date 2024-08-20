import React, { useEffect, useRef, useState } from 'react'
import s from './style.module.css'
const VoiceRecognition = ({ onTranscriptChange }) => {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.lang = 'zh-CN'
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onresult = (event) => {
        const speechToText = event.results[0][0].transcript
        onTranscriptChange(speechToText) // 传递结果给父组件
      }

      recognitionInstance.onend = () => {
        // 识别结束后，如果没有识别结果，可以通知父组件或执行其他逻辑
        if (!isListening)
          onTranscriptChange('没有识别到有效的语音输入')

        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognitionInstance
    }
    else {
      console.error('浏览器不支持 Web Speech API')
    }
  }, [onTranscriptChange])

  const handleStartStop = () => {
    if (isListening)
      recognitionRef.current.stop()
    else
      recognitionRef.current.start()

    setIsListening(!isListening)
  }

  return (
    <div>
      <button
        onClick={handleStartStop}
        className={isListening ? s.micOffIcon : s.micOnIcon}
        style={{ width: '32px', height: '32px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
      >
      </button>
    </div>
  )
}

export default VoiceRecognition
