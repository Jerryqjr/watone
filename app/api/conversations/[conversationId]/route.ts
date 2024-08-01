import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const url = new URL(request.url)
  const conversationId = url.pathname.split('/').pop() // 从 URL 中提取 conversation_id

  if (!conversationId)
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })

  try {
    await client.deleteConversation(user, conversationId) // 调用后端删除 API
    return NextResponse.json({ result: 'success' }, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    console.error('Failed to delete conversation:', error) // 添加错误日志
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
}
