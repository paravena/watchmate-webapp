import React from 'react'
import { Genre } from '@/api/types'

type Props = {
  genres: Genre[]
}

const GenreList: React.FC<Props> = ({ genres }) => {
  if (genres.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {genres.map((g) => (
        <span key={g.id} className="text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-800">
          {g.name}
        </span>
      ))}
    </div>
  )
}

export default GenreList
