import Header from "@/components/header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
    <Header />
      <div className='flex items-center justify-center flex-1 min-h-0 p-7'>
      {/* Place Results */}
      <div className='w-[51.5%] h-full p-2 flex flex-wrap gap-4 content-start overflow-y-auto scrollbar-none'>
        <Card className="relative w-full max-w-xs overflow-hidden pt-0">
          <div className="bg-primary absolute inset-0 z-30 aspect-4/3 opacity-50 mix-blend-color" />
          <img
            src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            className="relative z-20 aspect-4/3 w-full object-cover brightness-60 grayscale"
          />
          <CardHeader>
            <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
            <CardDescription>
              Switch to the improved way to explore your data, with natural
              language.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="relative w-full max-w-xs overflow-hidden pt-0">
          <div className="bg-primary absolute inset-0 z-30 aspect-4/3 opacity-50 mix-blend-color" />
          <img
            src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            className="relative z-20 aspect-4/3 w-full object-cover brightness-60 grayscale"
          />
          <CardHeader>
            <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
            <CardDescription>
              Switch to the improved way to explore your data, with natural
              language. 
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="relative w-full max-w-xs overflow-hidden pt-0">
          <div className="bg-primary absolute inset-0 z-30 aspect-4/3 opacity-50 mix-blend-color" />
          <img
            src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            className="relative z-20 aspect-4/3 w-full object-cover brightness-60 grayscale"
          />
          <CardHeader>
            <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
            <CardDescription>
              Switch to the improved way to explore your data, with natural
              language.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="relative w-full max-w-xs overflow-hidden pt-0">
          <div className="bg-primary absolute inset-0 z-30 aspect-4/3 opacity-50 mix-blend-color" />
          <img
            src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            className="relative z-20 aspect-4/3 w-full object-cover brightness-60 grayscale"
          />
          <CardHeader>
            <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
            <CardDescription>
              Switch to the improved way to explore your data, with natural
              language.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      {/* Map */}
      <div className='w-[48.5%] h-[82vh] bg-gray-200 mr-5'><h1>Map</h1></div>
      </div>
    </div>
  )
}

export default App
