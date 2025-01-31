import { createContext, useContext } from 'react'
import { TaskStore } from './tasks-store'

const TaskStoreContext = createContext<TaskStore | null>(null)

export const TaskStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const store = new TaskStore()
    return (
        <TaskStoreContext.Provider value={store}>
            {children}
        </TaskStoreContext.Provider>
    )
}

export const useTaskStore = () => {
    const store = useContext(TaskStoreContext)
    if (!store) {
        throw new Error('useTaskStore must be used within a TaskStoreProvider')
    }
    return store
}