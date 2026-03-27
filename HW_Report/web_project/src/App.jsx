import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section 
        id="center" 
        className="flex flex-col gap-[25px] justify-center items-center grow max-lg:pt-[32px] max-lg:px-[20px] max-lg:pb-[24px] max-lg:gap-[18px]"
      >
        <div className="relative">
          <img 
            src={heroImg} 
            className="w-[170px] relative z-0 inset-x-0 mx-auto" 
            width="170" 
            height="179" 
            alt="" 
          />
          <img 
            src={reactLogo} 
            className="absolute z-10 top-[34px] h-[28px] inset-x-0 mx-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]" 
            alt="React logo" 
          />
          <img 
            src={viteLogo} 
            className="absolute z-0 top-[107px] h-[26px] w-auto inset-x-0 mx-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]" 
            alt="Vite logo" 
          />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="text-[16px] px-[10px] py-[5px] rounded-[5px] text-[var(--accent)] bg-[var(--accent-bg)] border-2 border-transparent transition-colors duration-300 mb-[24px] hover:border-[var(--accent-border)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="relative w-full before:content-[''] before:absolute before:-top-[4.5px] before:border-[5px] before:border-transparent before:left-0 before:border-l-[var(--border)] after:content-[''] after:absolute after:-top-[4.5px] after:border-[5px] after:border-transparent after:right-0 after:border-r-[var(--border)]"></div>

      <section 
        id="next-steps" 
        className="flex border-t border-[var(--border)] text-left max-lg:flex-col max-lg:text-center"
      >
        <div 
          id="docs" 
          className="flex-1 p-[32px] border-r border-[var(--border)] max-lg:px-[20px] max-lg:py-[24px] max-lg:border-r-0 max-lg:border-b"
        >
          <svg className="mb-[16px] w-[22px] h-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul className="list-none p-0 flex gap-[8px] mt-[32px] max-lg:mt-[20px] max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://vite.dev/" 
                target="_blank" 
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <img className="h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://react.dev/" 
                target="_blank" 
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <img className="h-[18px] w-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div 
          id="social" 
          className="flex-1 p-[32px] max-lg:px-[20px] max-lg:py-[24px]"
        >
          <svg className="mb-[16px] w-[22px] h-[22px]" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className="list-none p-0 flex gap-[8px] mt-[32px] max-lg:mt-[20px] max-lg:flex-wrap max-lg:justify-center">
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://github.com/vitejs/vite" 
                target="_blank"
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <svg className="h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://chat.vite.dev/" 
                target="_blank"
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <svg className="h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://x.com/vite_js" 
                target="_blank"
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <svg className="h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="max-lg:flex-[1_1_calc(50%-8px)]">
              <a 
                href="https://bsky.app/profile/vite.dev" 
                target="_blank"
                className="text-[var(--text-h)] text-[16px] rounded-[6px] bg-[var(--social-bg)] flex py-[6px] px-[12px] items-center gap-[8px] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:w-full max-lg:justify-center max-lg:box-border"
              >
                <svg className="h-[18px] w-[18px]" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="relative w-full before:content-[''] before:absolute before:-top-[4.5px] before:border-[5px] before:border-transparent before:left-0 before:border-l-[var(--border)] after:content-[''] after:absolute after:-top-[4.5px] after:border-[5px] after:border-transparent after:right-0 after:border-r-[var(--border)]"></div>
      
      <section id="spacer" className="h-[88px] border-t border-[var(--border)] max-lg:h-[48px]"></section>
    </>
  )
}

export default App