import { useEffect, useState, type FormEvent, type PropsWithChildren } from "react"
import cn from 'classnames'
import { Contract, ethers } from "ethers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import TaskItem from "./task-item"
import { CONTRACT } from "../constants"
import abi from '../../abi.json'

interface Task {
  id: number
  text: string
  count: number
}

type TodontProps = PropsWithChildren & {
  account: string
}

export default function Todont(props: TodontProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<number | undefined>()
  const [contract, setContract] = useState<any>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [text, setText] = useState('')
  const [loadingCount, setLoadingCount] = useState(0)
  const [addLoading, setAddLoading] = useState(false)

  const loading = !!loadingCount || addLoading

  const signedIn = !!props.account

  const setLoading = (set: boolean) => setLoadingCount(count => count + (set ? 1 : -1))

  useEffect(() => {
    new ethers.BrowserProvider(window.ethereum).getSigner().then(signer => {
      setContract(new ethers.Contract(CONTRACT, abi, signer))
    })
  }, [props.account])

  const getTasks = () => contract.getTasks().then(setTasks)

  useEffect(() => {
    if (!contract) return
    getTasks()
  }, [contract])

  const whileLoading = async (cb: () => void | Promise<void>) => {
    setLoading(true)
    try {
      await cb()
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: FormEvent) => {
    e.preventDefault()

    if (!text) return

    setAddLoading(true)
    try {
      const res = await contract.addTask(text)
      await res.wait()
      setText('')
      setShowAddForm(false)
      await getTasks()
    } finally {
      setAddLoading(false)
    }
  }

  const incrementTask = (id: number) => {
    whileLoading(async () => {
      const res = await contract.incrementTask(id)
      await res.wait()
      getTasks()
    })
  }

  const deleteTask = (id: number) => {
    whileLoading(async () => {
      const res = await contract.deleteTask(id)
      await res.wait()
      getTasks()
    })
  }

  const selectTask = (id: number) => {
    setSelectedTask(id == selectedTask ? undefined : id)
  }

  return (
    <div className="flex-grow w-full flex flex-col p-4">

      <div className={cn('flex items-end mb-3', signedIn ? 'justify-between' : 'justify-center')}>
        <div className="flex items-end">
          <h1 className="text-3xl font-bold uppercase">
            {signedIn ? (
              <>
                To<br /><span className="text-red-600 ">Don't</span>
              </>
            ) : (
              <>
                To <span className="text-red-600 ">Don't</span>
              </>
            )}
          </h1>
          {loading && <FontAwesomeIcon icon={faSpinner} spin className="ml-3 mb-2" />}
        </div>

        {signedIn && (
          <button
            className={cn('btn btn-icon bg-blue-100', showAddForm && 'outline outline-2')}
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={addLoading}
          >
            &#xff0b;
          </button>
        )}
      </div>

      {signedIn && showAddForm && (
        <form className="flex items-center mb-2" onSubmit={addTask}>
          <input
            className="input w-full"
            placeholder="Be an attention seeker"
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            readOnly={addLoading}
          />
          <button className="btn btn-icon btn-lg ml-2" disabled={addLoading || !text}>
            &#x2713;
          </button>
        </form>
      )}

      <div className="mt-2">
        {props.children}

        {signedIn && !tasks.length && (
          <p className="text-center text-lg text-gray-500 mt-16">It's empty</p>
        )}

        {signedIn && tasks.map((task, i) => (
          <div
            key={task.id}
            className={cn(i % 2 && 'bg-gray-50')}
          >
            <TaskItem
              text={task.text}
              count={task.count.toString()}
              selected={task.id == selectedTask}
              onSelect={() => selectTask(task.id)}
              onIncrement={() => incrementTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}