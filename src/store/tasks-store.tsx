import { makeAutoObservable, action, runInAction } from 'mobx'
import { v4 as uuid } from 'uuid'
import { ITask } from '../utils/types'

export class TaskStore {
    params1 = {
        tasks: this.loadTasks() || []
    }
    params3 = {
        isOpenOptionalTaskConstructor: false,
        isOpenTaskConstructor: false
    }

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    private loadTasks(): ITask[] {
        try {
            const savedTasks = localStorage.getItem('tasks')
            return savedTasks ? JSON.parse(savedTasks) : []
        } catch (error) {
            console.error('Error:', error)
            return []
        }
    }

    private saveTasks = () => {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.params1.tasks))
        } catch (error) {
            console.error('Error:', error)
        }
    }

    createNewTask = action((value: ITask) => {
        value.id = uuid()
        this.params1.tasks.push(value)
        this.saveTasks()
    })

        updateOptionalTask = action((taskId: string, updates: Partial<ITask>) => {
            const updateOptionalTaskRecursive = (tasks: ITask[]): boolean => {
                for (const task of tasks) {
                    if (task.id === taskId) {
                        Object.assign(task, updates)
                        return true
                    }
                    if (task.optionalTasks?.length) {
                        if (updateOptionalTaskRecursive(task.optionalTasks)) {
                            return true
                        }
                    }
                }
                return false
            }
        
            runInAction(() => {
                if (updateOptionalTaskRecursive(this.params1.tasks)) {
                    this.saveTasks()
                }
            })
        })
    updateTask = action((taskId: string, updates: Partial<ITask>) => {
        const taskIndex = this.params1.tasks.findIndex(task => task.id === taskId)
        console.log(taskIndex)
        if (taskIndex !== -1) {
            this.params1.tasks[taskIndex] = {
                ...this.params1.tasks[taskIndex],
                ...updates
            }
            this.saveTasks()
        }
    })

    setOpenOptionalTaskConstructor = action((value: boolean) => {
        this.params3.isOpenOptionalTaskConstructor = value
    })

    setOpenTaskConstructor = action((value: boolean) => {
        this.params3.isOpenTaskConstructor = value
    })

    findTaskById = (taskId: string, tasks = this.params1.tasks): ITask | null => {
        for (const task of tasks) {
            if (task.id === taskId) return task
            if (task.optionalTasks?.length) {
                const found = this.findTaskById(taskId, task.optionalTasks)
                if (found) return found
            }
        }
        return null
    }

    removeTask = action((taskId: string) => {
        const removeTaskRecursive = (tasks: ITask[]): ITask[] => {
            return tasks.filter(task => {
                if (task.id === taskId) return false
                if (task.optionalTasks?.length) {
                    task.optionalTasks = removeTaskRecursive(task.optionalTasks)
                }
                return true
            })
        }

        runInAction(() => {
            this.params1.tasks = removeTaskRecursive(this.params1.tasks)
            this.saveTasks()
        })
    })

    toggleTaskCheck = action((taskId: string) => {
        const task = this.findTaskById(taskId)
        const path = this.getTaskChain(taskId)
        if (task) {
            task.isChecked = !task.isChecked
            if (task.optionalTasks?.length) {
                const toggleChildrenRecursive = (tasks: ITask[]) => {
                    tasks.forEach(subtask => {
                        subtask.isChecked = task.isChecked
                        if (subtask.optionalTasks?.length) {
                            toggleChildrenRecursive(subtask.optionalTasks)
                        }
                    })
                }
                toggleChildrenRecursive(task.optionalTasks)
            }
            if(path.length > 0) {
               for (let i = path.length - 1; i >= 0; i--) {
                const mainTask = path[i]
                const isAllSubtaskCompleted = mainTask.optionalTasks?.every(subtask => subtask.isChecked)
                mainTask.isChecked = isAllSubtaskCompleted ? true : false
               }
            }
            this.saveTasks()
        }
    })
    findParentTask = (targetId: string): { parent: ITask | null, path: ITask[] } => {
        const findParentRecursive = (
            tasks: ITask[], 
            targetId: string, 
            currentPath: ITask[] = []
        ): { parent: ITask | null, path: ITask[] } => {
            for (const task of tasks) {
                const newPath = [...currentPath, task]
                
                if (task.optionalTasks?.length) {
                    const isDirectParent = task.optionalTasks.some(subtask => subtask.id === targetId)
                    if (isDirectParent) {
                        return { parent: task, path: newPath }
                    }
                    
                    const result = findParentRecursive(task.optionalTasks, targetId, newPath)
                    if (result.parent) {
                        return result
                    }
                }
            }
            return { parent: null, path: [] }
        }

        return findParentRecursive(this.params1.tasks, targetId)
    }

    getTaskChain = (taskId: string): ITask[] => {
        const { path } = this.findParentTask(taskId)
        return path
    }

    addOptionalTask = action((parentId: string, subtask: ITask) => {
        const parent = this.findTaskById(parentId)
        if (parent) {
            subtask.id = uuid()
            if (!parent.optionalTasks) {
                parent.optionalTasks = []
            }
            parent.optionalTasks.push(subtask)
            this.saveTasks()
        }
    })
}
