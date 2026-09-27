import { useEffect, useRef, useState } from 'react'
import { Header, Navigation } from './components/Shell.jsx'
import Diagnose from './components/Diagnose.jsx'
import Library from './components/Library.jsx'
import LiveSession from './components/LiveSession.jsx'
import Presets from './components/Presets.jsx'
import StretchModal from './components/StretchModal.jsx'
import { stretches } from './data/stretches.js'

const QUEUE_KEY = 'sumi.flowQueue.v1'
const PRESETS_KEY = 'sumi.flowPresets.v1'
const FAVORITES_KEY = 'sumi.favorites.v1'
const RECENTS_KEY = 'sumi.recents.v1'
const CHIMES_MUTED_KEY = 'sumi.chimesMuted.v1'

function readStoredList(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function readStoredBoolean(key) {
  try {
    return window.localStorage.getItem(key) === 'true'
  } catch {
    return false
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App() {
  const [view, setView] = useState('diagnose')
  const [selectedMuscle, setSelectedMuscle] = useState('chest')
  const [modalStretch, setModalStretch] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [queue, setQueue] = useState(() => readStoredList(QUEUE_KEY))
  const [presets, setPresets] = useState(() => readStoredList(PRESETS_KEY))
  const [favorites, setFavorites] = useState(() => readStoredList(FAVORITES_KEY))
  const [recents, setRecents] = useState(() => readStoredList(RECENTS_KEY))
  const [chimesMuted, setChimesMuted] = useState(() => readStoredBoolean(CHIMES_MUTED_KEY))
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  useEffect(() => {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  }, [queue])

  useEffect(() => {
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
  }, [presets])

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
  }, [recents])

  useEffect(() => {
    window.localStorage.setItem(CHIMES_MUTED_KEY, String(chimesMuted))
  }, [chimesMuted])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  function announce(message) {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(''), 1650)
  }

  function toggleFlow(stretch) {
    const exists = queue.some((entry) => entry.stretchId === stretch.id)
    if (exists) {
      setQueue((current) => current.filter((entry) => entry.stretchId !== stretch.id))
      announce('Flow removed')
    } else {
      setQueue((current) => [
        ...current,
        { stretchId: stretch.id, durationSeconds: stretch.duration, breakAfterSeconds: 0 },
      ])
      announce('Flow added')
    }
  }

  function savePreset(name, entries) {
    setPresets((current) => [
      { id: makeId(), name, entries, createdAt: new Date().toISOString() },
      ...current.filter((preset) => preset.name.toLowerCase() !== name.toLowerCase()),
    ])
    announce('Preset saved')
    return true
  }

  function loadPreset(preset) {
    const knownIds = new Set(stretches.map((stretch) => stretch.id))
    setQueue(preset.entries.filter((entry) => knownIds.has(entry.stretchId)))
    setView('live')
  }

  function removePreset(presetId) {
    setPresets((current) => current.filter((preset) => preset.id !== presetId))
  }

  function toggleFavorite(stretchId) {
    setFavorites((current) =>
      current.includes(stretchId)
        ? current.filter((favoriteId) => favoriteId !== stretchId)
        : [stretchId, ...current],
    )
  }

  function completeFlow(stretchId, wasCompleted = true) {
    if (wasCompleted) {
      setRecents((current) =>
        [stretchId, ...current.filter((recentId) => recentId !== stretchId)].slice(0, 12),
      )
    }
    setQueue((current) => current.filter((entry) => entry.stretchId !== stretchId))
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
        queue={queue}
        onClearQueue={() => setQueue([])}
        onRemoveFlow={(stretchId) =>
          setQueue((current) => current.filter((entry) => entry.stretchId !== stretchId))
        }
        onOpenQueue={() => setView('live')}
      />
      <main className={`main-content${sidebarCollapsed ? ' sidebar-is-collapsed' : ''}`}>
        {view === 'diagnose' && (
          <Diagnose
            selected={selectedMuscle}
            onSelect={setSelectedMuscle}
            onStart={toggleFlow}
            isQueued={(stretchId) => queue.some((entry) => entry.stretchId === stretchId)}
            onDetails={setModalStretch}
          />
        )}
        {view === 'library' && (
          <Library
            onStart={toggleFlow}
            isQueued={(stretchId) => queue.some((entry) => entry.stretchId === stretchId)}
            favorites={favorites}
            recents={recents}
            onToggleFavorite={toggleFavorite}
            onDetails={setModalStretch}
          />
        )}
        {view === 'live' && (
          <LiveSession
            queue={queue}
            onQueueChange={setQueue}
            presets={presets}
            onSavePreset={savePreset}
            onCompleteStretch={completeFlow}
            chimesMuted={chimesMuted}
            onChimesMutedChange={setChimesMuted}
            onClearQueue={() => setQueue([])}
            onStop={() => setView('diagnose')}
            onFindRelief={() => setView('diagnose')}
          />
        )}
        {view === 'presets' && (
          <Presets presets={presets} onLoad={loadPreset} onDelete={removePreset} />
        )}
      </main>
      {toast && (
        <div className="flow-toast" role="status" key={toast}>
          {toast}
        </div>
      )}
      <StretchModal
        stretch={modalStretch}
        isQueued={modalStretch ? queue.some((entry) => entry.stretchId === modalStretch.id) : false}
        onClose={() => setModalStretch(null)}
        onStart={(stretch) => {
          toggleFlow(stretch)
          setModalStretch(null)
        }}
      />
    </>
  )
}
