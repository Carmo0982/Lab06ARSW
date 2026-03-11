import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status } = useSelector((s) => s.blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput.trim()) return
    setSelectedAuthor(authorInput.trim())
    dispatch(fetchByAuthor(authorInput.trim()))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      {/* left: input + table */}
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div className="search-bar">
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && getBlueprints()}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">
            {selectedAuthor ? `${selectedAuthor}'s blueprints` : 'Results'}
          </h3>
          {status === 'loading' && <p className="status-msg">Loading...</p>}
          {!items.length && status !== 'loading' && (
            <p className="status-msg muted">No results found.</p>
          )}
          {!!items.length && (
            <div className="table-wrapper">
              <table className="bp-table">
                <thead>
                  <tr>
                    <th>Blueprint name</th>
                    <th className="text-right">Points</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td className="bp-name">{bp.name}</td>
                      <td className="text-right">
                        <span className="badge">{bp.points?.length || 0}</span>
                      </td>
                      <td className="text-right">
                        <button className="btn btn-sm primary" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="total-points">
            Total user points: <strong>{totalPoints}</strong>
          </p>
        </div>
      </section>

      {/* right: current blueprint name (Part 5) + canvas */}
      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current Blueprint</h3>
        <div className="field-group">
          <label className="field-label" htmlFor="current-bp-name">
            Blueprint name
          </label>
          <input
            id="current-bp-name"
            type="text"
            className="input current-blueprint-input"
            readOnly
            value={current?.name ?? ''}
            placeholder="No blueprint selected"
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <BlueprintCanvas id="blueprintCanvas" points={current?.points || []} />
        </div>
      </section>
    </div>
  )
}
