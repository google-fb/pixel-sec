import { useState } from 'react'
import { useGame } from './store/gameStore'
import { TitleScreen } from './screens/TitleScreen'
import { MapScreen } from './screens/MapScreen'
import { LevelScreen } from './screens/LevelScreen'
import { SummaryScreen } from './screens/SummaryScreen'
import { SettingsModal } from './components/SettingsModal'
import { cn } from './lib/cn'

export default function App() {
  const phase = useGame((s) => s.phase)
  const currentLevelId = useGame((s) => s.currentLevelId)
  const scanlines = useGame((s) => s.settings.scanlines)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const openSettings = () => setSettingsOpen(true)

  return (
    <div className={cn('relative min-h-screen', scanlines && 'scanlines')}>
      {phase === 'title' && <TitleScreen onOpenSettings={openSettings} />}
      {phase === 'map' && <MapScreen onOpenSettings={openSettings} />}
      {phase === 'level' && currentLevelId && (
        <LevelScreen onOpenSettings={openSettings} />
      )}
      {phase === 'summary' && <SummaryScreen onOpenSettings={openSettings} />}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
