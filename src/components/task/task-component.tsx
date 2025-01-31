import taskStyles from './task-component.module.scss'
import styles from '../../App.module.scss'

import downImg from '/icons/Down.svg'
import closeImg from '/icons/Close.svg'
import plusImg from '/icons/Plus.svg'

import { useState } from 'react'
import { observer } from 'mobx-react'
import { useTaskStore } from '../../store/context.tsx'
import { ITask } from '../../utils/types'
import { TaskOptionalConstructor } from './create-task-optional-component'

export const Task = observer(({ task }: { task: ITask }) => {
    const [openCard, setOpenCard] = useState(false)
    const taskStore = useTaskStore()

    return (

        <div className={`${styles.flex_col} ${task.name === 'main' ? taskStyles.task_container : taskStyles.optional_tasks_container}`} key={task.id}>
            <div className={`${styles.flex_row} ${task.name === 'main' ? taskStyles.task : taskStyles.task_optional}`}>
                <input 
                    className={taskStyles.checkbox} 
                    type="checkbox"
                    checked={task.isChecked}
                    onChange={() => taskStore.toggleTaskCheck(task.id)}/>
                <h2 className={taskStyles.task_description}>{task.description}</h2>
                <div className={taskStyles.action_buttons}>
                    <button 
                        className={`${styles.close_button}`} 
                        onClick={() => {
                            setOpenCard(true)
                            taskStore.updateOptionalTask(task.id, { isOpenConstructor: true })
                        }}
                    >
                        <img className={`${styles.icon}`} src={ plusImg } alt="add task" />
                    </button>
                    <button 
                        className={`${styles.close_button}`} 
                        onClick={() => taskStore.removeTask(task.id)}
                    >
                        <img className={`${styles.icon}`} src={ closeImg } alt="close" />
                    </button>
                    <button 
                        className={`${styles.open_card_button} ${openCard && task.optionalTasks.length > 0 ? styles.opened : ''}`} 
                        onClick={() => setOpenCard(!openCard)}
                    >
                        <img className={`${styles.icon}`} src={ downImg } alt="open" />
                    </button>
                </div>
            </div>
            {openCard && task.optionalTasks?.map((subtask) => (
                <Task 
                    key={subtask.id}
                    task={subtask}
                />
            ))}
            {openCard && task.isOpenConstructor && <TaskOptionalConstructor taskId={ task.id } />}
        </div>
    )
})