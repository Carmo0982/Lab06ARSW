import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { getAll, getByAuthor, getByAuthorAndName, create } from '../../services/mocks/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const blueprints = await getAll()
  return [...new Set(blueprints.map(bp => bp.author))]
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const items = await getByAuthor(author)
  return { author, items }
})

export const fetchBlueprint = createAsyncThunk('blueprints/fetchBlueprint', async ({ author, name }) => {
  return await getByAuthorAndName(author, name)
})

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  return await create(payload)
})

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    fetchAuthorsStatus: 'idle',
    fetchByAuthorStatus: 'idle',
    fetchBlueprintStatus: 'idle',
    createBlueprintStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => { s.fetchAuthorsStatus = 'loading' })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.fetchAuthorsStatus = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.fetchAuthorsStatus = 'failed'
        s.error = a.error.message
      })

      .addCase(fetchByAuthor.pending, (s) => { s.fetchByAuthorStatus = 'loading' })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.fetchByAuthorStatus = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.fetchByAuthorStatus = 'failed'
        s.error = a.error.message
      })

      .addCase(fetchBlueprint.pending, (s) => { s.fetchBlueprintStatus = 'loading' })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.fetchBlueprintStatus = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.fetchBlueprintStatus = 'failed'
        s.error = a.error.message
      })
  },
})

// Selectores base
const selectByAuthor = (state) => state.blueprints.byAuthor
const selectSelectedAuthor = (_, author) => author

// Memo selector — top 5 por cantidad de puntos
export const selectTop5 = createSelector(
  [selectByAuthor, selectSelectedAuthor],
  (byAuthor, author) => {
    const items = byAuthor[author] || []
    return [...items]
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
  }
)

export default slice.reducer