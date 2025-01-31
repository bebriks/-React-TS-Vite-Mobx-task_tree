import { observer } from "mobx-react"
import styles from './App.module.scss'
import { Header } from './components/header/header-component'
import { Task } from './components/task/task-component'
import { TaskConstructor } from './components/task/create-task-component'
import { useTaskStore } from './store/context.tsx'

const App = observer(() => {
    const taskStore = useTaskStore()
    return (
      <>
        <div className={`${styles.flex_row} ${styles.main}`}>
          <Header />
          <div className={`${styles.flex_col} ${styles.main}`}>
            {taskStore.params1.tasks.map((task) => 
              <Task key={task.id} task={task} />
            )}
            {taskStore.params3.isOpenTaskConstructor && <TaskConstructor />}
          </div>
        </div>
      </>
    )
})

export default App
