'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DotLottie } from '@lottiefiles/dotlottie-web'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface LottieEmptyCartProps {
  src?: string
  className?: string
}

// Default high quality empty shopping cart animation from LottieFiles CDN
const DEFAULT_LOTTIE_URL = 'https://assets5.lottiefiles.com/packages/lf20_qh5z2fdq.json'
const FALLBACK_LOTTIE_URL = 'https://lottie.host/8e6c46a6-0683-4903-b09e-7fa09403d98d/Y30h66oQc8.json'

export default function LottieEmptyCart({ src, className }: LottieEmptyCartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [useCanvas, setUseCanvas] = useState(false)
  const animationUrl = src || 'https://assets5.lottiefiles.com/packages/lf20_qh5z2fdq.json'

  useEffect(() => {
    if (!canvasRef.current) return

    let dotLottieInstance: DotLottie | null = null

    try {
      dotLottieInstance = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: animationUrl,
      })
    } catch (err) {
      console.warn('Lottie canvas init error:', err)
    }

    return () => {
      if (dotLottieInstance) {
        try {
          dotLottieInstance.destroy()
        } catch (_) {}
      }
    }
  }, [animationUrl, useCanvas])

  return (
    <div className={`flex justify-center items-center my-2 ${className || ''}`}>
      {/* React Lottie Player from LottieFiles official package */}
      <DotLottieReact
        src={animationUrl}
        loop
        autoplay
        className="w-[260px] h-[260px] md:w-[300px] md:h-[300px] object-contain drop-shadow-md"
        onError={() => setUseCanvas(true)}
      />
    </div>
  )
}
