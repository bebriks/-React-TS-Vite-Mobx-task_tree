import styles from '../../App.module.scss'
import taskStyles from './task-component.module.scss'
import { useState } from 'react'
import { useTaskStore } from '../../store/context.tsx'
import { ITask } from '../../utils/types'

export const TaskOptionalConstructor = (taskId: {taskId: string}) => {
    const taskStore = useTaskStore()
    const [taskText, setTaskText] = useState('')

    const handleSave = () => {
        if (taskText.trim()) {
            const newTask: ITask = {
                id: '',
                name: 'optional',
                description: taskText,
                isChecked: false,
                optionalTasks: [],
                isOpenConstructor: false
            }
            taskStore.addOptionalTask(taskId.taskId, newTask)
            setTaskText('')
            taskStore.setOpenTaskConstructor(false)
            taskStore.setOpenOptionalTaskConstructor(false)
            taskStore.updateOptionalTask(taskId.taskId, { isOpenConstructor: false })
        }
    }

    return (
        <div className={`${styles.flex_col} ${taskStyles.optional_tasks_container}`}>
            <div className={`${styles.flex_row} ${taskStyles.task_optional}`}>
                <input 
                    className={taskStyles.checkbox} 
                    type="checkbox" 
                    disabled 
                />
                <input 
                    id="task_text" 
                    name='task_text' 
                    type="text" 
                    placeholder='Enter task' 
                    className={styles.input}
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSave()
                        }
                    }}
                />
                <button 
                    type="button" 
                    className={`${styles.button} ${taskStyles.button}`}
                    onClick={handleSave}
                >
                    Save
                </button>
                <button 
                    type="button" 
                    className={`${styles.button} ${taskStyles.button}`} 
                    onClick={() => taskStore.updateTask(taskId.taskId, { isOpenConstructor: false })}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}