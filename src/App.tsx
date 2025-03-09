// apps/lynx-mobile/src/App.tsx
import { useCallback, useEffect, useState } from '@lynx-js/react'
import { LoginScreen } from './views/loginScreen.js' // Import LoginScreen

import './App.css'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App() {
  const [alterLogo, setAlterLogo] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'login'>('home') // Track active screen

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])

  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(!alterLogo)
  }, [alterLogo])

  // Navigate to LoginScreen when button is clicked
  if (currentScreen === 'login') {
    return <LoginScreen onBack={() => setCurrentScreen('home')} />
  }

  return (
      <view>
        <view className='Background' />
        <view className='App'>
          <view className='Banner'>
            <view className='Logo' bindtap={onTap}>
              {alterLogo
                  ? <image src={reactLynxLogo} className='Logo--react'/>
                  : <image src={lynxLogo} className='Logo--lynx'/>}
            </view>

            <text className='Title'>React</text>
            <text className='Subtitle'>on Lynx</text>

            {/* Navigate to LoginScreen */}
            <view className="ButtonContainer" bindtap={() => setCurrentScreen('login')}>
              <view className="ButtonShadow"></view>
              {/* Shadow Layer */}
              <view className="Button">
                <text className="login_btn">Login</text>
              </view>
            </view>
          </view>
          <view className='Content'>
            <image src={arrow} className='Arrow'/>
            <text className='Description'>Touch the logo and have fun!</text>
            <text className='Hint'>
              Edit
              <text style={{fontStyle: 'italic'}}>{' src/App.tsx '}</text>
              to see updates!
            </text>
          </view>
          <view style={{ flex: 1 }}></view>
        </view>
      </view>
  )
}