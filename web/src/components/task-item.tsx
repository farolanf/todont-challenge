import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

type TaskItemProps = {
  text: React.ReactNode
  count: React.ReactNode
  selected?: boolean
  className?: string
  onSelect: () => void
  onIncrement: () => void
  onDelete: () => void
}

export default function TaskItem(props: TaskItemProps) {
  return (
    <div
      className={cn('flex items-center py-3 px-2 rounded', props.selected && 'outline outline-1', props.className)}
      onClick={() => props.onSelect()}
    >
      <span className="flex-grow text-lg">{props.text}</span>
      <div className='flex items-center gap-4'>
        {props.selected && (
          <>
            <button
              className='btn btn-icon bg-red-500 text-white'
              onClick={e => { e.stopPropagation(); props.onDelete() }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <button
              className='btn btn-icon bg-green-500 text-white'
              onClick={e => { e.stopPropagation(); props.onIncrement() }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </>
        )}
        <span className="w-[42px] h-[42px] flex justify-center items-center rounded-full border border-gray-400">
          {props.count || 0}
        </span>
      </div>
    </div>
  )
}