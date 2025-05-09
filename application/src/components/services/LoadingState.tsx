
export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col items-center text-center py-8 px-4 rounded-lg shadow-lg bg-card animate-fade-in">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-12 h-12 rounded-full border-4 border-primary/20"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-medium mb-1">Loading server data</h3>
        <p className="text-muted-foreground">Please wait while we retrieve your information...</p>
      </div>
    </div>
  );
}
