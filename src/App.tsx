import { ComponentExample } from "@/components/component-example";
import Header from "@/components/header";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
function App() {
  return (
    <>
    <Header />
      <div className='flex items-center justify-center h-screen p-7'>
      {/* Place Results */}
      <div className='w-3/5 h-full bg-gray-100 p-10'>
      <Card className="relative w-full max-w-xs overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
        <CardHeader>
          <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
          <CardDescription>
            Switch to the improved way to explore your data, with natural
            language. Monitoring will no longer be available on the Pro plan in
            November, 2025
          </CardDescription>
        </CardHeader>
      </Card>
      </div>
      {/* Map */}
      <div className='w-2/5 h-full bg-gray-200'><h1>Map</h1></div>
      </div>
    </>
  )
}

export default App
