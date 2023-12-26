import cn from 'classnames'

type TaskItemProps = {
  text: string
  count: number
  selected?: boolean
  className?: string
  setSelected: (selected: boolean) => void
  onIncrement: () => void
  onDelete: () => void
}

export default function TaskItem(props: TaskItemProps) {
  return (
    <div className={cn('flex items-center', props.className)}>
      <span className="flex-grow text-xl">{props.text}</span>
      <button className="btn btn-icon bg-transparent !font-normal">
        {props.count || 0}
      </button>
    </div>
  )
}