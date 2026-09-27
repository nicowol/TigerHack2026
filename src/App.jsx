import { useState } from 'react'
import { Header, Navigation } from './components/Shell.jsx'
import Diagnose from './components/Diagnose.jsx'
import Library from './components/Library.jsx'
import LiveSession from './components/LiveSession.jsx'
import StretchModal from './components/StretchModal.jsx'
import { findStretch } from './data/stretches.js'
export default function App() {
  const [view, setView] = useState('diagnose')
  const [selectedMuscle, setSelectedMuscle] = useState('chest')
  const [activeStretch, setActiveStretch] = useState(findStretch('doorway-pec'))
  const [modalStretch, setModalStretch] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function startFlow(stretch) {
    setActiveStretch(stretch)
    setModalStretch(null)
    setView('live')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <Navigation
        view={view}
        onChange={setView}
        collapsed={sidebarCollapsed}
      />
      <main className={`main-content${sidebarCollapsed ? ' sidebar-is-collapsed' : ''}`}>
        {view === 'diagnose' && (
          <Diagnose
            selected={selectedMuscle}
            onSelect={setSelectedMuscle}
            onStart={startFlow}
            onDetails={setModalStretch}
          />
        )}
        {view === 'library' && <Library onStart={startFlow} onDetails={setModalStretch} />}
        {view === 'live' && (
          <LiveSession stretch={activeStretch} onStop={() => setView('diagnose')} />
        )}
      </main>
      <StretchModal
        stretch={modalStretch}
        onClose={() => setModalStretch(null)}
        onStart={startFlow}
      />
    </>
  )
}
