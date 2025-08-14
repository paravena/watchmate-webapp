import React from 'react'
import { Platform } from '@/api/types'

type Props = {
  platforms: Platform[]
}

const PlatformList: React.FC<Props> = ({ platforms }) => {
  if (platforms.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-600">Available on:</span>
      {platforms.map((p) =>
        p.website ? (
          <a
            key={p.id}
            href={p.website}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline"
          >
            {p.name}
          </a>
        ) : (
          <span key={p.id} className="text-sm text-gray-800">
            {p.name}
          </span>
        ),
      )}
    </div>
  )
}

export default PlatformList
