import React, { useEffect, useState } from 'react'
import { useLogto } from '@logto/react'
import './DiaryPage.css'
import * as diaryApi from '../services/diaryApi'

export default function DiaryPage() {
    const { getAccessToken } = useLogto()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [dateDisplay, setDateDisplay] = useState('載入中...')
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const formatDateForStorage = (d) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    const formatDateForDisplay = (dateStr) => {
        const [y, m, d] = dateStr.split('-')
        return `${y}.${Number(m)}.${Number(d)}`
    }

    const loadDiaries = async () => {
        setIsLoading(true)
        try {
            const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE)
            const entries = await diaryApi.fetchDiaries(token)
            setHistory(entries)
        } catch (error) {
            console.error('讀取日記失敗：', error)
            alert('讀取日記失敗，請稍後再試')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const today = new Date()
        setDateDisplay(`${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`)
        loadDiaries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function handleSave() {
        if (title.trim() === '' || content.trim() === '') {
            alert('請輸入標題與內容')
            return
        }

        try {
            const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE)
            await diaryApi.createDiary(token, {
                date: formatDateForStorage(new Date()),
                title: title.trim(),
                content: content.trim(),
            })

            await loadDiaries()
            setTitle('')
            setContent('')
            console.log('日記已儲存！')
        } catch (error) {
            console.error('儲存日記失敗：', error)
            alert('儲存失敗，請稍後再試')
        }
    }

    function handleReadMore(entry) {
        alert(`【${entry.title}】\n\n${entry.content}`)
    }

    return (
        <div className="diary-app">
            <header className="app-header">
                <h1>心靈時光機</h1>
                <p>記錄當下的情緒與思考</p>
            </header>

            <main className="diary-container">
                <section className="editor-section">
                    <div className="card">
                        <input
                            type="text"
                            className="diary-title"
                            placeholder="給這份心情起個標題..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea
                            className="diary-content"
                            placeholder="今天發生了什麼精彩的事？"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <div className="editor-footer">
                            <span className="date-display">{dateDisplay}</span>
                            <button className="save-btn" onClick={handleSave}>
                                儲存日記
                            </button>
                        </div>
                    </div>
                </section>

                <hr className="divider" />

                <section className="history-section">
                    <h3>過往點滴</h3>
                    <div className="history-grid">
                        {isLoading && <p>日記載入中...</p>}
                        {!isLoading && history.length === 0 && <p>目前還沒有日記，寫下第一篇吧！</p>}
                        {history.map((h, idx) => (
                            <article className="diary-card" key={idx}>
                                <div className="card-date">{formatDateForDisplay(h.date)}</div>
                                <h4>{h.title}</h4>
                                <p>{h.content}</p>
                                <button className="read-more" onClick={() => handleReadMore(h)}>
                                    閱讀全文
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}