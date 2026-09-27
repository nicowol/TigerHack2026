import { useState } from 'react'
import { stretches } from '../data/stretches.js'

const stretchById = new Map(stretches.map((stretch) => [stretch.id, stretch]))

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes ? `${minutes}:${String(remainder).padStart(2, '0')}` : `${seconds} sec`
}

export default function PlaylistPlanner({
  queue,
  onQueueChange,
  presets,
  onSavePreset,
  onLoadPreset,
  onClearQueue,
  onClose,
  onStart,
  onBrowse,
}) {
  const [presetName, setPresetName] = useState('')
  const entries = queue
    .map((entry) => ({ ...entry, stretch: stretchById.get(entry.stretchId) }))
    .filter((entry) => entry.stretch)
  const plannedSeconds = entries.reduce(
    (total, entry, index) =>
      total +
      (entry.durationSeconds ?? entry.stretch.duration) +
      (index < entries.length - 1 ? (entry.breakAfterSeconds ?? 0) : 0),
    0,
  )

  function updateEntry(stretchId, field, value) {
    onQueueChange(
      queue.map((entry) =>
        entry.stretchId === stretchId ? { ...entry, [field]: Number(value) } : entry,
      ),
    )
  }

  function moveEntry(index, offset) {
    const next = [...queue]
    const target = index + offset
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onQueueChange(next)
  }

  function removeEntry(stretchId) {
    onQueueChange(queue.filter((entry) => entry.stretchId !== stretchId))
  }

  function savePreset() {
    if (!presetName.trim() || !entries.length) return
    if (
      onSavePreset(
        presetName.trim(),
        entries.map(({ stretch, ...entry }) => entry),
      )
    ) {
      setPresetName('')
    }
  }

  return (
    <div className="playlist-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="playlist-planner card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-planner-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="planner-heading">
          <div>
            <p className="eyebrow">LIVE SESSION / SETUP</p>
            <h2 id="playlist-planner-title">Build your stretch flow</h2>
            <p>Set the time for each stretch, arrange your order, and add breathing room.</p>
          </div>
          <button className="planner-close" onClick={onClose} aria-label="Close playlist setup">
            ×
          </button>
        </div>

        {entries.length ? (
          <>
            <div className="planner-summary">
              <span>
                {entries.length} stretches · about {formatTime(plannedSeconds)}
              </span>
              <button className="planner-clear" onClick={onClearQueue}>
                Clear flow
              </button>
            </div>
            <ol className="planner-list">
              {entries.map((entry, index) => {
                const duration = entry.durationSeconds ?? entry.stretch.duration
                const breakDuration = entry.breakAfterSeconds ?? 0
                const durationFill = ((duration - 10) / 170) * 100
                const breakFill = (breakDuration / 120) * 100
                return (
                  <li className="planner-item" key={entry.stretchId}>
                    <div className="planner-item-heading">
                      <span className="planner-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className="planner-item-title">
                        <strong>{entry.stretch.name}</strong>
                        <small>
                          {entry.stretch.area} · recommended {entry.stretch.duration} sec
                        </small>
                      </div>
                      <div className="planner-order-controls">
                        <button
                          onClick={() => moveEntry(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${entry.stretch.name} up`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveEntry(index, 1)}
                          disabled={index === entries.length - 1}
                          aria-label={`Move ${entry.stretch.name} down`}
                        >
                          ↓
                        </button>
                        <button
                          className="planner-remove"
                          onClick={() => removeEntry(entry.stretchId)}
                          aria-label={`Remove ${entry.stretch.name} from flow`}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <label className="planner-slider-row">
                      <span>Stretch time</span>
                      <strong>{formatTime(duration)}</strong>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        step="5"
                        value={duration}
                        style={{ '--range-progress': `${durationFill}%` }}
                        onChange={(event) =>
                          updateEntry(entry.stretchId, 'durationSeconds', event.target.value)
                        }
                        aria-label={`Duration for ${entry.stretch.name}`}
                      />
                    </label>

                    {index < entries.length - 1 && (
                      <label className="planner-slider-row planner-break-row">
                        <span>Break after</span>
                        <strong>{breakDuration ? formatTime(breakDuration) : 'No break'}</strong>
                        <input
                          type="range"
                          min="0"
                          max="120"
                          step="5"
                          value={breakDuration}
                          style={{ '--range-progress': `${breakFill}%` }}
                          onChange={(event) =>
                            updateEntry(entry.stretchId, 'breakAfterSeconds', event.target.value)
                          }
                          aria-label={`Break after ${entry.stretch.name}`}
                        />
                      </label>
                    )}
                  </li>
                )
              })}
            </ol>

            <div className="planner-save-row">
              <label>
                <span>Save this flow as a preset</span>
                <input
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  maxLength={40}
                  placeholder="e.g. Morning reset"
                />
              </label>
              <button
                className="secondary"
                onClick={savePreset}
                disabled={!presetName.trim() || !entries.length}
              >
                Save preset
              </button>
            </div>

            {presets.length > 0 && (
              <div className="planner-saved-presets">
                <span>Load a saved preset</span>
                {presets.map((preset) => (
                  <button key={preset.id} onClick={() => onLoadPreset(preset)}>
                    {preset.name}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="planner-empty">
            <span>⌁</span>
            <h3>Your flow is empty</h3>
            <p>
              Add stretches from Find relief or the Stretch library, then come back to arrange them.
            </p>
            <button className="primary" onClick={onBrowse}>
              Find stretches
            </button>
          </div>
        )}

        <div className="planner-footer">
          <button className="secondary" onClick={onClose}>
            Close
          </button>
          <button className="primary" onClick={onStart} disabled={!entries.length}>
            Start this set <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
