import React from 'react'

interface AppSpinnerProps {
    className?: string;
}

const AppSpinner = ({ className }: AppSpinnerProps) => {
    const cln = className ? 'app-spinner ' + className : 'app-spinner app-spinner--side blokk--xl'
    return <div className={cln} aria-label="Vent litt mens siden laster" />
}

export default AppSpinner
