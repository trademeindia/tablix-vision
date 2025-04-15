
import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
