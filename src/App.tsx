import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Orbit } from 'ldrs/react'
import 'ldrs/react/Orbit.css'

import { Monogram } from '@/components/brand/Monogram'
import { EditLayer } from '@/components/edit/EditLayer'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { EditModeProvider } from '@/context/EditModeContext'
import { MotionProvider } from '@/context/MotionContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { SiteContentProvider } from '@/context/SiteContentContext'
import { ToastProvider } from '@/context/ToastContext'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ResumePage = lazy(() => import('@/pages/ResumePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function LoadingShell() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-ink">
      <Monogram width={72} height={72} />
      <Orbit size={44} speed={1.4} color="var(--color-brand)" />
      <span className="sr-only" role="status">
        Loading the series…
      </span>
    </div>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <SiteContentProvider>
          <ToastProvider>
            <EditModeProvider>
              <ProfileProvider>
                {/* Smooth inertial scrolling across every route. */}
                <SmoothScroll />
                {/* Netflix-style episode-progress line pinned to the top. */}
                <ScrollProgress />
                {/* Inline editor chrome (dialog, form, status pill). */}
                <EditLayer />
                <Suspense fallback={<LoadingShell />}>
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="resume" element={<ResumePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </ProfileProvider>
            </EditModeProvider>
          </ToastProvider>
        </SiteContentProvider>
      </BrowserRouter>
    </MotionProvider>
  )
}
