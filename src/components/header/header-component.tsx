import { useTaskStore } from '../../store/context.tsx'
import styles from '../../App.module.scss'
import headerStyles from './header-component.module.scss'

export const Header = () => {
    const taskStore = useTaskStore()

    const toggleTaskConstructor = () => {
        taskStore.setOpenTaskConstructor(true)
    }

    return (
        <>
            <header className={headerStyles.header}>
                <button className={styles.button} onClick={toggleTaskConstructor}>
                    <h1>Add</h1>
                </button>
            </header>
        </>
    )
}