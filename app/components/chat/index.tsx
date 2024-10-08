'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import { suggestions as initialSuggestions } from './suggestions'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'

export type IChatProps = {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponsing?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponsing,
  controlClearQuery,
  visionConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponsing)
        setQuery('')
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  // 点击问题时将问题填入query
  const handleClick = (text: string) => {
    setQuery(prevQuery => `${prevQuery} ${text}`)
  }
  // 展开/收起"试着问问"
  const [option, setOption] = useState(true)
  const toggleOption = () => {
    setOption(prevOption => !prevOption)
  }

  // 重排问题
  const getRandomQuestions = (suggestions, count = 3) => {
    const shuffled = suggestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  const [suggestions, setSuggestions] = useState(getRandomQuestions(initialSuggestions, initialSuggestions.length))

  useEffect(() => {
    if (isResponsing)
      setSuggestions(getRandomQuestions(initialSuggestions))
  }, [isResponsing])

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full')}>
      {/* Chat List */}
      <div className="h-full space-y-[30px]">
        {chatList.map((item) => {
          if (item.isAnswer) {
            const isLast = item.id === chatList[chatList.length - 1].id
            return <Answer
              key={item.id}
              item={item}
              feedbackDisabled={feedbackDisabled}
              onFeedback={onFeedback}
              isResponsing={isResponsing && isLast}
            />
          }
          return (
            <Question
              key={item.id}
              id={item.id}
              content={item.content}
              useCurrentUserAvatar={useCurrentUserAvatar}
              imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
            />
          )
        })}
      </div>
      {
        !isHideSendInput && (
          <div className={cn(!feedbackDisabled && '!left-3.5 !right-3.5', 'absolute z-10 bottom-0 left-0 right-0', 'w-4/5 mx-auto')}>

            {!option && (<div className={`${s.suggestSection}`}>
              <div className="flex items-center mb-2.5 py-2">
                <div className={`${s.line} grow`}></div>
                <button onClick={toggleOption} className={`${s.upIcon} w-4 h-4 ml-20`}></button>
                <div className={`${s.line} grow`}></div>
              </div>
            </div>)}
            {option && !isResponsing && (
              <div className={`${s.suggestSection}`}>
                <div className="flex items-center mb-2.5 py-2">
                  <div className={`${s.line} grow`}></div>
                  <div className="shrink-0 flex items-center px-3 text-gray-500">
                    <div className={`${s.starIcon} w-3 h-3 rounded-md mr-1`}></div>
                    <span className="text-xs text-gray-500 font-medium">{t('app.chat.tryToAsk')}</span>
                    <button onClick={toggleOption}
                      className={`${s.downIcon} w-4 h-4 ml-5`}></button>
                  </div>
                  <div className={`${s.line} grow`}></div>
                </div>
                <div className={`${s.suggestionList} flex flex-wrap justify-center items-center`}>
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onKeyPress={handleKeyPress}
                      onKeyUp={handleKeyUp}
                      onKeyDown={handleKeyDown}
                      onClick={() => handleClick(suggestion.text)}
                      className="mb-2 mr-2 last:mr-0 px-3 py-[5px] bg-white text-primary-600 text-xs font-medium border-solid border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm hover:border-gray-300">
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>)}

            <div className='p-[5.5px] max-h-[150px] bg-white border-[1.5px] border-gray-200 rounded-xl overflow-y-auto'>
              {
                visionConfig?.enabled && (
                  <>
                    <div className='absolute bottom-2 left-2 flex items-center'>
                      <ChatImageUploader
                        settings={visionConfig}
                        onUpload={onUpload}
                        disabled={files.length >= visionConfig.number_limits}
                      />
                      <div className='mx-1 w-[1px] h-4 bg-black/5' />
                    </div>
                    <div className='pl-[52px]'>
                      <ImageList
                        list={files}
                        onRemove={onRemove}
                        onReUpload={onReUpload}
                        onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                        onImageLinkLoadError={onImageLinkLoadError}
                      />
                    </div>
                  </>
                )
              }
              <Textarea
                className={`
                  block w-full px-2 pr-[118px] py-[7px] leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none
                  ${visionConfig?.enabled && 'pl-12'}
                `}
                value={query}
                onChange={handleContentChange}
                onKeyPress={handleKeyPress}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                autoSize
              />
              <div className="absolute bottom-2 right-2 flex items-center h-8">
                <div className={`${s.count} mr-4 h-5 leading-5 text-sm bg-gray-50 text-gray-500`}>{query.trim().length}</div>
                <Tooltip
                  selector='send-tip'
                  htmlContent={
                    <div>
                      <div>{t('common.operation.send')} Enter</div>
                      <div>{t('common.operation.lineBreak')} Shift Enter</div>
                    </div>
                  }
                >
                  <div className={`${s.sendBtn} w-8 h-8 cursor-pointer rounded-md`} onClick={handleSend}></div>
                </Tooltip>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
