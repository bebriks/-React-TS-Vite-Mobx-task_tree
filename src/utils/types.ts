export type ITask ={
    id: string
    name: 'main' | 'optional'
    description: string
    optionalTasks: ITask[]
    isChecked: boolean | false
    isOpenConstructor: boolean | false
}