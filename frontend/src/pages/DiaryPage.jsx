import React, { useEffect, useState } from 'react'
import './DiaryPage.css'

export default function DiaryPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [dateDisplay, setDateDisplay] = useState('載入中...')

    const [history, setHistory] = useState([
        {
            date: '2026.03.12',
            title: '台北的小雨',
            content: '今天在街角那間咖啡廳坐了一下午，雨聲配上爵士樂真的很有氛圍...',
        },
        {
            date: '2026.03.10',
            title: '終於完成專案了！',
            content: '這三個月的努力沒有白費，雖然過程很辛苦，但看到成果那刻真的...',
        },
    ])

    useEffect(() => {
        const today = new Date()
        setDateDisplay(`${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`)
    }, [])

    function handleSave() {
        if (title.trim() === '' || content.trim() === '') {
            alert('請輸入標題與內容')
            return
        }

        const now = new Date()
        const dateString = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`

        const newEntry = {
            date: dateString,
            title: title,
            content: content,
        }

        setHistory(prev => [newEntry, ...prev])
        setTitle('')
        setContent('')
        console.log('日記已儲存！')
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
                        {history.map((h, idx) => (
                            <article className="diary-card" key={idx}>
                                <div className="card-date">{h.date}</div>
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