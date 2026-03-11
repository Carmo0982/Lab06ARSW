import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  selectTop5,
  deleteBlueprintThunk,
  updateBlueprintThunk,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, fetchByAuthorStatus, fetchBlueprintStatus, error } = useSelector((s) => s.blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [editingBp, setEditingBp] = useState(null)
  const [editPointsJSON, setEditPointsJSON] = useState('')
  const items = byAuthor[selectedAuthor] || []
  const top5 = useSelector((state) => selectTop5(state, selectedAuthor))

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  const handleDelete = (bp) => {
    if (!confirm(`¿Eliminar "${bp.name}"?`)) return
    dispatch(deleteBlueprintThunk({ author: bp.author, name: bp.name }))
  }

  const handleEditStart = (bp) => {
    setEditingBp(bp)
    setEditPointsJSON(JSON.stringify(bp.points || []))
  }

  const handleEditSave = () => {
    try {
      const points = JSON.parse(editPointsJSON)
      dispatch(updateBlueprintThunk({ author: editingBp.author, name: editingBp.name, points }))
      dispatch(fetchBlueprint({ author: editingBp.author, name: editingBp.name })) // ← actualiza el canvas
      setEditingBp(null)
    } catch (e) {
      alert('JSON de puntos inválido')
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>

          {fetchByAuthorStatus === 'loading' && <p>Cargando blueprints...</p>}
          {fetchByAuthorStatus === 'failed' && <p style={{ color: '#f87171' }}>Error: {error}</p>}

          {!items.length && fetchByAuthorStatus !== 'loading' && <p>Sin resultados.</p>}
          {!!items.length && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #334155' }}>
                      Blueprint name
                    </th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #334155' }}>
                      Number of points
                    </th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                        {bp.name}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #1f2937' }}>
                        {bp.points?.length || 0}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937', display: 'flex', gap: 8 }}>
                        <button className="btn" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                        <button className="btn" onClick={() => handleEditStart(bp)}>
                          Edit
                        </button>
                        <button className="btn" style={{ color: '#f87171' }} onClick={() => handleDelete(bp)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 12, fontWeight: 700 }}>Total user points: {totalPoints}</p>

          {top5.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ marginBottom: 8 }}>Top 5 blueprints por puntos:</h4>
              {top5.map((bp, i) => (
                <p key={bp.name} style={{ margin: '4px 0' }}>
                  {i + 1}. {bp.name} — {bp.points?.length || 0} puntos
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current blueprint: {current?.name || '—'}</h3>
        {fetchBlueprintStatus === 'loading' && <p>Cargando plano...</p>}
        {fetchBlueprintStatus === 'failed' && <p style={{ color: '#f87171' }}>Error al cargar el plano</p>}
        <BlueprintCanvas points={current?.points || []} />

        {editingBp && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ marginBottom: 8 }}>Editando: {editingBp.name}</h4>
            <textarea
              className="input"
              rows="4"
              value={editPointsJSON}
              onChange={(e) => setEditPointsJSON(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn primary" onClick={handleEditSave}>Guardar</button>
              <button className="btn" onClick={() => setEditingBp(null)}>Cancelar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}