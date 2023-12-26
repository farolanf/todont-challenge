import { useEffect, useState, type FormEvent } from "react"
import cn from 'classnames'
import { Contract, ethers } from "ethers"
import TaskItem from "./task-item"
import { CONTRACT } from "../constants"
import abi from '../../abi.json'

interface Task {
  id: number
  text: string
  count: number
}

type TodontProps = {
  account: string
}

export default function Todont(props: TodontProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<number | undefined>()
  const [contract, setContract] = useState<any>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [text, setText] = useState('')

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

  const addTask = async (e: FormEvent) => {
    e.preventDefault()

    if (!text) return
    const result = await contract.addTask(text)
    console.log(result)
    setTimeout(getTasks, 3000)
  }

  const incrementTask = (task: Task) => {
    // contract.incrementTask()
  }

  const deleteTask = (task: Task) => { }

  return (
    <div className="flex-grow w-full h-full flex flex-col p-4">

      <div className="flex justify-between items-end mb-2">
        <h1 className="text-3xl font-bold uppercase">
          To<br /><span className="text-red-600 ">Don't</span>
        </h1>

        <button
          className={cn('btn btn-icon bg-blue-100', showAddForm && 'outline outline-2')}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          &#xff0b;
        </button>
      </div>

      {showAddForm && (
        <form className="flex items-center" onSubmit={addTask}>
          <input
            className="input w-full"
            placeholder="Be an attention seeker"
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn btn-icon ml-1" disabled={!text}>
            &#x2713;
          </button>
        </form>
      )}

      <div className="mt-4">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            className="mb-4"
            text={task.text}
            count={task.count}
            selected={task.id == selectedTask}
            setSelected={() => setSelectedTask(task.id)}
            onIncrement={() => incrementTask(task)}
            onDelete={() => deleteTask(task)}
          />
        ))}
      </div>
    </div>
  )
}